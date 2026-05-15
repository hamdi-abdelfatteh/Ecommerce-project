export declare enum SortOrder {
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    NEWEST = "newest"
}
export declare class QueryProductDto {
    search?: string;
    brand?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: SortOrder;
}
