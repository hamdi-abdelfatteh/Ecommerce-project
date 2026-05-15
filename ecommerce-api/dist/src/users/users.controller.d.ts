import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import type { User } from '@prisma/client';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): Promise<{
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
    updateProfile(user: User, dto: UpdateProfileDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getAddresses(user: User): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        isDefault: boolean;
        userId: string;
    }[]>;
    addAddress(user: User, dto: CreateAddressDto): Promise<{
        id: string;
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        isDefault: boolean;
        userId: string;
    }>;
    removeAddress(user: User, id: string): Promise<{
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
