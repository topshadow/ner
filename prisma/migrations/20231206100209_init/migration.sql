-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RbacUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nickname" TEXT,
    "avatar" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "is_admin" BOOLEAN,

    CONSTRAINT "RbacUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RbacRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "RbacRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WmsProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "create_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "WmsProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WmsStock" (
    "id" TEXT NOT NULL,
    "num" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "origin_num" INTEGER NOT NULL DEFAULT 0,
    "create_user_id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_lock" BOOLEAN,

    CONSTRAINT "WmsStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WmsStockDetail" (
    "id" TEXT NOT NULL,
    "stock_id" TEXT NOT NULL,
    "num" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "create_user_id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "WmsStockDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RbacUser_username_key" ON "RbacUser"("username");

-- CreateIndex
CREATE INDEX "RbacUser_tenant_id_idx" ON "RbacUser"("tenant_id");

-- CreateIndex
CREATE INDEX "RbacUser_role_id_idx" ON "RbacUser"("role_id");

-- CreateIndex
CREATE INDEX "WmsStock_owner_user_id_idx" ON "WmsStock"("owner_user_id");

-- CreateIndex
CREATE INDEX "WmsStock_create_user_id_idx" ON "WmsStock"("create_user_id");

-- CreateIndex
CREATE INDEX "WmsStock_product_id_idx" ON "WmsStock"("product_id");

-- CreateIndex
CREATE INDEX "WmsStockDetail_stock_id_idx" ON "WmsStockDetail"("stock_id");
