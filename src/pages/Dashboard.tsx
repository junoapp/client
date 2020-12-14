import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VerticalBarChart } from '../charts/VerticalBarChart';
import { Dataset } from '../models/dataset';
import { getById, getSpec } from '../services/dataset.service';

import { VegaLite } from 'react-vega';
import { LineChart } from '../charts/LineChart';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';

export function Dashboard(): JSX.Element {
  const [chartData, setChartData] = useState<any[]>([]);

  const [specs, setSpecs] = useState<any[]>([]);
  const [barData, setBarData] = useState<Record<string, any[]>[]>([]);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getById(+id).then(async (dataset: Dataset) => {
      const data: any = await getSpec(dataset.id);

      console.log(data);

      let cData: any[] = [];
      for (const d of data) {
        const c = {
          type:
            d.mark === 'bar'
              ? d.key === d.encoding.x.field
                ? 'vertical-bar'
                : 'horizontal-bar'
              : d.mark,
          name: `${d.value} by ${d.key}`,
          values: d.data.values.map((v) => ({
            name: v[d.key],
            value: isNaN(+v[d.value]) ? undefined : +v[d.value],
          })),
        };

        cData.push(c);
      }

      console.log(cData);

      setChartData(cData);
    });
  }, [id]);

  return (
    <div>
      {barData &&
        specs &&
        specs.length > 0 &&
        specs.map((spec, index) => (
          <div key={index}>
            <VegaLite spec={spec} data={barData[index]} />
          </div>
        ))}

      {chartData &&
        chartData.map((chart) => (
          <div key={chart.name}>
            {chart.type === 'line' && (
              <LineChart
                name={chart.name}
                data={chart.values}
                onPress={(data) => console.log(data)}
              />
            )}

            {chart.type === 'vertical-bar' && (
              <VerticalBarChart
                name={chart.name}
                data={chart.values}
                onPress={(data) => console.log(data)}
              />
            )}

            {chart.type === 'horizontal-bar' && (
              <HorizontalBarChart
                name={chart.name}
                data={chart.values}
                onPress={(data) => console.log(data)}
              />
            )}
          </div>
        ))}
    </div>
  );
}
