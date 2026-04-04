import { Brand } from "../schema/schema.type";

// Stub service for brands - brands are not in the new schema
// This service returns empty data to prevent errors in components that still reference brands
class Brands_Service {
    async getAllBrands(): Promise<Brand[] | null> {
        // Return empty array since brands table doesn't exist in new schema
        return [];
    }

    async getSingleBrandById(id: string | null): Promise<Brand | null> {
        return null;
    }

    async createNewBrand(payload: Brand): Promise<Brand[] | null> {
        console.warn('Brand creation not supported in new schema');
        return [];
    }

    async updateBrand(payload: Brand): Promise<Brand | null> {
        console.warn('Brand update not supported in new schema');
        return null;
    }

    async deleteBrandById(id: string): Promise<Brand[] | null> {
        console.warn('Brand deletion not supported in new schema');
        return [];
    }
}

export const brands_service = new Brands_Service();
