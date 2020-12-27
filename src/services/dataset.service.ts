import ky from 'ky';

import { UploadInfoField } from '../models/upload-info';
import { DatasetInterface } from '@junoapp/common';

export async function getAll(): Promise<DatasetInterface[]> {
  return ky.get('http://localhost:3001/api/dataset').json();
}

export async function getById(id: number): Promise<DatasetInterface> {
  return ky.get(`http://localhost:3001/api/dataset/${id}`).json();
}

export async function getSpec(datasetId: number): Promise<any[]> {
  return ky.get(`http://localhost:3001/api/dashboard/${datasetId}/spec`).json();
}

export async function uploadDataset(file: File): Promise<DatasetInterface> {
  const formData = new FormData();
  formData.append('file', file);

  return ky
    .post('http://localhost:3001/api/dataset/upload', {
      body: formData,
    })
    .json();
}

export async function updateColumns(id: number, fields: UploadInfoField[]): Promise<Response> {
  return ky.put(`http://localhost:3001/api/dataset/${id}/columns`, {
    json: fields,
  });
}

export async function remove(id: number): Promise<Response> {
  return ky.delete(`http://localhost:3001/api/dataset/${id}`);
}
