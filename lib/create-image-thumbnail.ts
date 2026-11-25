export async function createImageThumbnail(
  file: File,
  size = 128,
  quality = 0.8,
): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Arquivo de imagem inválido.");
  }

  const bitmap = await createImageBitmap(file);

  try {
    const canvas = document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Não foi possível criar a miniatura.");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const cropSize = Math.min(bitmap.width, bitmap.height);

    const sourceX = (bitmap.width - cropSize) / 2;

    const sourceY = (bitmap.height - cropSize) / 2;

    context.drawImage(
      bitmap,
      sourceX,
      sourceY,
      cropSize,
      cropSize,
      0,
      0,
      size,
      size,
    );

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.type !== "image/webp") {
            reject(new Error("Não foi possível gerar a miniatura WebP."));

            return;
          }

          resolve(blob);
        },
        "image/webp",
        quality,
      );
    });
  } finally {
    bitmap.close();
  }
}
