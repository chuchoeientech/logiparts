import { api } from './client';
import { Vehicle } from '../types';

export type VehicleApi = Vehicle;

export interface CreateVehicleBody {
    anio: number;
    nombreTipo: string;
    nombreMarca: string;
    nombreModelo: string;
    codTipo?: number;
    codModelo?: number;
    codOrigen?: number;
}

export interface UpdateVehicleBody extends Partial<CreateVehicleBody> { }

export const vehiclesApi = {
    getAll: (params?: { marca?: string; tipo?: string }) => {
        const search = new URLSearchParams();
        if (params?.marca) search.set('marca', params.marca);
        if (params?.tipo) search.set('tipo', params.tipo);
        const q = search.toString();
        return api.get<VehicleApi[]>(`/vehicles${q ? `?${q}` : ''}`);
    },
    getOne: (id: string) => api.get<VehicleApi>(`/vehicles/${id}`),
    create: (body: CreateVehicleBody) => api.post<VehicleApi>('/vehicles', body),
    update: (id: string, body: UpdateVehicleBody) =>
        api.patch<VehicleApi>(`/vehicles/${id}`, body),
    delete: (id: string) => api.delete(`/vehicles/${id}`),
};
