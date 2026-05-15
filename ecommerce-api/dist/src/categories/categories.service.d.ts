import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCategoryDto): Promise<{
        parent: {
            id: string;
            name: string;
            slug: string;
            parentId: string | null;
        } | null;
        children: {
            id: string;
            name: string;
            slug: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        children: {
            id: string;
            name: string;
            slug: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        parent: {
            id: string;
            name: string;
            slug: string;
            parentId: string | null;
        } | null;
        children: {
            id: string;
            name: string;
            slug: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        parent: {
            id: string;
            name: string;
            slug: string;
            parentId: string | null;
        } | null;
        children: {
            id: string;
            name: string;
            slug: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
    }>;
}
