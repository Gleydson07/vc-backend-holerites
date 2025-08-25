import crypto from 'crypto';

export function generateRandomPassword(length: number = 12): string {
  if (Number.isNaN(length)) length = 12;
  if (length < 6) length = 6;
  if (length > 12) length = 12;

  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*';

  const requiredSets = [upper, lower, digits];
  const all = upper + lower + digits + symbols;

  const chars: string[] = [];
  requiredSets.forEach((set) => {
    chars.push(pickRandom(set));
  });

  while (chars.length < length) {
    chars.push(pickRandom(all));
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

function pickRandom(source: string): string {
  const idx = randomInt(source.length);
  return source[idx];
}

function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;

  const range = 256 - (256 % maxExclusive);
  let x: number;

  do {
    x = crypto.randomBytes(1)[0];
  } while (x >= range);

  return x % maxExclusive;
}
