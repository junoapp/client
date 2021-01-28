import { DatasetSchemaAggregateFunction } from '@junoapp/common';

export type UploadInfoField = {
  id: number;
  originalName?: string;
  name: string;
  index: number;
  role?: 'measure' | 'dimension';
  removed: boolean;
  type: string;
  aggregate: DatasetSchemaAggregateFunction;
};
