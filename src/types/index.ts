export type ProductVariant = {
  name: string;
  priceModifier: number;
};

export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  variants: ProductVariant[];
  available: boolean;
  featured: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string };
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export type SiteHours = { day: string; hours: string };

export type AdminOrderItemDTO = {
  id: string;
  productName: string;
  variant: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  specialInstructions: string | null;
};

export type AdminOrderDTO = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryType: string;
  address: string | null;
  city: string | null;
  scheduledDate: string;
  scheduledTime: string;
  paymentMethod: string;
  status: string;
  notes: string | null;
  subtotal: string;
  deliveryFee: string;
  total: string;
  items: AdminOrderItemDTO[];
  createdAt: string;
};

export type SiteSettingsDTO = {
  heroHeadline: string;
  heroSubtext: string;
  aboutHeading: string;
  aboutText: string;
  address: string;
  phone: string;
  email: string;
  hours: SiteHours[];
  socialLinks: { facebook: string; instagram: string; tiktok: string };
  instagramHandle: string;
};
