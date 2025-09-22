import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const defaultCategories = [
    { name: "Sun'iy intellekt" },
    { name: "Kompyuter Injenering" },
    { name: "Biznes" },
    { name: "Dasturiy Injenering" },
    { name: "Managment" },
  ];

  for (const c of defaultCategories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


