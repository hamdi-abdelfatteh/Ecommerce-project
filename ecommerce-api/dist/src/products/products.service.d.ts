import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<any>;
    private normalizeProduct;
    findAll(query: QueryProductDto): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<any>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string;
        price: number;
        brand: string;
        stock: number;
        images: string;
        categoryId: string;
    }>;
}
