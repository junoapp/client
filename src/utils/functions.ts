import * as d3 from 'd3';

export function applyClass(condition: boolean | string | undefined, className?: string) {
  return className ? (condition ? className : '') : condition ? condition : '';
}

export function generateId(): string {
  return 'juno-' + Math.random().toString(36).substr(2, 9);
}

export function generateId2(): string {
  return 'j' + Math.random().toString(36).substr(2, 9);
}

export function scaleBandInvert(scale: d3.ScaleBand<string>) {
  var domain = scale.domain();
  var paddingOuter = scale(domain[0]) || 0;
  var eachBand = scale.step();

  return function (value: number) {
    var index = Math.floor((value - paddingOuter) / eachBand);
    return domain[Math.max(0, Math.min(index, domain.length - 1))];
  };
}

export function capitalize(value: string) {
  if (value.endsWith('.csv')) {
    value = value.slice(0, -4);
  }

  value = value.replaceAll('_', ' ');

  return value
    .split(' ')
    .map((s) => s.split(/(?=[A-Z])/))
    .flat()
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
    .replace(/\s+/g, ' ');
}

export function createColorScale(
  disability: string,
  keys: string[]
): d3.ScaleOrdinal<string, string> {
  return d3.scaleOrdinal(
    disability?.includes('colorBlind')
      ? keys.length > 4
        ? ['#3575B1']
        : ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c']
      : keys.length > 10
      ? ['#3575B1']
      : d3.schemeCategory10
  );
}

export function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}
