import { api } from './client';

export interface BulkUploadResult {
    total: number;
    success: number;
    errors: string[];
}

export const bulkApi = {
    uploadProducts: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.postForm<BulkUploadResult>('/bulk/upload', formData);
    },
};
