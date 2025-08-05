# Aliases do Projeto

Este projeto utiliza aliases para facilitar as importações e tornar o código mais limpo e legível.

## Aliases Configurados

| Alias         | Caminho                 | Descrição                      |
| ------------- | ----------------------- | ------------------------------ |
| `@/*`         | `src/*`                 | Raiz do código fonte           |
| `@app/*`      | `src/*`                 | Aplicação principal            |
| `@core/*`     | `src/core/*`            | Funcionalidades centrais       |
| `@domain/*`   | `src/domain/*`          | Lógica de domínio              |
| `@infra/*`    | `src/infra/*`           | Infraestrutura                 |
| `@auth/*`     | `src/domain/auth/*`     | Módulo de autenticação         |
| `@users/*`    | `src/domain/users/*`    | Módulo de usuários             |
| `@tenants/*`  | `src/domain/tenants/*`  | Módulo de tenants              |
| `@payslips/*` | `src/domain/payslips/*` | Módulo de holerites            |
| `@common/*`   | `src/common/*`          | Utilitários comuns             |
| `@config/*`   | `src/config/*`          | Configurações                  |
| `@database/*` | `src/database/*`        | Configuração de banco de dados |
| `@shared/*`   | `src/shared/*`          | Componentes compartilhados     |
| `@test/*`     | `test/*`                | Arquivos de teste              |

## Exemplos de Uso

### Antes (sem aliases)

```typescript
import { AuthService } from './domain/auth/auth.service';
import { UsersModule } from './domain/users/users.module';
import { PayslipEntity } from './domain/payslips/entities/payslip.entity';
import { CreateTenantDto } from './domain/tenants/dto/create-tenant.dto';
```

### Depois (com aliases)

```typescript
import { AuthService } from '@auth/auth.service';
import { UsersModule } from '@users/users.module';
import { PayslipEntity } from '@payslips/entities/payslip.entity';
import { CreateTenantDto } from '@tenants/dto/create-tenant.dto';
```

## Configuração

Os aliases estão configurados em:

1. **TypeScript**: `tsconfig.json` - seção `compilerOptions.paths`
2. **Jest (testes unitários)**: `package.json` - seção `jest.moduleNameMapping`
3. **Jest E2E**: `test/jest-e2e.json` - seção `moduleNameMapping`

## Benefícios

- **Código mais limpo**: Importações mais curtas e legíveis
- **Refatoração facilitada**: Mudanças de estrutura de pastas são mais fáceis
- **Consistência**: Padrão uniforme de importações em todo o projeto
- **Intellisense**: Melhor suporte a autocompletar no VS Code
- **Manutenibilidade**: Menos dependência de caminhos relativos

## Dicas

- Use `@/` para importações genéricas dentro de `src/`
- Use aliases específicos (`@auth/`, `@users/`, etc.) para módulos de domínio
- Para arquivos na mesma pasta, continue usando importações relativas (`./`)
- Para arquivos em pastas irmãs, prefira usar aliases
