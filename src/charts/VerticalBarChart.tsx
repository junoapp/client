import { useState, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { DatasetChartSpecValues } from '@junoapp/common';

import { createColorScale, generateId, scaleBandInvert } from '../utils/functions';
import { UserContext } from '../contexts/user.context';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function VerticalBarChart(props: {
  name: string;
  data: Array<DatasetChartSpecValues>;
}): JSX.Element {
  const [id] = useState<string>(generateId());
  const { disability } = useContext(UserContext);

  useEffect(() => {
    const margin = {
      top: 10,
      bottom: 30,
      left: 40,
      right: 10,
    };

    const height = 400;

    const svg = d3.select(`#${id}`).append('svg').attr('width', '100%').attr('height', height);
    const width = svg.node()?.getBoundingClientRect().width;

    const groupHover = svg.append('g').attr('id', elementId(id, 'group-data'));
    const groupData = svg.append('g').attr('id', elementId(id, 'group-data'));
    const groupAxis = svg.append('g').attr('id', elementId(id, 'group-axis'));

    const xAcessor = (d: DatasetChartSpecValues) => d.name;
    const yAcessor = (d: DatasetChartSpecValues) => d.value;

    const keys = props.data.map(xAcessor);
    const valueMax = d3.max(props.data, yAcessor);

    const xScale = d3
      .scaleBand()
      .domain(keys)
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, valueMax])
      .range([height - margin.bottom, margin.top]);

    const colorScale = createColorScale(disability, keys);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .on('mousemove', function (event: any) {
        const [x] = (d3 as any).pointer(event);

        const name = scaleBandInvert(xScale)(x);

        const d = props.data.find((d) => d.name === name);

        groupHover.selectAll('.hover-rect').remove();
        if (d) {
          const scaleMargin = xScale.step() * xScale.paddingInner();

          groupHover
            .append('rect')
            .attr('class', 'hover-rect')
            .attr('x', (xScale(d.name) as number) - scaleMargin / 2)
            .attr('y', yScale(valueMax))
            .attr('width', xScale.bandwidth() + scaleMargin)
            .attr('height', yScale(0) - margin.top)
            .attr('fill', '#ccc');
        }
      })
      .on('mouseleave', () => {
        groupHover.selectAll('.hover-rect').remove();
      });

    groupData
      .selectAll('rect.data-item')
      .data(props.data)
      .enter()
      .append('rect')
      .attr('class', 'data-item')
      .attr('x', (d) => xScale(d.name) as number)
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.value))
      .attr('fill', (d) => colorScale(d.name))
      .attr('pointer-events', 'none');

    groupAxis
      .append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${height - margin.bottom})`);

    groupAxis.append('g').call(yAxis).attr('transform', `translate(${margin.left}, 0)`);

    return () => {
      svg.remove();
    };
  }, [id, props, disability]);

  return (
    <div>
      <h1>{props.name}</h1>
      <div id={id}></div>
    </div>
  );
}
