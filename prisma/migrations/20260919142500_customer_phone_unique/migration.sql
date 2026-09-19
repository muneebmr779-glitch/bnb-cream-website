-- DropIndex
DROP INDEX "Customer_phone_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

