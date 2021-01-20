import ky from 'ky';

export async function getSpec(datasetId: number): Promise<any[]> {
  return ky.get(`http://localhost:3001/api/dashboard-recommendation/${datasetId}/spec`).json();
}
