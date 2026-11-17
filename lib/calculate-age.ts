export function calculateAge(birthDate: string | null): number | null {
  if (!birthDate) return null;

  const [year, month, day] = birthDate.split("-").map(Number);

  if (!year || !month || !day) return null;

  const today = new Date();

  let age = today.getFullYear() - year;

  const birthdayHasPassed =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!birthdayHasPassed) {
    age--;
  }

  return age >= 0 ? age : null;
}
