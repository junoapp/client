import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { DatasetChartSpecValues } from '@junoapp/common';

import { generateId } from '../utils/functions';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function LineChart(props: {
  name: string;
  data: Array<DatasetChartSpecValues>;
  onPress: (data: DatasetChartSpecValues) => void;
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
    const width = svg.node()?.getBoundingClientRect().width;

    const groupData = svg.append('g').attr('id', elementId(id, 'group-data'));
    const groupAxis = svg.append('g').attr('id', elementId(id, 'group-axis'));

    const xAcessor = (d: DatasetChartSpecValues) => new Date(d.name);
    const yAcessor = (d: DatasetChartSpecValues) => d.value;

    const valueMax = d3.max(props.data, yAcessor);

    const extent = d3.extent(props.data, xAcessor);

    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, valueMax])
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const lineGenerator = d3
      .line<DatasetChartSpecValues>()
      .defined((d) => !isNaN(d.value))
      .x((d) => xScale(new Date(d.name)))
      .y((d) => yScale(d.value));

    groupData
      .append('path')
      .datum(props.data)
      .attr('d', lineGenerator)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round');

    groupAxis
      .append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${height - margin.bottom})`);

    groupAxis.append('g').call(yAxis).attr('transform', `translate(${margin.left}, 0)`);
  }, [id, props]);

  return (
    <div>
      <h1>{props.name}</h1>
      <div id={id}></div>
    </div>
  );
}
