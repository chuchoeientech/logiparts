import { api } from './client';

export interface BulkUploadResult {
    total: number;
    success: number;
    errors: string[];
}

export interface BulkImageDetail {
    filename: string;
    status: 'matched' | 'unmatched' | 'error';
    productId?: string;
    descripcion?: string;
    message?: string;
}

export interface BulkImagesResult {
    total: number;
    matched: number;
    unmatched: number;
    errors: number;
    details: BulkImageDetail[];
}

export const bulkApi = {
    uploadProducts: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.postForm<BulkUploadResult>('/bulk/upload', formData);
    },
    uploadImages: (files: File[]) => {
        const formData = new FormData();
        files.forEach(f => formData.append('images', f));
        return api.postForm<BulkImagesResult>('/bulk/images', formData);
    },
};
