import { useState, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { DatasetChartSpecValues } from '@junoapp/common';

import { createColorScale, generateId } from '../utils/functions';
import { UserContext } from '../contexts/user.context';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function GroupedHorizontalBarChart(props: {
  name: string;
  data: Array<DatasetChartSpecValues>;
}): JSX.Element {
  const [id] = useState<string>(generateId());
  const { disability } = useContext(UserContext);

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

    type GroupedData = {
      name: string;
      values: Array<{
        name: string;
        value: number;
      }>;
    };

    let valueMax = Number.MIN_SAFE_INTEGER;

    props.data.sort((a, b) => a.name2.localeCompare(b.name2));

    const data: Array<GroupedData> = props.data.reduce(
      (prev: GroupedData[], curr: DatasetChartSpecValues) => {
        let item = prev.find((p) => p.name === curr.name);

        if (!item) {
          item = {
            name: curr.name,
            values: [],
          };

          prev.push(item);
        }

        item.values.push({
          name: curr.name2,
          value: curr.value,
        });

        if (curr.value >= valueMax) {
          valueMax = curr.value;
        }

        return prev;
      },
      []
    );

    const keys = data.map((d) => d.name).reverse();
    const groupedKeys = [...new Set(data.map((d) => d.values.map((v) => v.name)).flat())];

    const colors = [...new Set(data.map((d) => d.values.map((v) => v.name)).flat())];

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

    const y2Scale = d3
      .scaleBand()
      .domain(groupedKeys)
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .range([0, yScale.bandwidth()]);

    const colorScale = createColorScale(disability, colors);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const firstGroup = groupData
      .selectAll('g.group-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'group-item')
      .attr('transform', (d) => `translate(0, ${yScale(d.name)})`)
      .selectAll('rect.data-item')
      .data((d) => d.values)
      .enter()
      .append('g')
      .attr('class', 'data-item');

    firstGroup
      .append('rect')
      .attr('x', (d) => xScale(0))
      .attr('y', (d) => y2Scale(d.name))
      .attr('width', (d) => xScale(d.value))
      .attr('height', y2Scale.bandwidth())
      .attr('fill', (d) => colorScale(d.name))
      .attr('pointer-events', 'none');

    firstGroup
      .append('text')
      .attr('x', (d) => xScale(0) + 5)
      .attr('y', (d) => y2Scale(d.name) + y2Scale.bandwidth() - 5)
      .attr('font-size', '12px')
      .text((d) => d.name);

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
