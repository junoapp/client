import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VerticalBarChart } from '../charts/VerticalBarChart';
import { DatasetInterface } from '@junoapp/common';
import { getById, getSpec } from '../services/dataset.service';

import { LineChart } from '../charts/LineChart';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';

export function Dashboard(): JSX.Element {
  const [chartData, setChartData] = useState<any[]>([]);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getById(+id)
      .then((dataset: DatasetInterface) => getSpec(dataset.id))
      .then((data) => {
        let cData: any[] = [];

        for (const datum of data) {
          const c = {
            type:
              datum.mark === 'bar'
                ? datum.key === datum.encoding.x.field
                  ? 'vertical-bar'
                  : 'horizontal-bar'
                : datum.mark,
            name: `${datum.value} by ${datum.key}`,
            values: datum.data.values.map((v) => ({
              name: v[datum.key],
              value: isNaN(+v[datum.value]) ? undefined : +v[datum.value],
            })),
          };

          cData.push(c);
        }

        setChartData(cData);
      });
  }, [id]);

  return (
    <div>
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
