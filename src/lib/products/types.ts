export interface ProductRecord {
    id: string;
    title: string;
    description: string | null;
    price: number;
    stock_quantity: number;
    category: string | null;
    image_url: string[];
    is_active: boolean;
    created_at: string;
}

export interface ProductFormInput {
    title: string;
    description: string;
    price: number;
    stock_quantity: number;
    category: string;
    is_active: boolean;
}

export interface ProductValidationResult {
    valid: boolean;
    errors: Record<string, string>;
    data?: ProductFormInput;
}
