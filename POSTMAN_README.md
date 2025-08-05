# Postman Collection - Holerites API

Esta collection contém todos os endpoints disponíveis para as APIs de **Authentication** e **Users** do sistema Holerites.

## Arquivos

- `Holerites_API.postman_collection.json` - Collection principal com todos os endpoints
- `Holerites_Development.postman_environment.json` - Environment para desenvolvimento local

## Como Importar

### 1. Importar a Collection

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `Holerites_API.postman_collection.json`
4. Clique em **Import**

### 2. Importar o Environment

1. No Postman, clique no ícone de **Settings** (engrenagem) no canto superior direito
2. Selecione **Manage Environments**
3. Clique em **Import**
4. Selecione o arquivo `Holerites_Development.postman_environment.json`
5. Clique em **Import**

### 3. Configurar o Environment

1. Selecione o environment **Holerites Development** no dropdown no canto superior direito
2. As variáveis já estão pré-configuradas:
   - `base_url`: http://localhost:3000 (altere se necessário)
   - `access_token`: será preenchido após fazer login

## Endpoints Disponíveis

### 🔐 Authentication

#### POST /api/signin

- **Descrição**: Autentica o usuário com CPF e senha
- **Body**:
  ```json
  {
    "cpf": "12345678901",
    "senha": "MinhaSenh@123"
  }
  ```
- **Resposta**: JWT token ou desafio NEW_PASSWORD_REQUIRED

#### POST /api/new-password-challenge

- **Descrição**: Completa o desafio de nova senha quando necessário
- **Body**:
  ```json
  {
    "cpf": "12345678901",
    "novaSenha": "NovaSenha@123",
    "session": "session_token_from_signin_response"
  }
  ```

### 👥 Users

> **Nota**: Todos os endpoints de usuários requerem autenticação JWT

#### POST /api

- **Descrição**: Cria um novo usuário
- **Permissões**: ADMINISTRATORS ou MANAGERS
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Body**:
  ```json
  {
    "cpf": "98765432109",
    "email": "usuario@exemplo.com",
    "nome": "João Silva",
    "grupo": "EMPLOYEES"
  }
  ```
- **Grupos disponíveis**: `ADMINISTRATORS`, `MANAGERS`, `EMPLOYEES`

#### PATCH /api/status

- **Descrição**: Ativa/desativa uma conta de usuário
- **Permissões**: ADMINISTRATORS ou MANAGERS
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Body**:
  ```json
  {
    "cpf": "98765432109",
    "enabled": false
  }
  ```

## Fluxo de Uso Recomendado

### 1. Fazer Login

1. Execute o endpoint **Sign In** com suas credenciais
2. Copie o `access_token` da resposta
3. Cole o token na variável `access_token` do environment

### 2. Usar Endpoints Protegidos

- Todos os endpoints de usuários usam automaticamente a variável `{{access_token}}`
- Certifique-se de que o token esteja válido e não expirado

### 3. Tratamento de Erro de Nova Senha

- Se o login retornar `NEW_PASSWORD_REQUIRED`
- Use o endpoint **New Password Challenge** com o session token recebido

## Validações

### CPF

- Deve conter exatamente 11 dígitos
- Formato: apenas números (ex: "12345678901")

### Senha

- Mínimo 6 caracteres
- Deve conter pelo menos:
  - 1 letra minúscula
  - 1 letra maiúscula
  - 1 número

### Email

- Formato de email válido (quando fornecido)

## Variáveis de Environment

| Variável       | Descrição                   | Valor Padrão                   |
| -------------- | --------------------------- | ------------------------------ |
| `base_url`     | URL base da API             | http://localhost:3000          |
| `access_token` | Token JWT para autenticação | (vazio - preencher após login) |

## Notas Importantes

- A API usa o prefixo `/api` para todos os endpoints
- Autenticação é obrigatória para todos os endpoints de usuários
- O sistema de permissões é baseado em grupos (roles)
- Tokens JWT podem expirar e precisar ser renovados
