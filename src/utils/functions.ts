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
