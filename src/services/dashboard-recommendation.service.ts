import { DashboardRecommendation } from '@junoapp/common';
import ky from 'ky';

export async function getSpec(datasetId: number): Promise<DashboardRecommendation> {
  return ky.get(`http://localhost:3001/api/dashboard-recommendation/${datasetId}/spec`).json();
}
