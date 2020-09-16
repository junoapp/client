export interface SchemaIndexDimension {
  aliases: Record<string, string>;
  bits_per_level: number;
  hint: string;
  index: number;
  name: string;
  num_levels: number;
}

export interface SchemaMeasureDimension {
  name: string;
  order: number;
  type: string;
}

export interface Schema {
  index_dimensions: SchemaIndexDimension[];
  measure_dimensions: SchemaMeasureDimension[];
  name: string;
  type: string;
}

export interface SchemaColumnIndex {
  hint: string;
  name: string;
  values: number[];
  values_per_row: number;
}

export interface SchemaColumnMeasure {
  name: string;
  values: number[];
}

export interface SchemaColumn {
  index_columns: SchemaColumnIndex[];
  measure_columns: SchemaColumnMeasure[];
  numrows: number;
  type: string;
}
