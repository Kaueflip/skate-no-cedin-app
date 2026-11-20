import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

type Student = {
  id: string;
  nome: string;
  foto_url: string | null;
};

type StudentPhoto = {
  id: string;
  storage_path: string;
  is_primary: boolean;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  throw new Error(
    "Variáveis NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SECRET_KEY não encontradas.",
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const OLD_BUCKET = "alunos";
const NEW_BUCKET = "student-photos";

const OLD_BUCKET_PREFIX = "/storage/v1/object/public/alunos/";

function extractStoragePath(photoUrl: string): string | null {
  try {
    const url = new URL(photoUrl);
    const supabaseOrigin = new URL(SUPABASE_URL!).origin;

    if (url.origin !== supabaseOrigin) {
      return null;
    }

    if (!url.pathname.startsWith(OLD_BUCKET_PREFIX)) {
      return null;
    }

    const path = decodeURIComponent(
      url.pathname.slice(OLD_BUCKET_PREFIX.length),
    );

    return path || null;
  } catch {
    return null;
  }
}

async function migratePhotos() {
  console.log("\n======================================");
  console.log(" MIGRAÇÃO DE FOTOS DOS ALUNOS");
  console.log("======================================\n");

  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, nome, foto_url")
    .not("foto_url", "is", null)
    .order("nome");

  if (studentsError) {
    throw studentsError;
  }

  const records = (students ?? []) as Student[];

  let migrated = 0;
  let alreadyMigrated = 0;
  let skippedHasGallery = 0;
  let missing = 0;
  let invalidUrl = 0;
  let errors = 0;
  let cleanupErrors = 0;

  console.log(`Alunos encontrados: ${records.length}\n`);

  for (const student of records) {
    if (!student.foto_url) continue;

    const oldPath = extractStoragePath(student.foto_url);

    if (!oldPath) {
      invalidUrl++;
      console.log(`[URL INVÁLIDA] ${student.nome}`);
      continue;
    }

    // Caminho determinístico para impedir duplicidade.
    const newPath = `${student.id}/migrated-perfil.jpg`;

    let uploadedByThisRun = false;

    try {
      // 1. Verifica se o aluno já possui fotos na galeria.
      const { data: existingPhotos, error: photosError } = await supabase
        .from("student_photos")
        .select("id, storage_path, is_primary")
        .eq("student_id", student.id);

      if (photosError) {
        throw photosError;
      }

      const photos = (existingPhotos ?? []) as StudentPhoto[];

      // 2. Se já existe o registro da migração, não duplica.
      const alreadyExists = photos.some(
        (photo) => photo.storage_path === newPath,
      );

      if (alreadyExists) {
        alreadyMigrated++;
        console.log(`[JÁ MIGRADA] ${student.nome}`);
        continue;
      }

      // 3. Não substitui fotos adicionadas anteriormente.
      if (photos.length > 0) {
        skippedHasGallery++;
        console.log(`[IGNORADA] ${student.nome} — já possui fotos na galeria`);
        continue;
      }

      // 4. Baixa a imagem do bucket antigo.
      const { data: oldFile, error: downloadError } = await supabase.storage
        .from(OLD_BUCKET)
        .download(oldPath);

      if (downloadError || !oldFile) {
        missing++;
        console.log(`[ARQUIVO AUSENTE] ${student.nome}`);
        continue;
      }

      // 5. Envia a imagem para o bucket privado.
      const { error: uploadError } = await supabase.storage
        .from(NEW_BUCKET)
        .upload(newPath, oldFile, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      uploadedByThisRun = true;

      // 6. Cria o registro e define a foto como principal.
      const { error: insertError } = await supabase
        .from("student_photos")
        .insert({
          student_id: student.id,
          storage_path: newPath,
          is_primary: true,
        });

      if (insertError) {
        throw insertError;
      }

      migrated++;

      console.log(`[MIGRADA] ${student.nome}`);
    } catch (error) {
      errors++;

      console.error(
        `[ERRO] ${student.nome}:`,
        error instanceof Error ? error.message : error,
      );

      // 7. Se o upload ocorreu, verifica se o registro
      // foi realmente criado antes de tentar remover o arquivo.
      if (uploadedByThisRun) {
        const { data: insertedPhoto, error: checkError } = await supabase
          .from("student_photos")
          .select("id")
          .eq("storage_path", newPath)
          .maybeSingle();

        if (checkError) {
          cleanupErrors++;
          console.error(
            `[ATENÇÃO] Não foi possível verificar o registro de ${student.nome}. O arquivo foi preservado no Storage.`,
            checkError.message,
          );
          continue;
        }

        // Se o registro existe, preserva o arquivo.
        if (insertedPhoto) {
          console.log(
            `[PRESERVADA] O registro de ${student.nome} existe no banco.`,
          );
          continue;
        }

        // Só remove o arquivo quando temos certeza
        // de que o registro não foi criado.
        const { error: removeError } = await supabase.storage
          .from(NEW_BUCKET)
          .remove([newPath]);

        if (removeError) {
          cleanupErrors++;
          console.error(
            `[FALHA NA LIMPEZA] ${student.nome}:`,
            removeError.message,
          );
        }
      }
    }
  }

  console.log("\n======================================");
  console.log(" RESULTADO DA MIGRAÇÃO");
  console.log("======================================");

  console.log(`Total analisado: ${records.length}`);
  console.log(`Migradas com sucesso: ${migrated}`);
  console.log(`Já migradas: ${alreadyMigrated}`);
  console.log(`Ignoradas por já possuir galeria: ${skippedHasGallery}`);
  console.log(`Arquivos ausentes: ${missing}`);
  console.log(`URLs inválidas: ${invalidUrl}`);
  console.log(`Erros: ${errors}`);
  console.log(`Falhas na limpeza: ${cleanupErrors}`);

  console.log("\nBucket antigo: preservado.");
  console.log("Campo students.foto_url: preservado.");
  console.log("======================================\n");
}

migratePhotos().catch((error) => {
  console.error("\nFALHA GERAL NA MIGRAÇÃO:", error);
  process.exitCode = 1;
});
