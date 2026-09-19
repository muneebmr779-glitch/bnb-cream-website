import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORY_SEED, DEFAULT_SETTINGS } from "../src/lib/constants";

const prisma = new PrismaClient();

const CAKE_VARIANTS = [
  { name: "6-inch (serves 6-8)", priceModifier: 0 },
  { name: "8-inch (serves 10-14)", priceModifier: 800 },
  { name: "10-inch (serves 16-20)", priceModifier: 1600 },
];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  categorySlug: string;
  image: string;
  featured?: boolean;
  variants?: { name: string; priceModifier: number }[];
};

const PRODUCTS: SeedProduct[] = [
  {
    name: "Chocolate Fudge Cake",
    slug: "chocolate-fudge-cake",
    description: "Rich layers of chocolate sponge with silky fudge frosting and a glossy ganache drip.",
    price: 2200,
    categorySlug: "cakes",
    image: "/images/products/chocolate-fudge-cake.svg",
    featured: true,
    variants: CAKE_VARIANTS,
  },
  {
    name: "Red Velvet Cake",
    slug: "red-velvet-cake",
    description: "Classic red velvet sponge with cream cheese frosting, finished with delicate crumb detailing.",
    price: 2400,
    categorySlug: "cakes",
    image: "/images/products/red-velvet-cake.svg",
    featured: true,
    variants: CAKE_VARIANTS,
  },
  {
    name: "Strawberry Cream Cake",
    slug: "strawberry-cream-cake",
    description: "Light vanilla sponge layered with fresh strawberry compote and whipped cream.",
    price: 2500,
    categorySlug: "cakes",
    image: "/images/products/strawberry-cream-cake.svg",
    featured: true,
    variants: CAKE_VARIANTS,
  },
  {
    name: "New York Cheesecake",
    slug: "new-york-cheesecake",
    description: "Dense and creamy baked cheesecake on a buttery biscuit base.",
    price: 2600,
    categorySlug: "cheesecakes",
    image: "/images/products/new-york-cheesecake.svg",
    featured: true,
    variants: [
      { name: "Slice", priceModifier: -2200 },
      { name: "Whole (8-inch)", priceModifier: 0 },
    ],
  },
  {
    name: "Custom Celebration Cake",
    slug: "custom-celebration-cake",
    description: "A made-to-order cake designed around your theme, flavors, and occasion.",
    price: 3000,
    categorySlug: "custom-cakes",
    image: "/images/products/custom-celebration-cake.svg",
    featured: true,
  },
  {
    name: "Chocolate Croissant",
    slug: "chocolate-croissant",
    description: "Buttery, flaky croissant laminated to perfection with a rich dark chocolate core.",
    price: 350,
    categorySlug: "pastries",
    image: "/images/products/chocolate-croissant.svg",
    featured: true,
  },
  {
    name: "Cinnamon Roll",
    slug: "cinnamon-roll",
    description: "Soft, pillowy roll swirled with brown sugar cinnamon and finished with cream cheese icing.",
    price: 380,
    categorySlug: "pastries",
    image: "/images/products/cinnamon-roll.svg",
  },
  {
    name: "Vanilla Cupcakes (Box of 4)",
    slug: "vanilla-cupcakes",
    description: "Fluffy vanilla bean cupcakes topped with swirled buttercream and sprinkles.",
    price: 700,
    categorySlug: "cupcakes",
    image: "/images/products/vanilla-cupcakes.svg",
    featured: true,
  },
  {
    name: "Fresh Donuts (Box of 6)",
    slug: "fresh-donuts",
    description: "Pillow-soft glazed donuts, made fresh daily in a rotating variety of flavors.",
    price: 900,
    categorySlug: "donuts",
    image: "/images/products/fresh-donuts.svg",
  },
  {
    name: "Fudge Brownies (Box of 6)",
    slug: "brownies",
    description: "Dense, chewy chocolate brownies with a crackly top and molten center.",
    price: 750,
    categorySlug: "brownies",
    image: "/images/products/brownies.svg",
  },
  {
    name: "Butter Cookies (Box of 12)",
    slug: "butter-cookies",
    description: "Classic hand-piped butter cookies, lightly golden and delicately crisp.",
    price: 650,
    categorySlug: "cookies",
    image: "/images/products/butter-cookies.svg",
  },
  {
    name: "Sourdough Bread",
    slug: "sourdough-bread",
    description: "Naturally leavened sourdough with a crisp crust and open, airy crumb.",
    price: 550,
    categorySlug: "bread",
    image: "/images/products/sourdough-bread.svg",
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@cakoo.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: "Cakoo Admin", email: adminEmail, passwordHash },
  });
  console.log(`Admin ready: ${adminEmail}`);

  for (const category of CATEGORY_SEED) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, order: category.order },
      create: category,
    });
  }
  console.log(`Seeded ${CATEGORY_SEED.length} categories`);

  const categories = await prisma.category.findMany();
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  for (const product of PRODUCTS) {
    const category = categoryBySlug.get(product.categorySlug);
    if (!category) continue;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        images: [product.image],
        featured: product.featured ?? false,
        categoryId: category.id,
        variants: product.variants ?? [],
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        images: [product.image],
        featured: product.featured ?? false,
        categoryId: category.id,
        variants: product.variants ?? [],
      },
    });
  }
  console.log(`Seeded ${PRODUCTS.length} products`);

  const galleryEntries = [
    { file: "gallery-1.svg", caption: "Layered celebration cake", category: "Cakes" },
    { file: "gallery-2.svg", caption: "Fresh from the oven", category: "Behind the Scenes" },
    { file: "gallery-3.svg", caption: "Cupcake swirls", category: "Cupcakes" },
    { file: "gallery-4.svg", caption: "Glazed donuts", category: "Pastries" },
    { file: "gallery-5.svg", caption: "Hand mixing the batter", category: "Behind the Scenes" },
    { file: "gallery-6.svg", caption: "In the oven", category: "Behind the Scenes" },
    { file: "gallery-7.svg", caption: "Cakoo bakery moments", category: "Bakery" },
    { file: "gallery-8.svg", caption: "Made with love", category: "Cakes" },
    { file: "gallery-9.svg", caption: "Custom cake detailing", category: "Custom Cakes" },
    { file: "gallery-10.svg", caption: "Flour and fresh ingredients", category: "Behind the Scenes" },
    { file: "gallery-11.svg", caption: "Fresh sourdough loaf", category: "Bread" },
    { file: "gallery-12.svg", caption: "Sweet celebrations", category: "Celebrations" },
  ];

  await prisma.galleryImage.deleteMany({});
  await prisma.galleryImage.createMany({
    data: galleryEntries.map((entry, i) => ({
      url: `/images/gallery/${entry.file}`,
      caption: entry.caption,
      category: entry.category,
      order: i,
    })),
  });
  console.log(`Seeded ${galleryEntries.length} gallery images`);

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main", ...DEFAULT_SETTINGS },
  });
  console.log("Site settings ready");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
