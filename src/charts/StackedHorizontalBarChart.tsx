import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { DatasetChartSpecValues } from '@junoapp/common';

import { generateId } from '../utils/functions';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function StackedHorizontalBarChart(props: {
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

    type StackedData = {
      name: string;
      total: number;
      values: Array<{
        name: string;
        end: number;
        start: number;
      }>;
    };

    let valueMax = Number.MIN_SAFE_INTEGER;

    props.data.sort((a, b) => a.name2.localeCompare(b.name2));

    const data: Array<StackedData> = props.data.reduce(
      (prev: StackedData[], curr: DatasetChartSpecValues) => {
        let item = prev.find((p) => p.name === curr.name);

        if (!item) {
          item = {
            name: curr.name,
            total: 0,
            values: [],
          };

          prev.push(item);
        }

        item.values.push({
          name: curr.name2,
          start: item.total,
          end: item.total + curr.value,
        });

        item.total += curr.value;

        if (item.total >= valueMax) {
          valueMax = item.total;
        }

        return prev;
      },
      []
    );

    const keys = data.map((d) => d.name).reverse();
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

    const colorScale = d3.scaleOrdinal(colors.length > 10 ? ['#3575B1'] : d3.schemeCategory10);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    groupData
      .selectAll('g.group-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'group-item')
      .attr('transform', (d) => `translate(0, ${yScale(d.name)})`)
      .selectAll('rect.data-item')
      .data((d) => d.values)
      .enter()
      .append('rect')
      .attr('class', 'data-item')
      .attr('x', (d) => xScale(d.start))
      .attr('width', (d) => xScale(d.end) - xScale(d.start))
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
