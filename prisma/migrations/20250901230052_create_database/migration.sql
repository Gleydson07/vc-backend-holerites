-- CreateEnum
CREATE TYPE "public"."StaffRole" AS ENUM ('admin', 'manager');

-- CreateEnum
CREATE TYPE "public"."TagScope" AS ENUM ('staff', 'employee', 'payslip');

-- CreateTable
CREATE TABLE "public"."tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "social_name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "must_change_password" BOOLEAN DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employees" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT,
    "cpf" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staff" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "role" "public"."StaffRole" NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bg_color" TEXT NOT NULL,
    "scope" "public"."TagScope" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tag_relations" (
    "id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "staff_id" TEXT,
    "employee_id" TEXT,

    CONSTRAINT "tag_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_cnpj_key" ON "public"."tenants"("cnpj");

-- CreateIndex
CREATE INDEX "idx_user_tenant_id_active" ON "public"."users"("tenant_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_tenant_id_key" ON "public"."users"("username", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_tenant_id_key" ON "public"."users"("id", "tenant_id");

-- CreateIndex
CREATE INDEX "idx_employee_tenant_id_user_id" ON "public"."employees"("tenant_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_employee_tenant_id_full_name" ON "public"."employees"("tenant_id", "full_name");

-- CreateIndex
CREATE UNIQUE INDEX "employees_cpf_tenant_id_key" ON "public"."employees"("cpf", "tenant_id");

-- CreateIndex
CREATE INDEX "idx_staff_tenant_id_role" ON "public"."staff"("tenant_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "staff_tenant_id_user_id_key" ON "public"."staff"("tenant_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_relations_tag_id_staff_id_employee_id_key" ON "public"."tag_relations"("tag_id", "staff_id", "employee_id");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff" ADD CONSTRAINT "staff_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tags" ADD CONSTRAINT "tags_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_relations" ADD CONSTRAINT "tag_relations_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_relations" ADD CONSTRAINT "tag_relations_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_relations" ADD CONSTRAINT "tag_relations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
