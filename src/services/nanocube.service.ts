import ky from 'ky';

export async function generateMap(datasetId: number): Promise<any> {
  return ky.get(`http://localhost:3001/api/nanocube/${datasetId}`).json();
}

export async function stopServer(): Promise<any> {
  return ky.get(`http://localhost:3001/api/nanocube/stop`);
}

export async function request(): Promise<any> {
  return ky.get(`http://localhost:51234/schema()`);
}
