import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { DatasetChartSpecValues, generateId } from '@junoapp/common';

export function MapChart(props: {
  name: string;
  geofile: string;
  data: Array<DatasetChartSpecValues>;
}): JSX.Element {
  const [id] = useState<string>(generateId());

  useEffect(() => {
    d3.json(`http://localhost:3001/${props.geofile}`).then((shape) => {
      const height = 600;

      const svg = d3.select(`#${id}`).append('svg').attr('width', '100%').attr('height', height);
      const width = svg.node()?.getBoundingClientRect().width;

      const projection = d3.geoMercator().fitExtent(
        [
          [20, 20],
          [width, height],
        ],
        shape as any
      );

      const path = d3.geoPath().projection(projection);
      const max = d3.max(props.data, (d) => d.value);

      const accessor = (d) => {
        const item = props.data.find((datum) => datum.name.trim() === d.properties.name);

        if (item) {
          return d3.interpolateBlues(item.value / max);
        }

        return 'white';
      };

      svg
        .append('g')
        .selectAll('path')
        .data(shape['features'])
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', (d) => accessor(d))
        .style('stroke', '#ccc')
        .attr('alt', (d) => d['properties'].name);

      return () => {
        svg.remove();
      };
    });
  }, [id, props.data, props.geofile]);

  return (
    <div>
      <h1>{props.name}</h1>
      <div id={id}></div>
    </div>
  );
}

export default MapChart;
