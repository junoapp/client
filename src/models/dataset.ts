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
    role: DatasetColumnRole;
    dataType: DatasetDataType;
    index: number;
  }>;
}

export enum DatasetColumnRole {
  DIMENSION = 'dimension',
  MEASURE = 'measure',
}

export enum DatasetDataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
}
