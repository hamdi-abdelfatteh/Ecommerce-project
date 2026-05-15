import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const customerPassword = await bcrypt.hash('Customer@1234', 10);

  await prisma.user.upsert({
    where: { email: 'admin@shopnest.com' },
    update: {},
    create: {
      email: 'admin@shopnest.com',
      password: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'customer@shopnest.com' },
    update: {},
    create: {
      email: 'customer@shopnest.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
    },
  });

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
    },
  });

  // Create products
  await prisma.product.upsert({
    where: { slug: 'wireless-headphones' },
    update: {},
    create: {
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'High-quality wireless headphones with noise cancellation.',
      price: 99.99,
      brand: 'AudioTech',
      stock: 50,
      images: JSON.stringify(['https://example.com/headphones1.jpg', 'https://example.com/headphones2.jpg']),
      categoryId: electronics.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'running-shoes' },
    update: {},
    create: {
      name: 'Running Shoes',
      slug: 'running-shoes',
      description: 'Comfortable running shoes for all terrains.',
      price: 79.99,
      brand: 'SportFit',
      stock: 30,
      images: JSON.stringify(['https://example.com/shoes1.jpg']),
      categoryId: clothing.id,
    },
  });

  console.log('✅ Seed accounts and sample data created');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
