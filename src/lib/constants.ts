import type { SiteSettingsDTO } from "@/types";

export const DEFAULT_SETTINGS: SiteSettingsDTO = {
  heroHeadline: "Baked With Love. Made For Moments.",
  heroSubtext:
    "Welcome to Cakoo — where every cake, pastry, and sweet creation is made fresh with passion, creativity, and a little extra love.",
  aboutHeading: "A Little More Than Just a Bakery",
  aboutText:
    "Cakoo started with a simple belief: dessert should feel like a celebration. Every cake, pastry, and treat we make is prepared fresh, using carefully selected ingredients and a whole lot of attention to detail. From everyday cravings to once-in-a-lifetime celebrations, our team pours the same care into every single order — because we know these are the moments you'll remember.",
  address: "Lala Rukh, B-180 Minar Road, Wah Cantt, 47010",
  phone: "0329 5115550",
  email: "hello@cakoo.com",
  hours: [
    { day: "Monday – Sunday", hours: "11:00 AM – 12:00 AM" },
  ],
  socialLinks: { facebook: "", instagram: "", tiktok: "" },
  instagramHandle: "@cakoo",
};

export const CATEGORY_SEED = [
  { name: "Cakes", slug: "cakes", order: 0 },
  { name: "Pastries", slug: "pastries", order: 1 },
  { name: "Cupcakes", slug: "cupcakes", order: 2 },
  { name: "Cookies", slug: "cookies", order: 3 },
  { name: "Brownies", slug: "brownies", order: 4 },
  { name: "Donuts", slug: "donuts", order: 5 },
  { name: "Cheesecakes", slug: "cheesecakes", order: 6 },
  { name: "Bread", slug: "bread", order: 7 },
  { name: "Custom Cakes", slug: "custom-cakes", order: 8 },
];
