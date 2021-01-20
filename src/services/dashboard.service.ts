import ky from 'ky';

import {
  DashboardInsert,
  DashboardInterface,
  DashboardUpdate,
  DatasetInterface,
} from '@junoapp/common';

export async function getAll(userId: number): Promise<DashboardInterface[]> {
  return ky.get(`http://localhost:3001/api/dashboard?user=${userId}`).json();
}

export async function getById(id: number): Promise<DashboardInterface> {
  return ky.get(`http://localhost:3001/api/dashboard/${id}`).json();
}

export async function getSpec(datasetId: number): Promise<any[]> {
  return ky.get(`http://localhost:3001/api/dashboard/${datasetId}/spec`).json();
}

export async function uploadDataset(userId: string, file: File): Promise<DatasetInterface> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user', userId);

  return ky
    .post('http://localhost:3001/api/dashboard/upload', {
      body: formData,
    })
    .json();
}

export async function save(fields: DashboardInsert): Promise<Response> {
  return ky.post(`http://localhost:3001/api/dashboard`, {
    json: fields,
  });
}

export async function update(fields: DashboardUpdate): Promise<Response> {
  return ky.put(`http://localhost:3001/api/dashboard`, {
    json: fields,
  });
}

export async function remove(id: number): Promise<Response> {
  return ky.delete(`http://localhost:3001/api/dashboard/${id}`);
}
