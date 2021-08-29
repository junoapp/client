import * as d3 from 'd3';
import { formatter } from './formatter';
import { elementId } from './functions';

type GroupedData = {
  name: string;
  values: Array<{
    name: string;
    value: number;
  }>;
};

export function createTooltipGroupHorizontal(
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  groupData: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  id: string,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleBand<string>,
  colorScale: d3.ScaleOrdinal<string, string>,
  data: Array<GroupedData>,
  valueMax: number,
  marginLeft: number
): void {
  const groupHover = svg.append('g').attr('id', elementId(id, 'group-data'));

  groupData
    .selectAll('g.group-area')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'group-area')
    .attr('x', (d) => xScale(0))
    .attr('y', (d) => yScale(d.name))
    .attr('width', (d) => xScale(valueMax) - marginLeft)
    .attr('height', (d) => yScale.bandwidth())
    .attr('fill', 'transparent')
    .on('mousemove', function (event: any, d: any) {
      const [x] = (d3 as any).pointer(event);

      groupHover.selectAll('.hover-line').remove();
      groupHover.selectAll('.hover-group').remove();

      const y = yScale(d.name) + yScale.bandwidth() / 2;
      const height = 22 + d.values.length * 20;

      groupHover
        .append('rect')
        .attr('class', 'hover-line')
        .attr('x', xScale(0))
        .attr('y', y)
        .attr('width', xScale(valueMax))
        .attr('height', 1)
        .attr('fill', '#ccc')
        .attr('z-index', 999);

      const groupHoverContent = groupHover
        .append('g')
        .attr('class', 'hover-group')
        .attr('pointer-events', 'none')
        .attr('transform', `translate(${x}, ${y + 5})`);

      groupHoverContent
        .append('rect')
        .attr('class', 'hover-container')
        .attr('fill', 'white')
        .attr('stroke', '#ccc')
        .attr('width', 100)
        .attr('height', height);

      groupHoverContent
        .append('rect')
        .attr('class', 'hover-header-container')
        .attr('fill', '#aaa')
        .attr('width', 100)
        .attr('height', 20);

      groupHoverContent
        .append('rect')
        .attr('class', 'hover-divider')
        .attr('fill', '#ccc')
        .attr('width', 1)
        .attr('height', 2 + d.values.length * 20)
        .attr('y', 20);

      const title = groupHoverContent
        .append('text')
        .text(d.name)
        .attr('transform', 'translate(5, 15)')
        .attr('fill', '#fff')
        .attr('font-size', 12)
        .attr('font-weight', 'bold');

      const titleWidth = title.node().getComputedTextLength();

      groupHoverContent
        .selectAll('rect.color-item')
        .data(d.values)
        .enter()
        .append('rect')
        .attr('class', 'color-item')
        .attr('transform', (d, index) => `translate(5, ${23 + 20 * index})`)
        .attr('width', 15)
        .attr('height', 15)
        .attr('rx', 5)
        .attr('fill', (d) => colorScale(d['name']));

      let textWidth = 0;
      groupHoverContent
        .selectAll('text.text-title')
        .data(d.values)
        .enter()
        .append('text')
        .text((d) => d['name'])
        .attr('class', 'text-title')
        .attr('transform', (d, index) => `translate(24, ${35 + 20 * index})`)
        .attr('color', 'black')
        .attr('font-size', 12)
        .each(function () {
          textWidth = Math.max(textWidth, this.getComputedTextLength() + 35);
        });

      let valueWidth = 0;

      groupHoverContent
        .selectAll('text.text-value')
        .data(d.values)
        .enter()
        .append('text')
        .text((d) => formatter(d['value']))
        .attr('class', 'text-value')
        .attr('transform', (d, index) => `translate(${textWidth + 15}, ${35 + 20 * index})`)
        .attr('color', 'black')
        .attr('font-size', 12)
        .each(function () {
          valueWidth = Math.max(valueWidth, this.getComputedTextLength() + 10);
        });

      d3.select('.hover-container').attr(
        'width',
        Math.max(textWidth + valueWidth, titleWidth) + 20
      );
      d3.select('.hover-header-container').attr(
        'width',
        Math.max(textWidth + valueWidth, titleWidth) + 20
      );
      d3.select('.hover-divider').attr('x', textWidth + 10);

      const positionX = x + groupHoverContent.node().getBBox().width;
      const positionY = y + groupHoverContent.node().getBBox().height;

      let moveX = x;
      let moveY = y + 5;

      if (positionX + 50 > svg.node().getBBox().width) {
        moveX = x - groupHoverContent.node().getBBox().width - 5;
      }

      if (positionY + 50 > svg.node().getBBox().height) {
        moveY = y - groupHoverContent.node().getBBox().height - 5;
      }

      groupHoverContent.attr('transform', `translate(${moveX}, ${moveY})`);
    })
    .on('mouseleave', () => {
      groupHover.selectAll('.hover-line').remove();
      groupHover.selectAll('.hover-group').remove();
    });
}
