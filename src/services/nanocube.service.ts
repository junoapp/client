import ky from 'ky';
import { API_URL } from '../utils/constants';

export async function generateMap(datasetId: number): Promise<any> {
  return ky.get(`${API_URL}/api/nanocube/${datasetId}`).json();
}

export async function stopServer(): Promise<any> {
  return ky.get(`${API_URL}/api/nanocube/stop`);
}

export async function requestData<T>(query: string): Promise<T> {
  return ky.get(`http://localhost:51234/${query}`).json<T>();
}
