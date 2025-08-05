Com certeza! Aqui está o plano de desenvolvimento em formato de checklist Markdown, para que você possa acompanhar o progresso do projeto de forma organizada.

---

### ✅ **Checklist de Desenvolvimento: Aplicação de Holerites (NestJS + Next.js)**

#### ** Fase 0: Configuração do Ambiente e Fundamentos**

- [x] **Ambiente AWS e Ferramentas**
  - [x] Criar conta na AWS.
  - [x] Criar um usuário IAM com acesso programático.
  - [x] Instalar e configurar a AWS CLI com as credenciais do usuário IAM.
- [ ] **Projeto Backend (NestJS)**
  - [x] Instalar a NestJS CLI (`npm i -g @nestjs/cli`).
  - [x] Criar novo projeto NestJS (`nest new backend`).
  - [x] Criar módulos iniciais (`auth`, `users`, `tenants`, `payslips`).
  - [ ] Configurar o módulo `@nestjs/config` para variáveis de ambiente (`.env`).
  - [ ] Instalar o SDK v3 da AWS (`@aws-sdk/client-cognito-identity-provider`, `client-dynamodb`, etc.).
- [ ] **Serverless Framework**
  - [ ] Instalar o Serverless Framework (`npm i -g serverless`).
  - [ ] Criar e configurar o arquivo `serverless.yml` na raiz do projeto backend.
- [ ] **Projeto Frontend (Next.js)**
  - [ ] Criar novo projeto Next.js com TypeScript (`npx create-next-app@latest --ts`).
  - [ ] Configurar uma solução de estilo (ex: Tailwind CSS).
  - [ ] Estruturar pastas do projeto (`/components`, `/lib`, `/hooks`, etc.).
  - [ ] Configurar o arquivo `.env.local` para a URL da API.
  - [ ] Instalar `axios` para chamadas HTTP.

---

#### ** Fase 1: MVP - Autenticação e Gestão de Usuários**

- [ ] **Backend (NestJS)**
  - [ ] Configurar um "User Pool" no AWS Cognito.
  - [ ] **Módulo `Auth`:** Implementar serviço e controller.
    - [ ] Rota `POST /auth/login` para validar credenciais no Cognito e retornar tokens JWT.
    - [ ] Rota `POST /auth/primeiro-acesso` para o colaborador definir sua senha.
  - [ ] **Módulo `Users`:** Implementar serviço e controller.
    - [ ] Rota `POST /users` (protegida) para cadastrar colaborador (cria no Cognito e salva metadados no DynamoDB).
  - [ ] Criar um `AuthGuard` para proteger rotas que exigem autenticação.
- [ ] **Frontend (Next.js)**
  - [ ] Criar as páginas `/login` e `/dashboard`.
  - [ ] Criar o componente de formulário de login.
  - [ ] Configurar um provedor de contexto (ou outra lib de estado) para gerenciar a autenticação.
  - [ ] Implementar a lógica de rotas protegidas (via Middleware ou HOC).

---

#### ** Fase 2: Funcionalidade Principal - Gestão de Holerites**

- [ ] **Backend (NestJS)**
  - [ ] **Upload:**
    - [ ] Criar rota `POST /payslips/upload` com `FileInterceptor`.
    - [ ] Implementar a lógica para salvar o arquivo recebido em um bucket S3 de "uploads".
    - [ ] Implementar o envio de uma mensagem para uma fila SQS com os dados do arquivo.
  - [ ] **Processamento Assíncrono (Função Lambda Separada):**
    - [ ] Criar a função Lambda que é acionada pela fila SQS.
    - [ ] Na Lambda: Baixar o arquivo do S3.
    - [ ] Na Lambda: Processar o arquivo `.xlsx` ou `.csv`.
    - [ ] Na Lambda: Para cada linha, gerar um arquivo PDF.
    - [ ] Na Lambda: Salvar o PDF gerado em um bucket S3 de "processados".
    - [ ] Na Lambda: Salvar os metadados do holerite na tabela DynamoDB.
  - [ ] **Listagem e Download:**
    - [ ] Criar rota `GET /payslips` para listar os holerites do usuário logado.
    - [ ] Criar rota `GET /payslips/:id/download` que verifica a permissão e gera uma URL pré-assinada do S3.
- [ ] **Frontend (Next.js)**
  - [ ] Criar o componente de upload de arquivos no dashboard do RH.
  - [ ] Criar a lista de holerites disponíveis no dashboard do colaborador.
  - [ ] Implementar a chamada à rota de download e abrir a URL pré-assinada recebida.

---

#### ** Fase 3: Conformidade Legal e Relatórios**

- [ ] **Backend (NestJS)**
  - [ ] Implementar a lógica de "recibo digital" (gravar a `dataPrimeiraVisualizacao` no DynamoDB).
  - [ ] Criar a rota `GET /reports/status/:ano/:mes` para o RH consultar o status de visualização.
- [ ] **Frontend (Next.js)**
  - [ ] Criar a página de relatórios no dashboard do RH.
  - [ ] Adicionar a funcionalidade de exportar o relatório para CSV.

---

#### ** Fase 4: Polimento e Preparo para Produção**

- [ ] **Qualidade e Automação**
  - [ ] Escrever testes unitários e de integração com Jest.
  - [ ] Configurar um pipeline de CI/CD (ex: GitHub Actions) para automatizar o deploy.
- [ ] **Infraestrutura e Segurança**
  - [ ] Configurar um domínio customizado para a API (API Gateway) e para o Frontend (Amplify/Vercel).
  - [ ] Revisar as permissões IAM para garantir o princípio do menor privilégio.
- [ ] **Experiência do Usuário**
  - [ ] Melhorar o tratamento de erros e as mensagens de feedback em toda a aplicação.
  - [ ] Revisar a responsividade e usabilidade das interfaces.
