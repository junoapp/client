export function applyClass(condition: boolean | string | undefined, className?: string) {
  return className ? (condition ? className : '') : condition ? condition : '';
}
