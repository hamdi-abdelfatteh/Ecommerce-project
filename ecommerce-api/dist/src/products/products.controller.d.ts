import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(query: QueryProductDto): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateProductDto): Promise<any>;
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
