import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonError } from "@/lib/api";
import { createOrderSchema } from "@/lib/validation";
import { generateOrderNumber } from "@/lib/order-number";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

const DELIVERY_FEE = 250;

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(clientKeyFromRequest(request, "order-create"), 8, 60_000)) {
      return jsonError("Too many orders submitted. Please try again shortly.", 429);
    }

    const body = await request.json();
    const data = createOrderSchema.parse(body);

    if (data.deliveryType === "DELIVERY" && (!data.address || !data.city)) {
      return jsonError("Address and city are required for delivery orders", 422);
    }

    const productIds = [...new Set(data.items.map((item) => item.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, available: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const missing = data.items.filter((item) => !productMap.has(item.productId));
    if (missing.length > 0) {
      return jsonError("One or more items are no longer available", 422);
    }

    let subtotal = 0;
    const itemsToCreate = data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        productId: product.id,
        productName: product.name,
        variant: item.variant || null,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        specialInstructions: item.specialInstructions || null,
      };
    });

    const deliveryFee = data.deliveryType === "DELIVERY" ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    const order = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { phone: data.customerPhone },
        update: {
          name: data.customerName,
          email: data.customerEmail || undefined,
          address: data.address || undefined,
        },
        create: {
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail || null,
          address: data.address || null,
        },
      });

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: customer.id,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          deliveryType: data.deliveryType,
          address: data.address || null,
          city: data.city || null,
          scheduledDate: new Date(data.scheduledDate),
          scheduledTime: data.scheduledTime,
          paymentMethod: data.paymentMethod,
          notes: data.notes || null,
          subtotal,
          deliveryFee,
          total,
          items: { create: itemsToCreate },
        },
        include: { items: true },
      });
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
