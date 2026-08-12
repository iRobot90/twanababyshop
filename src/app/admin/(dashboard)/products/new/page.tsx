import ProductUploadForm from '@/components/Admin/ProductUploadForm';

export default function NewProductPage() {
    return (
        <div>
            <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-widest text-primary">Upload</p>
                <h1 className="text-4xl font-black">Add New Product</h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                    Create a product with pricing, stock levels, and images. Uploaded images are stored in
                    Supabase Storage and linked to the product record.
                </p>
            </div>
            <ProductUploadForm />
        </div>
    );
}
