import ky from 'ky';

import { DashboardUpdate, DatasetInterface } from '@junoapp/common';

export async function getAll(): Promise<DatasetInterface[]> {
  return ky.get(`http://localhost:3001/api/dataset`).json();
}

export async function getById(id: number): Promise<DatasetInterface> {
  return ky.get(`http://localhost:3001/api/dataset/${id}`).json();
}

export async function getSpec(datasetId: number): Promise<any[]> {
  return ky.get(`http://localhost:3001/api/dashboard/${datasetId}/spec`).json();
}

export async function uploadDataset(userId: string, file: File): Promise<DatasetInterface> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user', userId);

  return ky
    .post('http://localhost:3001/api/dataset/upload', {
      body: formData,
    })
    .json();
}

export async function updateColumns(id: number, fields: DashboardUpdate): Promise<Response> {
  return ky.post(`http://localhost:3001/api/dashboard/${id}`, {
    json: fields,
  });
}

export async function remove(id: number): Promise<Response> {
  return ky.delete(`http://localhost:3001/api/dataset/${id}`);
}
