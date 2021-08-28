import { DatasetChartSpecValues } from '@junoapp/common';
import * as d3 from 'd3';
import { format } from 'date-fns';
import { elementId, scaleBandInvert } from './functions';

const formatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
}).format;

export function createTooltipVertical(
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  id: string,
  yScale: d3.ScaleLinear<number, number>,
  data: Array<DatasetChartSpecValues>,
  keys: string[],
  valueMax: number,
  marginTop: number,
  xScaleBand?: d3.ScaleBand<string>,
  xScaleTime?: d3.ScaleTime<number, number>
): void {
  const groupHover = svg.append('g').attr('id', elementId(id, 'group-data'));

  svg
    .on('mousemove', function (event: any) {
      const [x] = (d3 as any).pointer(event);

      const name = xScaleBand ? scaleBandInvert(xScaleBand)(x) : xScaleTime.invert(x);
      const dIndex = data.findIndex((d) => {
        console.log(d, d.name, name);

        return typeof name === 'string' || typeof name === 'number'
          ? d.name === name
          : d.name === format(name, 'yyyy/MM/dd');
      });

      console.log(name, dIndex, data);

      groupHover.selectAll('.hover-line').remove();
      groupHover.selectAll('.hover-group').remove();

      if (dIndex >= 0) {
        const d = data[dIndex];
        const nextD = data[dIndex + 1];

        let delta = 0;
        let useNext = false;

        if (nextD && xScaleTime) {
          delta = Math.abs(xScaleTime(new Date(d.name)) - xScaleTime(new Date(nextD.name))) / 2;
          useNext = x > xScaleTime(new Date(d.name)) + delta;
        }

        const startX = xScaleBand
          ? xScaleBand(d.name) + xScaleBand.bandwidth() / 2
          : xScaleTime(new Date(useNext ? nextD.name : d.name));

        groupHover
          .append('rect')
          .attr('class', 'hover-line')
          .attr('x', startX)
          .attr('y', yScale(valueMax))
          .attr('width', 1)
          .attr('height', yScale(0) - marginTop)
          .attr('fill', '#ccc')
          .attr('z-index', 999);

        const groupHoverContent = groupHover
          .append('g')
          .attr('class', 'hover-group')
          .attr('pointer-events', 'none')
          .attr('transform', `translate(${startX + 5}, ${yScale(valueMax)})`);

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
            typeof name === 'string' || typeof name === 'number'
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
          Math.max(titleWidth, textWidth + valueWidth) + 20
        );
        d3.select('.hover-header-container').attr(
          'width',
          Math.max(titleWidth, textWidth + valueWidth) + 20
        );
        d3.select('.hover-divider').attr('x', textWidth + 10);

        const positionX = startX + groupHoverContent.node().getBBox().width;

        if (positionX + 50 > svg.node().getBBox().width) {
          groupHoverContent.attr(
            'transform',
            `translate(${startX - groupHoverContent.node().getBBox().width - 5}, ${yScale(
              valueMax
            )})`
          );
        }
      }
    })
    .on('mouseleave', () => {
      groupHover.selectAll('.hover-line').remove();
      groupHover.selectAll('.hover-group').remove();
    });
}
