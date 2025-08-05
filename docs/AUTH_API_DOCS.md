# Auth API Documentation

## Endpoints

### 1. Sign In

**POST** `/auth/signin`

Realiza o login do usuário. Pode retornar tokens de autenticação ou um desafio de nova senha.

**Body:**

```json
{
  "cpf": "12345678901",
  "senha": "minhasenha123"
}
```

**Resposta de Sucesso:**

```json
{
  "success": true,
  "tokens": {
    "AccessToken": "...",
    "IdToken": "...",
    "RefreshToken": "...",
    "TokenType": "Bearer",
    "ExpiresIn": 3600
  }
}
```

**Resposta com Desafio de Nova Senha:**

```json
{
  "success": false,
  "challengeName": "NEW_PASSWORD_REQUIRED",
  "session": "..."
}
```

### 2. New Password Challenge

**POST** `/auth/new-password-challenge`

Define nova senha quando o usuário precisa trocar a senha temporária.

**Body:**

```json
{
  "cpf": "12345678901",
  "novaSenha": "NovaSenha123!",
  "session": "session_token_do_signin"
}
```

**Resposta:**

```json
{
  "success": true,
  "tokens": {
    "AccessToken": "...",
    "IdToken": "...",
    "RefreshToken": "...",
    "TokenType": "Bearer",
    "ExpiresIn": 3600
  }
}
```

### 3. Admin Create User

**POST** `/auth/admin/create-user`

Cria um novo usuário no sistema (função administrativa).

**Body:**

```json
{
  "cpf": "12345678901",
  "email": "user@example.com",
  "nome": "João Silva"
}
```

**Resposta:**

```json
{
  "UserSub": "...",
  "Username": "12345678901",
  "UserAttributes": [
    {
      "Name": "name",
      "Value": "João Silva"
    },
    {
      "Name": "email",
      "Value": "user@example.com"
    }
  ],
  "UserStatus": "FORCE_CHANGE_PASSWORD"
}
```

## Validações

### CPF

- Deve conter exatamente 11 dígitos
- Apenas números são aceitos

### Senha (Sign In)

- Mínimo de 6 caracteres
- Deve conter pelo menos:
  - 1 letra minúscula
  - 1 letra maiúscula
  - 1 número

### Nova Senha

- Mínimo de 6 caracteres
- Deve conter pelo menos:
  - 1 letra minúscula
  - 1 letra maiúscula
  - 1 número

### Email

- Formato de email válido
- Campo opcional

### Nome

- Campo obrigatório
- Não pode ser vazio
