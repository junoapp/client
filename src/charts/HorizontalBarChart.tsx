import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { DatasetChartSpecValues } from '@junoapp/common';

import { generateId } from '../utils/functions';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function HorizontalBarChart(props: {
  name: string;
  data: Array<DatasetChartSpecValues>;
  onPress: (data: DatasetChartSpecValues) => void;
}): JSX.Element {
  const [id] = useState<string>(generateId());

  useEffect(() => {
    const margin = {
      top: 10,
      bottom: 30,
      left: 100,
      right: 10,
    };

    const height = 400;

    const svg = d3.select(`#${id}`).append('svg').attr('width', '100%').attr('height', height);
    const width = svg.node()?.getBoundingClientRect().width;

    const groupData = svg.append('g').attr('id', elementId(id, 'group-data'));
    const groupAxis = svg.append('g').attr('id', elementId(id, 'group-axis'));

    const xAcessor = (d: DatasetChartSpecValues) => d.name;
    const yAcessor = (d: DatasetChartSpecValues) => d.value;

    const keys = props.data.map(xAcessor);
    const valueMax = d3.max(props.data, yAcessor);

    const xScale = d3
      .scaleLinear()
      .domain([0, valueMax])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(keys)
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal(keys.length > 10 ? ['#3575B1'] : d3.schemeCategory10);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    groupData
      .selectAll('rect.data-item')
      .data(props.data)
      .enter()
      .append('rect')
      .attr('class', 'data-item')
      .attr('x', xScale(0))
      .attr('y', (d) => yScale(d.name))
      .attr('width', (d) => xScale(d.value))
      .attr('height', yScale.bandwidth())
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
