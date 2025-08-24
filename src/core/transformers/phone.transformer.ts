import { Transform } from 'class-transformer';

/**
 * Normaliza telefones brasileiros para o formato +55DDXXXXXXXXX
 * Aceita entradas com ou sem +55, com espaços, parênteses ou hífens.
 * Mantém vazio/undefined/null sem alteração para permitir validação opcional.
 */
export function normalizeBrazilPhone(raw: any): any {
  if (raw === null || raw === undefined || raw === '') return raw;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return raw;

  // Remove prefixos 00 ou 055 redundantes
  let cleaned = digits.replace(/^00/, '');

  // Se já começa com 55, remove somente esse prefixo para remontar padronizado
  if (cleaned.startsWith('55')) {
    cleaned = cleaned.slice(2);
  }

  return `+55${cleaned}`;
}

/**
 * Decorator de transformação para aplicar a normalização de telefone brasileiro.
 */
export const TransformPhone = () =>
  Transform(({ value }) => normalizeBrazilPhone(value));
