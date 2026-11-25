import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Variáveis de ambiente não configuradas.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const BUCKET = "student-photos";

const THUMBNAIL_SIZE = 128;

const QUALITY = 80;

const PAGE_SIZE = 100;

const APPLY = process.argv.includes("--apply");

async function migrate() {
  let total = 0;
  let migrated = 0;
  let failed = 0;
  let skipped = 0;
  let originalBytes = 0;
  let thumbnailBytes = 0;
  let lastId: string | null = null;

  console.log("\n=================================");
  console.log("MIGRAÇÃO DE MINIATURAS");
  console.log("=================================");

  console.log(APPLY ? "Modo: MIGRAÇÃO REAL" : "Modo: SIMULAÇÃO");

  while (true) {
    let query = supabase
      .from("student_photos")
      .select(
        `
                id,
                student_id,
                storage_path
            `,
      )
      .is("thumbnail_path", null)
      .order("id", { ascending: true })
      .limit(PAGE_SIZE);

    if (lastId) {
      query = query.gt("id", lastId);
    }

    const { data: photos, error } = await query;

    if (error) throw error;

    if (!photos?.length) break;

    lastId = photos[photos.length - 1].id;

    for (const photo of photos) {
      total++;

      const thumbnailPath = `${photo.student_id}/thumbnails/${photo.id}.webp`;

      if (!APPLY) {
        console.log(`[SIMULAÇÃO] ${thumbnailPath}`);
        continue;
      }

      try {
        // BAIXAR A FOTO ORIGINAL

        const { data: original, error: downloadError } = await supabase.storage
          .from(BUCKET)
          .download(photo.storage_path);

        if (downloadError) {
          throw downloadError;
        }

        if (!original) {
          throw new Error("Fotografia não encontrada.");
        }

        const buffer = Buffer.from(await original.arrayBuffer());

        // GERAR MINIATURA

        const thumbnail = await sharp(buffer)
          .rotate()
          .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
            fit: "cover",
            position: "centre",
          })
          .webp({
            quality: QUALITY,
          })
          .toBuffer();

        // ENVIAR MINIATURA

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(thumbnailPath, thumbnail, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        // ATUALIZAR BANCO DE DADOS

        const { data: updated, error: updateError } = await supabase
          .from("student_photos")
          .update({
            thumbnail_path: thumbnailPath,
          })
          .eq("id", photo.id)
          .is("thumbnail_path", null)
          .select("id");

        if (updateError) {
          throw updateError;
        }

        if (!updated?.length) {
          skipped++;

          console.warn(`[IGNORADA] ${photo.id}`);

          continue;
        }

        migrated++;

        originalBytes += buffer.length;
        thumbnailBytes += thumbnail.length;

        console.log(
          `[OK] ${photo.id} | ` +
            `${(buffer.length / 1024).toFixed(1)} KB → ` +
            `${(thumbnail.length / 1024).toFixed(1)} KB`,
        );
      } catch (error) {
        failed++;

        console.error(`[ERRO] ${photo.id}`, error);
      }
    }
  }

  console.log("\n=================================");
  console.log("RESULTADO");
  console.log("=================================");

  console.log(`Total encontradas: ${total}`);
  console.log(`Migradas: ${migrated}`);
  console.log(`Ignoradas: ${skipped}`);
  console.log(`Falhas: ${failed}`);

  if (APPLY && originalBytes > 0) {
    const reduction = (1 - thumbnailBytes / originalBytes) * 100;

    console.log(
      `Tamanho original: ${(originalBytes / 1024 / 1024).toFixed(2)} MB`,
    );

    console.log(`Miniaturas: ${(thumbnailBytes / 1024 / 1024).toFixed(2)} MB`);

    console.log(`Redução de tamanho: ${reduction.toFixed(2)}%`);
  }

  if (!APPLY) {
    console.log("\nNenhuma alteração foi realizada.");
  }

  if (failed > 0) {
    process.exitCode = 1;
  }
}

migrate().catch((error) => {
  console.error("Erro na migração:", error);
  process.exitCode = 1;
});
