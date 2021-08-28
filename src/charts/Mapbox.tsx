import { useEffect, useRef } from 'react';
import mapbox from 'mapbox-gl';
import { DatasetGeoChartSpecValues } from '@junoapp/common';

mapbox.accessToken =
  'pk.eyJ1IjoicGF1bG9tZW5lemVzIiwiYSI6ImNrMHZrc3Z2NjEwODMzbG52emduZWFkeTIifQ.fUByXk2mj50HO1xPDiTr5w';

export function MapBox(props: {
  name: string;
  data: Array<DatasetGeoChartSpecValues>;
}): JSX.Element {
  const mapContainer = useRef(null);
  const map = useRef<mapbox.Map>(null);

  useEffect(() => {
    if (map.current) return;

    let latMin = Number.MAX_VALUE;
    let latMax = Number.MIN_VALUE;

    let lngMin = Number.MAX_VALUE;
    let lngMax = Number.MIN_VALUE;

    const data = props.data.filter((d) => d.value > 0);

    const features = data.map((d) => {
      latMin = Math.min(latMin, +d.latitude);
      latMax = Math.max(latMax, +d.latitude);

      lngMin = Math.min(lngMin, +d.longitude);
      lngMax = Math.max(lngMax, +d.longitude);

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.longitude, d.latitude],
        },
        properties: {
          title: d.name,
        },
      };
    });

    map.current = new mapbox.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 9,
      bounds: [
        [latMin, latMax],
        [lngMin, lngMax],
      ],
    });

    map.current.on('load', () => {
      map.current.addSource('points', {
        type: 'geojson',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
        data: {
          type: 'FeatureCollection',
          features: features as any,
        },
      });

      map.current.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-color': '#919ad7',
          'circle-opacity': 0.7,
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
        },
      });

      map.current.addLayer({
        id: 'points-count',
        type: 'symbol',
        source: 'points',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });
    });
  }, [props.data]);

  return (
    <div className="relative mb-4 mt-4" style={{ height: 600 }}>
      <div ref={mapContainer} className="map-container mapContainer" />
    </div>
  );
}
