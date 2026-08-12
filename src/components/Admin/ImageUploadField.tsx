'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGES_PER_PRODUCT } from '@/lib/products/validation';

interface ImagePreview {
    file: File;
    url: string;
}

interface ImageUploadFieldProps {
    files: File[];
    onChange: (files: File[]) => void;
    error?: string;
}

export default function ImageUploadField({ files, onChange, error }: ImageUploadFieldProps) {
    const previews = useMemo<ImagePreview[]>(
        () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
        [files]
    );

    useEffect(() => {
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [previews]);

    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(event.target.files ?? []);
        const valid = selected.filter((file) => ALLOWED_IMAGE_TYPES.includes(file.type));
        const merged = [...files, ...valid].slice(0, MAX_IMAGES_PER_PRODUCT);
        onChange(merged);
        event.target.value = '';
    };

    const removeFile = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-900">Product Images</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previews.map((preview, index) => (
                    <div
                        key={`${preview.file.name}-${index}`}
                        className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                    >
                        <Image src={preview.url} alt={preview.file.name} fill className="object-cover" />
                        <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                            aria-label={`Remove ${preview.file.name}`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                {files.length < MAX_IMAGES_PER_PRODUCT && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary">
                        <ImagePlus className="h-8 w-8" />
                        <span className="text-xs font-semibold">Add image</span>
                        <input
                            type="file"
                            accept={ALLOWED_IMAGE_TYPES.join(',')}
                            multiple
                            className="hidden"
                            onChange={handleSelect}
                        />
                    </label>
                )}
            </div>
            <p className="text-xs text-muted-foreground">
                Up to {MAX_IMAGES_PER_PRODUCT} images. JPEG, PNG, WebP, or GIF. Max 5 MB each.
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
