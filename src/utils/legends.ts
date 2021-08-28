import { elementId } from './functions';

export function createLegend(
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  id: string,
  marginLeft: number,
  keys: string[],
  colorScale: (x: string) => string,
  keysMapper?: Record<string, string>
): void {
  const keysLength: Record<number, number> = {};

  svg
    .append('g')
    .selectAll('.dummyText')
    .data(keys)
    .enter()
    .append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '14px')
    .text((d) => (keysMapper ? keysMapper[d] : d))
    .each(function (_, index) {
      const thisWidth = this.getComputedTextLength() + 10;

      keysLength[index] = 30 + (index === 0 ? thisWidth : thisWidth + keysLength[index - 1]);

      this.remove();
    });

  const groupLegend = svg
    .append('g')
    .attr('id', elementId(id, 'group-legend'))
    .attr('transform', `translate(${marginLeft}, 10)`);

  const groupLegendItem = groupLegend
    .selectAll('g.legend-item')
    .data(keys)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (_, i) => `translate(${i === 0 ? 0 : keysLength[i - 1]}, 0)`);

  groupLegendItem
    .append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('rx', 5)
    .attr('fill', (d) => colorScale(d));

  groupLegendItem
    .append('text')
    .text((d) => (keysMapper ? keysMapper[d] : d))
    .attr('font-family', 'sans-serif')
    .attr('font-size', '14px')
    .attr('transform', `translate(20, 13)`);
}
