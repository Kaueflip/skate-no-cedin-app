import type { createClient } from "@/lib/supabase-browser";

import { createImageThumbnail } from "@/lib/create-image-thumbnail";

type SupabaseClient = ReturnType<typeof createClient>;

const BUCKET = "student-photos";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadStudentPhoto(
  supabase: SupabaseClient,
  studentId: string,
  file: File,
  isPrimary: boolean,
): Promise<void> {
  const extension = EXTENSIONS[file.type];

  if (!extension) {
    throw new Error("Formato inválido. Use JPG, PNG ou WEBP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }

  const photoId = crypto.randomUUID();

  const storagePath = `${studentId}/${photoId}.${extension}`;

  const thumbnailPath = `${studentId}/thumbnails/${photoId}.webp`;

  const thumbnail = await createImageThumbnail(file, 128, 0.8);

  const uploadedPaths: string[] = [];

  try {
    // UPLOAD DA FOTO ORIGINAL

    const { error: photoError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (photoError) {
      throw photoError;
    }

    uploadedPaths.push(storagePath);

    // UPLOAD DA MINIATURA

    const { error: thumbnailError } = await supabase.storage
      .from(BUCKET)
      .upload(thumbnailPath, thumbnail, {
        contentType: "image/webp",
        upsert: false,
      });

    if (thumbnailError) {
      throw thumbnailError;
    }

    uploadedPaths.push(thumbnailPath);

    // REGISTRO NO BANCO

    const { error: insertError } = await supabase
      .from("student_photos")
      .insert({
        student_id: studentId,
        storage_path: storagePath,
        thumbnail_path: thumbnailPath,
        is_primary: isPrimary,
      });

    if (insertError) {
      throw insertError;
    }
  } catch (error) {
    // LIMPEZA DOS ARQUIVOS EM CASO DE FALHA

    if (uploadedPaths.length > 0) {
      const { error: cleanupError } = await supabase.storage
        .from(BUCKET)
        .remove(uploadedPaths);

      if (cleanupError) {
        console.error("Erro ao limpar arquivos:", cleanupError);
      }
    }

    throw error;
  }
}
