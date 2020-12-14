import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

import { generateId, scaleBandInvert } from '../utils/functions';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export type ChartData = { name: string; value: number; index: number };

export function VerticalBarChart(props: {
  name: string;
  data: Array<ChartData>;
  onPress: (data: ChartData) => void;
}): JSX.Element {
  const [id] = useState<string>(generateId());

  useEffect(() => {
    const margin = {
      top: 10,
      bottom: 30,
      left: 40,
      right: 10,
    };

    const height = 400;

    const svg = d3.select(`#${id}`).append('svg').attr('width', '100%').attr('height', height);
    const width = svg.node()?.getBoundingClientRect().width as number;

    const groupHover = svg.append('g').attr('id', elementId(id, 'group-data'));
    const groupData = svg.append('g').attr('id', elementId(id, 'group-data'));
    const groupAxis = svg.append('g').attr('id', elementId(id, 'group-axis'));

    const xAcessor = (d: ChartData) => d.name;
    const yAcessor = (d: ChartData) => d.value;

    const keys = props.data.map(xAcessor);
    const valueMax = d3.max(props.data, yAcessor) as number;

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

    const colorScale = d3.scaleOrdinal(keys.length > 10 ? ['#3575B1'] : d3.schemeCategory10);

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
            .attr('fill', '#ccc')
            .on('click', () => {
              props.onPress(d);
            });
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
  }, [id, props]);

  return (
    <div>
      <h1>{props.name}</h1>
      <div id={id}></div>
    </div>
  );
}
