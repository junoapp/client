import ky from 'ky';

import { Dataset } from '../models/dataset';
import { UploadResponse } from '../models/upload-response';
import { UploadInfoField } from '../models/upload-info';

export async function getAll(): Promise<Dataset[]> {
  return ky.get('http://localhost:3001/api/dataset').json();
}

export async function getById(id: number): Promise<Dataset> {
  return ky.get(`http://localhost:3001/api/dataset/${id}`).json();
}

export async function getDataForColumn(
  datasetId: number,
  name: string,
  value?: string
): Promise<any[]> {
  if (value) {
    return ky
      .get(`http://localhost:3001/api/dashboard/${datasetId}/column/${name}/${value}`)
      .json();
  }

  return ky.get(`http://localhost:3001/api/dashboard/${datasetId}/column/${name}`).json();
}

export async function getSpec(datasetId: number, spec: any): Promise<any[]> {
  return ky.post(`http://localhost:3001/api/dashboard/${datasetId}/spec`, { json: spec }).json();
}

export async function uploadDataset(file: File): Promise<Dataset> {
  const formData = new FormData();
  formData.append('file', file);

  return ky
    .post('http://localhost:3001/api/dataset/upload', {
      body: formData,
    })
    .json();
}

export async function getColumns(id: number): Promise<UploadResponse> {
  return ky.get(`http://localhost:3001/api/dataset/${id}/columns`).json();
}

export async function updateColumns(id: number, fields: UploadInfoField[]): Promise<Response> {
  return ky.put(`http://localhost:3001/api/dataset/${id}/columns`, {
    json: fields,
  });
}

export async function remove(id: number): Promise<Response> {
  return ky.delete(`http://localhost:3001/api/dataset/${id}`);
}
