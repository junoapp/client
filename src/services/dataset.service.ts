import ky from 'ky';

import { DashboardUpdate, DatasetInterface } from '@junoapp/common';
import { API_URL } from '../utils/constants';

export async function getAll(): Promise<DatasetInterface[]> {
  return ky.get(`${API_URL}/api/dataset`).json();
}

export async function getById(id: number): Promise<DatasetInterface> {
  return ky.get(`${API_URL}/api/dataset/${id}`).json();
}

export async function getSpec(datasetId: number): Promise<any[]> {
  return ky.get(`${API_URL}/api/dashboard/${datasetId}/spec`).json();
}

export async function uploadDataset(userId: string, file: File): Promise<DatasetInterface> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user', userId);

  return ky
    .post(`${API_URL}/api/dataset/upload`, {
      body: formData,
    })
    .json();
}

export async function updateColumns(id: number, fields: DashboardUpdate): Promise<Response> {
  return ky.post(`${API_URL}/api/dashboard/${id}`, {
    json: fields,
  });
}

export async function remove(id: number): Promise<Response> {
  return ky.delete(`${API_URL}/api/dataset/${id}`);
}
