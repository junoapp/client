import { useEffect, useState, useRef } from 'react';
import mapbox from 'mapbox-gl';
import * as d3 from 'd3';
import { DatasetChartSpecValues } from '@junoapp/common';

import geocodingClient from '@mapbox/mapbox-sdk/services/geocoding';

mapbox.accessToken =
  'pk.eyJ1IjoicGF1bG9tZW5lemVzIiwiYSI6ImNrMHZrc3Z2NjEwODMzbG52emduZWFkeTIifQ.fUByXk2mj50HO1xPDiTr5w';

const geocode = geocodingClient({ accessToken: mapbox.accessToken });

export function MapBox(props: { name: string; data: Array<DatasetChartSpecValues> }): JSX.Element {
  const [initialized, setInitialized] = useState(false);
  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(2);

  const mapContainer = useRef(null);

  useEffect(() => {
    if (!initialized) {
      const map = new mapbox.Map({
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

      const newData = [];
      const promises = [];

      for (const datum of props.data) {
        promises.push(
          geocode
            .forwardGeocode({
              query: datum.name,
              mode: 'mapbox.places',
              limit: 1,
            })
            .send()
        );
      }

      Promise.all(promises).then((locations) => {
        for (let index = 0; index < locations.length; index++) {
          const location = locations[index];
          const data = props.data[index];

          console.log(location);

          newData.push({
            ...data,
            location: location.body.features[0],
          });
        }

        console.log(newData);

        draw();
      });

      async function draw() {
        const max = d3.max(newData, (d) => d.value);
        const logScale = d3.scaleLog().domain([1, max]).range([1, 10]);

        const boundingBox = mapContainer.current.getBoundingClientRect();
        const center = map.getCenter();
        const zoom = map.getZoom();
        const scale = ((512 * 0.5) / Math.PI) * Math.pow(2, zoom || 1);
        const sphere = { type: 'Sphere' };

        const projection = d3
          .geoMercator()
          .center([center.lng, center.lat])
          // .fitWidth(boundingBox.width, sphere)
          // .fitHeight(boundingBox.height, sphere)
          .translate([boundingBox.width / 2, boundingBox.height / 2])
          .scale(scale);

        const points = svg.selectAll('circle.station').data(newData.filter((d) => d.value > 0));

        points
          .enter()
          .append('circle')
          .attr('class', 'station')
          .attr('cx', (d) => projection([d.location.center[0], d.location.center[1]])[0])
          .attr('cy', (d) => projection([d.location.center[0], d.location.center[1]])[1])
          .attr('r', 0)
          .attr('fill', '#919AD7')
          .attr('opacity', 0.7)
          .transition()
          .duration(600)
          .attr('r', (d) => logScale(+d.value));

        points
          .attr('cx', (d) => projection([d.location.center[0], d.location.center[1]])[0])
          .attr('cy', (d) => projection([d.location.center[0], d.location.center[1]])[1]);

        // points.on('click', function (datum) {
        //   map.flyTo({ center: [datum[lngField], datum[latField]], zoom: 3 });
        // });
      }

      map.on('move', () => {
        setLng(map.getCenter().lng);
        setLat(map.getCenter().lat);
        setZoom(map.getZoom());

        draw();
      });
    }
  }, [lat, lng, zoom, initialized]);

  return (
    <div style={{ position: 'relative', height: 400 }}>
      <h1>{props.name}</h1>
      <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />
    </div>
  );
}
