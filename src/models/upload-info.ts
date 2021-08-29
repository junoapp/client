import { DatasetColumnNumberType, DatasetSchemaAggregateFunction } from '@junoapp/common';

export type UploadInfoField = {
  id: number;
  originalName?: string;
  name: string;
  index: number;
  role?: 'measure' | 'dimension';
  removed: boolean;
  type: string;
  aggregate: DatasetSchemaAggregateFunction;
  numberType: DatasetColumnNumberType;
};

export const numberTypeMapper = {
  none: '-',
  dolar: '$',
  real: 'R$',
  percent: '%',
};
