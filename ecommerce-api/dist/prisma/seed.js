"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=seed.js.map