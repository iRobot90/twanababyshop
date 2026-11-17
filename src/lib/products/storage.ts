import sharp from 'sharp';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from './validation';

const BUCKET = 'product-images';

export function validateImageFile(file: File): string | null {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return `${file.name}: only JPEG, PNG, WebP, and GIF images are allowed`;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return `${file.name}: file must be 5 MB or smaller`;
    }
    return null;
}

export async function uploadProductImages(
    supabase: SupabaseClient,
    files: File[]
): Promise<{ urls: string[]; errors: string[] }> {
    const urls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
        const validationError = validateImageFile(file);
        if (validationError) {
            errors.push(validationError);
            continue;
        }

        let image: Buffer;
        try { const source = Buffer.from(await file.arrayBuffer()); const metadata = await sharp(source,{limitInputPixels:20000000}).metadata(); if (!metadata.format || !['jpeg','png','webp','gif'].includes(metadata.format)) throw new Error('Unsupported format'); image = await sharp(source,{limitInputPixels:20000000,animated:false}).rotate().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer(); } catch { errors.push('Invalid or unsupported image data'); continue; }
        const extension = 'webp';
        const path = `${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(path, image, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'image/webp',
            });

        if (uploadError) {
            const detail = uploadError.message.includes('bucket') || uploadError.message.includes('policy') || uploadError.message.includes('not found')
                ? `${uploadError.message}. Create the product-images storage bucket and its RLS policies in Supabase Storage.`
                : uploadError.message;
            errors.push(`${file.name}: ${detail}`);
            continue;
        }

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        urls.push(data.publicUrl);
    }

    return { urls, errors };
}
