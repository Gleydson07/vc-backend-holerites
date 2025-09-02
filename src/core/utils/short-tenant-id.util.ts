export function shortingTenantId(
  tenantId: string,
  maxLength: number = 6,
): string {
  if (!tenantId) return '';

  return tenantId.substring(0, maxLength);
}
