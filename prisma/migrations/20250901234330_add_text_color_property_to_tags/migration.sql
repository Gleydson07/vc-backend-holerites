/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,title,scope]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `text_color` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tags" ADD COLUMN     "text_color" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tags_tenant_id_title_scope_key" ON "public"."tags"("tenant_id", "title", "scope");
