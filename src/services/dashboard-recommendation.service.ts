import { DashboardRecommendation } from '@junoapp/common';
import ky from 'ky';
import { API_URL } from '../utils/constants';

export async function getSpec(datasetId: number): Promise<DashboardRecommendation> {
  return ky.get(`${API_URL}/api/dashboard-recommendation/${datasetId}/spec`).json();
}
