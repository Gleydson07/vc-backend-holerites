-- CreateEnum
CREATE TYPE "public"."batch_type" AS ENUM ('hm', 'hf', 'h13', 'hr', 'ha', 'hplr');

-- CreateEnum
CREATE TYPE "public"."recurrence" AS ENUM ('monthly', 'yearly');

-- CreateEnum
CREATE TYPE "public"."payment_method" AS ENUM ('pix', 'debit_card', 'credit_card');

-- CreateEnum
CREATE TYPE "public"."payment_status" AS ENUM ('approved', 'failed', 'pending');

-- CreateEnum
CREATE TYPE "public"."subscription_status" AS ENUM ('active', 'overdue', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."access_profile" AS ENUM ('admin', 'manager', 'employee');

-- CreateTable
CREATE TABLE "public"."tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "social_name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "user_provider_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "last_login_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_tenant" (
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_profile" "public"."access_profile" NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_tenant_pkey" PRIMARY KEY ("tenant_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."employee" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payroll_batch" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "reference_date" TEXT NOT NULL,
    "batch_type" "public"."batch_type",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payroll_batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payroll" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "file_key" TEXT,
    "generation_date" TIMESTAMP(3),
    "enabled_at" TIMESTAMP(3),
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payroll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_cpf_tenant_id_user_id_key" ON "public"."employee"("cpf", "tenant_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."user_tenant" ADD CONSTRAINT "user_tenant_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_tenant" ADD CONSTRAINT "user_tenant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payroll_batch" ADD CONSTRAINT "payroll_batch_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payroll" ADD CONSTRAINT "payroll_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payroll" ADD CONSTRAINT "payroll_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
