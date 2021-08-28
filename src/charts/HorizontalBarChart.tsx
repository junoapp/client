import { useState, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { DatasetChartSpecValues } from '@junoapp/common';

import { createColorScale, generateId } from '../utils/functions';
import { UserContext } from '../contexts/user.context';
import { createLegend } from '../utils/legends';
import { createTooltipHorizontal } from '../utils/tooltip-horizontal';

function elementId(svgId: string, id: string): string {
  return `${svgId}-${id}`;
}

export function HorizontalBarChart(props: {
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
      left: 0,
      right: 10,
    };

    const height = 450;

    const svg = d3.select(`#${id}`).append('svg').attr('width', '100%').attr('height', height);
    const width = svg.node()?.getBoundingClientRect().width;

    const groupData = svg.append('g').attr('id', elementId(id, 'group-data'));
    const groupAxis = svg.append('g').attr('id', elementId(id, 'group-axis'));

    const xAcessor = (d: DatasetChartSpecValues) => d.name;
    const yAcessor = (d: DatasetChartSpecValues) => d.value;

    const keys = props.data.map(xAcessor);
    const valueMax = d3.max(props.data, yAcessor);

    var maxTextWidth = 0;

    svg
      .append('g')
      .selectAll('.dummyText')
      .data(keys)
      .enter()
      .append('text')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '14px')
      .text((d) => d)
      .each(function () {
        const thisWidth = this.getComputedTextLength() + 10;
        if (thisWidth > maxTextWidth) {
          maxTextWidth = thisWidth;
        }

        this.remove();
      });

    margin.left = maxTextWidth;

    const xScale = d3
      .scaleLinear()
      .domain([0, valueMax])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(keys)
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .range([margin.top, height - margin.bottom]);

    const colorScale = createColorScale(disability, keys);

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
      .attr('width', (d) => xScale(d.value) - xScale(0))
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => colorScale(d.name))
      .attr('pointer-events', 'none');

    groupAxis
      .append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${height - margin.bottom})`);

    groupAxis
      .append('g')
      .call(yAxis)
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr('class', 'y-axis');

    createLegend(
      svg,
      id,
      margin.left,
      colorScale.domain().length > colorScale.range().length ? props.keys : colorScale.domain(),
      colorScale
    );

    createTooltipHorizontal(svg, id, xScale, props.data, props.keys, valueMax, margin.left, yScale);

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
