export function isValidCPF(value: string | null | undefined): boolean {
  if (!value) return false;

  const digits = value.replace(/\D/g, '');

  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i], 10) * (10 - i);
  }

  let firstCheck = 11 - (sum % 11);
  if (firstCheck >= 10) firstCheck = 0;
  if (firstCheck !== parseInt(digits[9], 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i], 10) * (11 - i);
  }

  let secondCheck = 11 - (sum % 11);
  if (secondCheck >= 10) secondCheck = 0;
  if (secondCheck !== parseInt(digits[10], 10)) return false;

  return true;
}

export function normalizeCPF(value: string | null | undefined): string | null {
  if (!value) return null;

  const digits = value.replace(/\D/g, '');
  return digits.length === 11 ? digits : null;
}
