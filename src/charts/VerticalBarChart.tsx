import { useState, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { DatasetChartSpecValues } from '@junoapp/common';

import { createColorScale, generateId } from '../utils/functions';
import { UserContext } from '../contexts/user.context';
import { createLegend } from '../utils/legends';
import { createTooltipVertical } from '../utils/tooltip-vertical';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function VerticalBarChart(props: {
  name: string;
  data: Array<DatasetChartSpecValues>;
  keys: string[];
}): JSX.Element {
  const [id] = useState<string>(generateId());
  const { disability } = useContext(UserContext);

  useEffect(() => {
    const margin = {
      top: 40,
      bottom: 30,
      left: 40,
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

    createLegend(
      svg,
      id,
      margin.left,
      colorScale.domain().length > colorScale.range().length ? props.keys : colorScale.domain(),
      colorScale
    );
    createTooltipVertical(svg, id, yScale, props.data, props.keys, valueMax, margin.top, xScale);

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
