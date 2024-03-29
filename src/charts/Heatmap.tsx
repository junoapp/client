import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { DatasetChartSpecValues } from '@junoapp/common';

import { generateId } from '../utils/functions';
import { getDay, format, addDays, startOfWeek, parse, differenceInDays } from 'date-fns';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function Heatmap(props: { name: string; data: Array<DatasetChartSpecValues> }): JSX.Element {
  const [id] = useState<string>(generateId());

  useEffect(() => {
    const margin = {
      top: 10,
      bottom: 30,
      left: 80,
      right: 80,
    };

    const height = 250;

    const svg = d3.select(`#${id}`).append('svg').attr('width', '100%').attr('height', height);
    const width = svg.node()?.getBoundingClientRect().width;

    const groupData = svg.append('g').attr('id', elementId(id, 'group-data'));
    const groupAxis = svg.append('g').attr('id', elementId(id, 'group-axis'));

    const xAcessor = (d: DatasetChartSpecValues) => new Date(d.name);

    const max = d3.max(props.data, (d) => d.value);

    const dayOfWeeks = Array.from(Array(7)).map((e, i) =>
      format(addDays(startOfWeek(new Date()), i), 'E')
    );

    const formatWeeek = (d: DatasetChartSpecValues) =>
      format(startOfWeek(xAcessor(d)), 'dd/MM/yyyy');

    const weeks = [...new Set(props.data.map((d) => formatWeeek(d)))];

    const xScale = d3
      .scaleBand()
      .domain(weeks)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleBand()
      .range([height - margin.bottom, margin.top])
      .domain(dayOfWeeks)
      .padding(0.1);

    groupData
      .selectAll('rect')
      .data(props.data.filter((d) => !isNaN(d.value)))
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(formatWeeek(d)))
      .attr('y', (d) => yScale(dayOfWeeks[getDay(xAcessor(d))]))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => d3.interpolateBlues(d.value / max));

    const extent = d3.extent(props.data, (d) => parse(d.name, 'yyyy/MM/dd', new Date()));
    const delta = differenceInDays(extent[1], extent[0]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(xScale.domain().filter((d, i) => !(i % Math.ceil(delta * 0.0065))));
    const yAxis = d3.axisLeft(yScale);

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
      <div id={id}></div>
    </div>
  );
}
