# Regras de Negócio — Emissão e Distribuição de Holerites

## PERMISSIONS

- Apenas USER ADMIN SYSTEM tem autonomia de CRIAR tenants
- Apenas USER ADMIN TENANT tem autonomia para EDITAR dados cadastrais do tenant
- USER ADMIN TENANT é criado junto com o tenant
- USER ADMIN TENANT pode criar MANAGERS, EMPLOYEES, BATCHES e PAYSLIPS (acesso full)
- USER ADMIN TENANT é único para cada tenant
- USER MANAGER TENANT pode ser multiplo, mas não tem autorização sobre USER ADMIN TENANT
- USER MANAGER TENANT não pode CRIAR/EDITAR/DESABILITAR outros MANAGERS
- USER MANAGER TENANT pode CRIAR/EDITAR/LER/REMOVER BATCHES USERS EMPLOYEERS
- USER MANAGER TENANT pode CRIAR/EDITAR/LER/REMOVER BATCHES e PAYSLIPS
- USER EMPLOYEE TENANT podem LER seus próprios PAYSLIPS
- USER EMPLOYEE TENANT podem EDITAR/LER seus próprios dados cadastrais
- USER EMPLOYEE TENANT não podem LER outros PAYSLIPS que não sejam seus

## TENANTS

Tenants são empresas dentro da aplicação SaaS. Cada tenant teu seu escopo delimitado dentro da aplicação, de forma que seus dados não devem em hipotese alguma trafegar entre diferentes tenants.
Um tenant é criado quando uma empresa adquire uma assinatura do serviço HOLERITES, junto ao tenant é criado um USER ADMIN TENANT, que é o responsável pelo uso da aplicação e ter permissão completa em todo o tenant, para definir as configurações de uso.

## USERS

São os usuários da aplicação que interagem dentro do contexto do tenant, estão distribuidos sob os seguintes grupos e perfis:
STAFF: Grupo de usuários gestores
ADMIN: Único por tenant, possui acesso full ao tenant
MANAGER: Pode existir mais de um, é o responsável por gerir a aplicação no dia a dia.
EMPLOYEE: São usuários que acessam a aplicação apenas para LER os documentos disponibilizados

## STAFF

É onde inserimos os dados cadastrais dos usuários gestores, estes dados servem para identificar a pessoa e efetuar recuperações de senhar ou registros de logs sobre as ação na aplicação.

## EMPLOYEE

É onde cadastramos os funcionários que possuem HOLERITES, os funcionários para acessar estes holerites precisam estar vinculados a um usuário, mas podemos ter employees sem um usuário vinculado.

## BATCHES

São os LOTES ao qual os HOLERITES estão vinculado, assim é possível emitir holerites em massa com configurações pré-definidas.

## PAYSLIPS

Estes são os HOLERITES, ou seja, o objeto de entrega aos EMPLOYEES. Holerites são de acesso restrito aos ADMIN, MANAGERS e o EMPLOYEE proprietário. Em nenhum caso um holerite do EMPLOYEE A pode ser acessado por qualquer outro EMPLOYEE.
