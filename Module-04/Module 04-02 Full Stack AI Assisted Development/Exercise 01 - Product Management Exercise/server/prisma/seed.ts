import { Prisma, PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

const seedProducts = [
  {
    name: "Noise Cancelling Headphones",
    sku: "ELEC-AUD-1001",
    category: "Electronics",
    price: "129.99",
    stock: 42,
    status: ProductStatus.ACTIVE
  },
  {
    name: "USB-C Docking Station",
    sku: "ELEC-DCK-1002",
    category: "Electronics",
    price: "89.5",
    stock: 11,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Smart Fitness Watch",
    sku: "ELEC-WCH-1003",
    category: "Electronics",
    price: "149.0",
    stock: 4,
    status: ProductStatus.LOW_STOCK
  },
  {
    name: "Portable Bluetooth Speaker",
    sku: "ELEC-SPK-1004",
    category: "Electronics",
    price: "64.95",
    stock: 0,
    status: ProductStatus.OUT_OF_STOCK
  },
  {
    name: "Classic Oxford Shirt",
    sku: "CLOT-SRT-2001",
    category: "Clothing",
    price: "39.99",
    stock: 68,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Lightweight Running Jacket",
    sku: "CLOT-JKT-2002",
    category: "Clothing",
    price: "74.0",
    stock: 9,
    status: ProductStatus.LOW_STOCK
  },
  {
    name: "Slim Fit Chino Pants",
    sku: "CLOT-PNT-2003",
    category: "Clothing",
    price: "49.5",
    stock: 37,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Seasonal Wool Scarf",
    sku: "CLOT-SCF-2004",
    category: "Clothing",
    price: "24.95",
    stock: 0,
    status: ProductStatus.INACTIVE
  },
  {
    name: "Ceramic Nonstick Cookware Set",
    sku: "HOME-CKW-3001",
    category: "Home & Kitchen",
    price: "119.0",
    stock: 18,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Bamboo Cutting Board",
    sku: "HOME-CTB-3002",
    category: "Home & Kitchen",
    price: "22.99",
    stock: 56,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Electric Gooseneck Kettle",
    sku: "HOME-KTL-3003",
    category: "Home & Kitchen",
    price: "58.75",
    stock: 6,
    status: ProductStatus.LOW_STOCK
  },
  {
    name: "Cotton Bath Towel Set",
    sku: "HOME-TWL-3004",
    category: "Home & Kitchen",
    price: "34.99",
    stock: 0,
    status: ProductStatus.OUT_OF_STOCK
  },
  {
    name: "Hydrating Face Serum",
    sku: "BEAU-SRM-4001",
    category: "Beauty & Personal Care",
    price: "27.5",
    stock: 31,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Daily Mineral Sunscreen",
    sku: "BEAU-SUN-4002",
    category: "Beauty & Personal Care",
    price: "18.25",
    stock: 5,
    status: ProductStatus.LOW_STOCK
  },
  {
    name: "Aloe Body Lotion",
    sku: "BEAU-LOT-4003",
    category: "Beauty & Personal Care",
    price: "14.99",
    stock: 44,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Travel Grooming Kit",
    sku: "BEAU-GRM-4004",
    category: "Beauty & Personal Care",
    price: "32.0",
    stock: 0,
    status: ProductStatus.INACTIVE
  },
  {
    name: "Insulated Hiking Bottle",
    sku: "SPRT-BTL-5001",
    category: "Sports & Outdoors",
    price: "29.95",
    stock: 72,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Yoga Mat Pro",
    sku: "SPRT-YGA-5002",
    category: "Sports & Outdoors",
    price: "45.0",
    stock: 14,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Adjustable Dumbbell Pair",
    sku: "SPRT-DMB-5003",
    category: "Sports & Outdoors",
    price: "189.99",
    stock: 3,
    status: ProductStatus.LOW_STOCK
  },
  {
    name: "Trail Running Backpack",
    sku: "SPRT-BPK-5004",
    category: "Sports & Outdoors",
    price: "79.95",
    stock: 0,
    status: ProductStatus.OUT_OF_STOCK
  },
  {
    name: "Ergonomic Desk Chair",
    sku: "OFFC-CHR-6001",
    category: "Office Supplies",
    price: "219.0",
    stock: 15,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Premium Notebook Pack",
    sku: "OFFC-NTB-6002",
    category: "Office Supplies",
    price: "16.5",
    stock: 89,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Wireless Presentation Remote",
    sku: "OFFC-PRS-6003",
    category: "Office Supplies",
    price: "24.75",
    stock: 7,
    status: ProductStatus.LOW_STOCK
  },
  {
    name: "Acrylic Desk Organizer",
    sku: "OFFC-ORG-6004",
    category: "Office Supplies",
    price: "21.0",
    stock: 0,
    status: ProductStatus.INACTIVE
  },
  {
    name: "Cold Brew Coffee Cans",
    sku: "FOOD-CBF-7001",
    category: "Food & Beverage",
    price: "23.99",
    stock: 64,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Organic Green Tea Box",
    sku: "FOOD-TEA-7002",
    category: "Food & Beverage",
    price: "12.5",
    stock: 23,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Protein Snack Bar Variety Pack",
    sku: "FOOD-BAR-7003",
    category: "Food & Beverage",
    price: "28.0",
    stock: 6,
    status: ProductStatus.LOW_STOCK
  },
  {
    name: "Sparkling Citrus Water Case",
    sku: "FOOD-WTR-7004",
    category: "Food & Beverage",
    price: "19.99",
    stock: 0,
    status: ProductStatus.OUT_OF_STOCK
  },
  {
    name: "Strategy Board Game",
    sku: "TOYS-BRD-8001",
    category: "Toys & Games",
    price: "44.99",
    stock: 27,
    status: ProductStatus.ACTIVE
  },
  {
    name: "STEM Building Blocks Set",
    sku: "TOYS-BLK-8002",
    category: "Toys & Games",
    price: "36.5",
    stock: 33,
    status: ProductStatus.ACTIVE
  },
  {
    name: "Watercolor Art Kit",
    sku: "TOYS-ART-8003",
    category: "Toys & Games",
    price: "18.99",
    stock: 5,
    status: ProductStatus.LOW_STOCK
  },
  {
    name: "Remote Control Drift Car",
    sku: "TOYS-RCC-8004",
    category: "Toys & Games",
    price: "59.95",
    stock: 0,
    status: ProductStatus.OUT_OF_STOCK
  }
] satisfies Array<{
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: ProductStatus;
}>;

async function main() {
  for (const product of seedProducts) {
    const data: Prisma.ProductCreateInput = {
      ...product,
      price: new Prisma.Decimal(product.price)
    };

    await prisma.product.upsert({
      where: { sku: product.sku },
      update: data,
      create: data
    });
  }

  console.log(`Seeded ${seedProducts.length} products across 8 categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
