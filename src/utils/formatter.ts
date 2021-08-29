import { DatasetColumnNumberType } from '@junoapp/common';

export function formatter(
  value: number,
  type: DatasetColumnNumberType = DatasetColumnNumberType.NONE
): string {
  switch (type) {
    case 'real':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    case 'percent':
      return `${new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(value)}%`;
    case 'dolar':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    default:
      return new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(value);
  }
}
