import { useState, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import {
  DatasetRecommendationMultipleLinesAxis,
  DatasetRecommendationMultipleLinesData,
} from '@junoapp/common';

import { createColorScale, generateId } from '../utils/functions';
import { UserContext } from '../contexts/user.context';
import { createLegend } from '../utils/legends';
import { format } from 'date-fns';
import { formatter } from '../utils/formatter';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function MultipleLineChart(props: {
  name: string;
  data: Array<DatasetRecommendationMultipleLinesData>;
  axis: DatasetRecommendationMultipleLinesAxis;
  keys: string[];
}): JSX.Element {
  const [id] = useState<string>(generateId());
  const { disability } = useContext(UserContext);

  useEffect(() => {
    const margin = {
      top: 40,
      bottom: 30,
      left: 80,
      right: 80,
    };

    const height = 400;

    const svg = d3.select(`#${id}`).append('svg').attr('width', '100%').attr('height', height);
    const width = svg.node()?.getBoundingClientRect().width;

    const groupData = svg.append('g').attr('id', elementId(id, 'group-data'));
    const groupAxis = svg.append('g').attr('id', elementId(id, 'group-axis'));

    const xAcessor = (d: DatasetRecommendationMultipleLinesData) => new Date(d.name);

    const valueMaxLeft = d3.max(props.data, (d) =>
      d3.max(
        Object.keys(d.values)
          .filter((k) => props.axis[k] === 'left')
          .map((k) => d.values[k])
      )
    );

    const valueMaxRight = d3.max(props.data, (d) =>
      d3.max(
        Object.keys(d.values)
          .filter((k) => props.axis[k] === 'right')
          .map((k) => d.values[k])
      )
    );

    const hasRightAxis = Object.values(props.axis).some((a) => a === 'right');

    const extent = d3.extent(props.data, xAcessor);
    const keys = [
      ...new Set([
        ...Object.keys(props.data[0].values),
        ...Object.keys(props.data[1].values),
        ...Object.keys(props.data[props.data.length - 2].values),
        ...Object.keys(props.data[props.data.length - 1].values),
      ]),
    ].filter((k) => props.axis[k]);

    const colorScale = createColorScale(disability, keys);

    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, valueMaxLeft])
      .range([height - margin.bottom, margin.top]);

    const y2Scale = d3
      .scaleLinear()
      .domain([0, valueMaxRight])
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    const y2Axis = d3.axisRight(y2Scale);

    for (const key of keys) {
      const leftLineGenerator = d3
        .line<DatasetRecommendationMultipleLinesData>()
        .defined((d) => !isNaN(d.values[key]))
        .x((d) => xScale(new Date(d.name)))
        .y((d) => yScale(d.values[key]));

      const rightLineGenerator = d3
        .line<DatasetRecommendationMultipleLinesData>()
        .defined((d) => !isNaN(d.values[key]))
        .x((d) => xScale(new Date(d.name)))
        .y((d) => y2Scale(d.values[key]));

      groupData
        .append('path')
        .datum(props.data)
        .attr('d', props.axis[key] === 'left' ? leftLineGenerator : rightLineGenerator)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('stroke', colorScale(key))
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round');
    }

    groupAxis
      .append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${height - margin.bottom})`);

    groupAxis.append('g').call(yAxis).attr('transform', `translate(${margin.left}, 0)`);

    if (hasRightAxis) {
      groupAxis
        .append('g')
        .call(y2Axis)
        .attr('transform', `translate(${width - margin.right}, 0)`);
    }

    const keysMapper: Record<string, string> = keys.reduce(
      (prev, curr, index) => ({
        ...prev,
        [curr]: props.keys[index],
      }),
      {}
    );

    createLegend(svg, id, margin.left, keys, colorScale, keysMapper);

    const groupHover = svg.append('g').attr('id', elementId(id, 'group-data'));

    svg
      .on('mousemove', function (event: any) {
        const [x] = (d3 as any).pointer(event);

        const name = xScale.invert(x);
        const dIndex = props.data.findIndex((d) => d.name === format(name, 'yyyy/MM/dd'));

        groupHover.selectAll('.hover-line').remove();
        groupHover.selectAll('.hover-group').remove();

        if (dIndex >= 0) {
          const d = props.data[dIndex];
          const nextD = props.data[dIndex + 1];

          let delta = 0;
          let useNext = false;

          if (nextD && xScale) {
            delta = Math.abs(xScale(new Date(d.name)) - xScale(new Date(nextD.name))) / 2;
            useNext = x > xScale(new Date(d.name)) + delta;
          }

          const startX = xScale(new Date(useNext ? nextD.name : d.name));
          const height = 22 + keys.length * 20;

          groupHover
            .append('rect')
            .attr('class', 'hover-line')
            .attr('x', startX)
            .attr('y', yScale(valueMaxLeft))
            .attr('width', 1)
            .attr('height', yScale(0) - margin.top)
            .attr('fill', '#ccc')
            .attr('z-index', 999);

          const groupHoverContent = groupHover
            .append('g')
            .attr('class', 'hover-group')
            .attr('pointer-events', 'none')
            .attr('transform', `translate(${startX + 5}, ${yScale(valueMaxLeft)})`);

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
            .attr('height', 2 + keys.length * 20)
            .attr('y', 20);

          groupHoverContent
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

          groupHoverContent
            .selectAll('rect.color-item')
            .data(keys)
            .enter()
            .append('rect')
            .attr('class', 'color-item')
            .attr('transform', (d, index) => `translate(5, ${23 + 20 * index})`)
            .attr('width', 15)
            .attr('height', 15)
            .attr('rx', 5)
            .attr('fill', (d) => colorScale(d));

          let textWidth = 0;
          groupHoverContent
            .selectAll('text.text-title')
            .data(keys)
            .enter()
            .append('text')
            .text((d) => keysMapper[d])
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
            .data(keys)
            .enter()
            .append('text')
            .text((dd) => (d.values[dd] ? formatter(d.values[dd]) : '-'))
            .attr('class', 'text-value')
            .attr('transform', (d, index) => `translate(${textWidth + 15}, ${35 + 20 * index})`)
            .attr('color', 'black')
            .attr('font-size', 12)
            .each(function () {
              valueWidth = Math.max(valueWidth, this.getComputedTextLength() + 10);
            });

          d3.select('.hover-container').attr('width', textWidth + valueWidth + 20);
          d3.select('.hover-header-container').attr('width', textWidth + valueWidth + 20);
          d3.select('.hover-divider').attr('x', textWidth + 10);

          const positionX = startX + groupHoverContent.node().getBBox().width;

          if (positionX + 50 > svg.node().getBBox().width) {
            groupHoverContent.attr(
              'transform',
              `translate(${startX - groupHoverContent.node().getBBox().width - 5}, ${yScale(
                valueMaxLeft
              )})`
            );
          }
        }
      })
      .on('mouseleave', () => {
        groupHover.selectAll('.hover-line').remove();
        groupHover.selectAll('.hover-group').remove();
      });

    return () => {
      svg.remove();
    };
  }, [id, props, disability]);

  return (
    <div>
      <div id={id}></div>
    </div>
  );
}
