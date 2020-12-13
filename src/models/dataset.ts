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

  columns: Array<DatasetColumn>;
}

export interface DatasetColumn {
  id: number;
  name: string;
  role: DatasetColumnRole;
  type: DatasetDataType;
  expandedType: DatasetColumnExpandedType;
  index: number;
  distinctValues: number;
}

export enum DatasetColumnRole {
  DIMENSION = 'dimension',
  MEASURE = 'measure',
}

export enum DatasetDataType {
  STRING = 'string',
  NUMBER = 'number',
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
  DATE = 'date',
}

export enum DatasetColumnExpandedType {
  QUANTITATIVE = 'quantitative',
  ORDINAL = 'ordinal',
  TEMPORAL = 'temporal',
  NOMINAL = 'nominal',
  GEO = 'geo',
  KEY = 'key',
}
