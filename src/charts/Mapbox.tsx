import { useEffect, useState, useRef } from 'react';
import mapbox from 'mapbox-gl';
import * as d3 from 'd3';
import { DatasetGeoChartSpecValues } from '@junoapp/common';

mapbox.accessToken =
  'pk.eyJ1IjoicGF1bG9tZW5lemVzIiwiYSI6ImNrMHZrc3Z2NjEwODMzbG52emduZWFkeTIifQ.fUByXk2mj50HO1xPDiTr5w';

export function MapBox(props: {
  name: string;
  data: Array<DatasetGeoChartSpecValues>;
}): JSX.Element {
  const [initialized, setInitialized] = useState(false);
  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(2);

  const mapContainer = useRef(null);

  useEffect(() => {
    let map;

    if (!initialized) {
      map = new mapbox.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10', // 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom,
      });

      map.scrollZoom.disable();
      map.addControl(new mapbox.NavigationControl({ showCompass: false }));

      // D3js
      const container = map.getCanvasContainer();
      const svg = d3
        .select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 10);

      setInitialized(true);

      function draw() {
        const max = d3.max(props.data, (d) => d.value);
        const logScale = d3.scaleLog().domain([1, max]).range([1, 10]);

        const boundingBox = mapContainer.current.getBoundingClientRect();
        const center = map.getCenter();
        const zoom = map.getZoom();
        const scale = ((512 * 0.5) / Math.PI) * Math.pow(2, zoom || 1);
        const sphere = { type: 'Sphere' };

        const projection = d3
          .geoMercator()
          .center([center.lng, center.lat])
          .fitWidth(boundingBox.width, sphere as any)
          .fitHeight(boundingBox.height, sphere as any)
          .translate([boundingBox.width / 2, boundingBox.height / 2])
          .scale(scale);

        const points = svg.selectAll('circle.station').data(props.data.filter((d) => d.value > 0));

        points
          .enter()
          .append('circle')
          .attr('class', 'station')
          .attr('cx', (d) => projection([d.longitude, d.latitude])[0])
          .attr('cy', (d) => projection([d.longitude, d.latitude])[1])
          .attr('r', (d) => logScale(+d.value))
          .attr('fill', '#919AD7')
          .attr('opacity', 0.7);

        points
          .attr('cx', (d) => projection([d.longitude, d.latitude])[0])
          .attr('cy', (d) => projection([d.longitude, d.latitude])[1]);
      }

      draw();

      map.on('move', () => {
        setLng(map.getCenter().lng);
        setLat(map.getCenter().lat);
        setZoom(map.getZoom());

        draw();
      });
    }
  }, [lat, lng, zoom, initialized, props.data]);

  return (
    <div className="relative mb-4 mt-4" style={{ height: 600 }}>
      <h1>{props.name}</h1>
      <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />
    </div>
  );
}
