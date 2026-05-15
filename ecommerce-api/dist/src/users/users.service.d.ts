import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        createdAt: Date;
        addresses: {
            id: string;
            street: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
            isDefault: boolean;
            userId: string;
        }[];
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    addAddress(userId: string, dto: CreateAddressDto): Promise<{
        id: string;
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        isDefault: boolean;
        userId: string;
    }>;
    getAddresses(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        isDefault: boolean;
        userId: string;
    }[]>;
    removeAddress(userId: string, addressId: string): Promise<{
        id: string;
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        isDefault: boolean;
        userId: string;
    }>;
}
