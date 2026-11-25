import type { createClient } from "@/lib/supabase-server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

const BUCKET = "student-photos";

const SIGNED_URL_EXPIRATION = 3600;

type StudentWithId = {
  id: string;
};

export async function getStudentPrimaryPhotoUrls(
  supabase: SupabaseClient,
  studentIds: string[],
): Promise<Map<string, string>> {
  const photoMap = new Map<string, string>();

  const uniqueIds = [...new Set(studentIds)];

  if (uniqueIds.length === 0) {
    return photoMap;
  }

  const { data: photos, error: photosError } = await supabase
    .from("student_photos")
    .select(
      `
            student_id,
            thumbnail_path
        `,
    )
    .in("student_id", uniqueIds)
    .eq("is_primary", true)
    .not("thumbnail_path", "is", null);

  if (photosError) {
    console.error("Erro ao consultar miniaturas:", photosError);

    return photoMap;
  }

  if (!photos?.length) {
    return photoMap;
  }

  const paths = [
    ...new Set(
      photos
        .map((photo) => photo.thumbnail_path)
        .filter(
          (path): path is string => typeof path === "string" && path.length > 0,
        ),
    ),
  ];

  if (paths.length === 0) {
    return photoMap;
  }

  const { data: signedUrls, error: signedUrlsError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_EXPIRATION);

  if (signedUrlsError) {
    console.error("Erro ao gerar URLs das miniaturas:", signedUrlsError);

    return photoMap;
  }

  const urlsByPath = new Map<string, string>();

  for (const item of signedUrls || []) {
    if (item.path && item.signedUrl && !item.error) {
      urlsByPath.set(item.path, item.signedUrl);
    }
  }

  for (const photo of photos) {
    if (!photo.thumbnail_path) continue;

    const signedUrl = urlsByPath.get(photo.thumbnail_path);

    if (signedUrl) {
      photoMap.set(photo.student_id, signedUrl);
    }
  }

  return photoMap;
}

export async function attachStudentPrimaryPhotos<T extends StudentWithId>(
  supabase: SupabaseClient,
  students: T[],
): Promise<
  (T & {
    foto_principal_url: string | null;
  })[]
> {
  const photoMap = await getStudentPrimaryPhotoUrls(
    supabase,
    students.map((student) => student.id),
  );

  return students.map((student) => ({
    ...student,

    foto_principal_url: photoMap.get(student.id) ?? null,
  }));
}
