import { DatasetChartSpecValues } from '@junoapp/common';
import * as d3 from 'd3';
import { format } from 'date-fns';
import { formatter } from './formatter';
import { elementId, scaleBandInvert } from './functions';

export function createTooltipHorizontal(
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  id: string,
  xScale: d3.ScaleLinear<number, number>,
  data: Array<DatasetChartSpecValues>,
  keys: string[],
  valueMax: number,
  marginLeft: number,
  yScaleBand?: d3.ScaleBand<string>,
  yScaleTime?: d3.ScaleTime<number, number>
): void {
  const groupHover = svg.append('g').attr('id', elementId(id, 'group-data'));

  svg
    .on('mousemove', function (event: any) {
      const [x, y] = (d3 as any).pointer(event);

      const name = yScaleBand ? scaleBandInvert(yScaleBand)(y) : yScaleTime.invert(y);
      const dIndex = data.findIndex((d) =>
        typeof name === 'string' ? d.name === name : d.name === format(name, 'yyyy/MM/dd')
      );

      groupHover.selectAll('.hover-line').remove();
      groupHover.selectAll('.hover-group').remove();

      if (dIndex >= 0) {
        const d = data[dIndex];
        const nextD = data[dIndex + 1];

        let delta = 0;
        let useNext = false;

        if (nextD && yScaleTime) {
          delta = Math.abs(yScaleTime(new Date(d.name)) - yScaleTime(new Date(nextD.name))) / 2;
          useNext = y > yScaleTime(new Date(d.name)) + delta;
        }

        const startY = yScaleBand
          ? yScaleBand(d.name) + yScaleBand.bandwidth() / 2
          : yScaleTime(new Date(useNext ? nextD.name : d.name));

        groupHover
          .append('rect')
          .attr('class', 'hover-line')
          .attr('x', xScale(0))
          .attr('y', startY)
          .attr('width', xScale(valueMax))
          .attr('height', 1)
          .attr('fill', '#ccc')
          .attr('z-index', 999);

        const groupHoverContent = groupHover
          .append('g')
          .attr('class', 'hover-group')
          .attr('pointer-events', 'none')
          .attr('transform', `translate(${x}, ${startY + 5})`);

        groupHoverContent
          .append('rect')
          .attr('class', 'hover-container')
          .attr('fill', 'white')
          .attr('stroke', '#ccc')
          .attr('width', 100)
          .attr('height', 42);

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
          .attr('height', 22)
          .attr('y', 20);

        const title = groupHoverContent
          .append('text')
          .text(
            typeof name === 'string'
              ? name
              : format(new Date(useNext ? nextD.name : d.name), 'dd/MM/yyyy')
          )
          .attr('transform', 'translate(5, 15)')
          .attr('fill', '#fff')
          .attr('font-size', 12)
          .attr('font-weight', 'bold');

        const titleWidth = title.node().getComputedTextLength();

        const text = groupHoverContent
          .append('text')
          .text(keys[0])
          .attr('transform', 'translate(5, 35)')
          .attr('color', 'black')
          .attr('font-size', 12);

        const textWidth = text.node().getComputedTextLength();

        const value = groupHoverContent
          .append('text')
          .text(formatter((useNext ? nextD : d).value))
          .attr('transform', `translate(${textWidth + 15}, 35)`)
          .attr('color', 'black')
          .attr('font-size', 12);

        const valueWidth = value.node().getComputedTextLength();

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
        const positionY = startY + groupHoverContent.node().getBBox().height;

        let moveX = x;
        let moveY = startY + 5;

        if (positionX + 50 > svg.node().getBBox().width) {
          moveX = x - groupHoverContent.node().getBBox().width - 5;
        }

        if (positionY + 50 > svg.node().getBBox().height) {
          moveY = startY - groupHoverContent.node().getBBox().height - 5;
        }

        groupHoverContent.attr('transform', `translate(${moveX}, ${moveY})`);
      }
    })
    .on('mouseleave', () => {
      groupHover.selectAll('.hover-line').remove();
      groupHover.selectAll('.hover-group').remove();
    });
}
