"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const query_product_dto_1 = require("./dto/query-product.dto");
function parseImages(images) {
    if (typeof images === 'string') {
        try {
            return JSON.parse(images);
        }
        catch {
            return [];
        }
    }
    return images || [];
}
function normalizeProduct(product) {
    return { ...product, images: parseImages(product.images) };
}
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        const data = { ...dto, images: dto.images ? JSON.stringify(dto.images) : '[]' };
        return this.prisma.product.create({ data, include: { category: true } }).then(normalizeProduct);
    }
    normalizeProduct(product) {
        if (!product)
            return product;
        return {
            ...product,
            images: (() => {
                try {
                    if (typeof product.images === 'string')
                        return JSON.parse(product.images);
                    return product.images || [];
                }
                catch {
                    return [];
                }
            })(),
        };
    }
    findAll(query) {
        const where = {};
        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { description: { contains: query.search } },
            ];
        }
        if (query.brand)
            where.brand = { equals: query.brand };
        if (query.categoryId)
            where.categoryId = query.categoryId;
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            where.price = {};
            if (query.minPrice !== undefined)
                where.price.gte = query.minPrice;
            if (query.maxPrice !== undefined)
                where.price.lte = query.maxPrice;
        }
        let orderBy = { createdAt: 'desc' };
        if (query.sort === query_product_dto_1.SortOrder.PRICE_ASC)
            orderBy = { price: 'asc' };
        else if (query.sort === query_product_dto_1.SortOrder.PRICE_DESC)
            orderBy = { price: 'desc' };
        else if (query.sort === query_product_dto_1.SortOrder.NEWEST)
            orderBy = { createdAt: 'desc' };
        return this.prisma.product.findMany({ where, orderBy, include: { category: true } }).then((products) => products.map((p) => this.normalizeProduct(p)));
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true, reviews: { include: { user: { select: { firstName: true, lastName: true } } } } },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.normalizeProduct(product);
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (dto.images)
            data.images = JSON.stringify(dto.images);
        if (dto.categoryId === undefined)
            delete data.categoryId;
        return this.prisma.product.update({ where: { id }, data, include: { category: true } }).then(normalizeProduct);
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map