import { BasicColumns } from '../utils/basic-columns';

export interface Dataset extends BasicColumns {
  id: number;
  path: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;

  columns: Array<{
    id: number;
    name: string;
    type: DatasetColumnType;
  }>;
}

export enum DatasetColumnType {
  DIMENSION = 'dimension',
  MEASURE = 'measure',
}
