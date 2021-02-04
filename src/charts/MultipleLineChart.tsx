import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import {
  DatasetChartSpecValues,
  DatasetRecommendationMultipleLinesAxis,
  DatasetRecommendationMultipleLinesData,
} from '@junoapp/common';

import { generateId } from '../utils/functions';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function MultipleLineChart(props: {
  name: string;
  data: Array<DatasetRecommendationMultipleLinesData>;
  axis: DatasetRecommendationMultipleLinesAxis;
  onPress: (data: DatasetChartSpecValues) => void;
}): JSX.Element {
  const [id] = useState<string>(generateId());

  useEffect(() => {
    const margin = {
      top: 10,
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

    console.log(valueMaxLeft, valueMaxRight, keys);

    const colorScale = d3.scaleOrdinal(keys.length > 10 ? ['#3575B1'] : d3.schemeCategory10);

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
