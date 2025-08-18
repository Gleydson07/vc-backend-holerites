export class CreateTenantRepositoryDto {
  name: string;
  socialName: string;
  cnpj: string;
}

export class ResponseCreateTenantRepositoryDto {
  id: string;
  name: string;
  socialName: string;
  cnpj: string;
  createdAt: Date;
  updatedAt: Date | null;
}
