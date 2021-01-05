import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VerticalBarChart } from '../charts/VerticalBarChart';
import { DatasetInterface, DatasetRecommendation, DatasetChartSpec } from '@junoapp/common';
import { getById, getSpec } from '../services/dataset.service';

import { LineChart } from '../charts/LineChart';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { FieldDefBase } from 'vega-lite/build/src/channeldef';
import { Field } from 'vega';
import { InlineData } from 'vega-lite/build/src/data';

export function Dashboard(): JSX.Element {
  const [chartData, setChartData] = useState<DatasetChartSpec[]>([]);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getById(+id)
      .then((dataset: DatasetInterface) => getSpec(dataset.id))
      .then((data: DatasetRecommendation[]) => {
        let cData: DatasetChartSpec[] = [];

        for (const datum of data) {
          cData.push({
            type:
              datum.mark === 'bar'
                ? datum.key === (datum.encoding.x as FieldDefBase<Field>).field
                  ? 'vertical-bar'
                  : 'horizontal-bar'
                : datum.mark,
            name: `${datum.value} by ${datum.trimValues ? 'Top 30' : ''} ${datum.key}`,
            values: ((datum.data as InlineData).values as Array<any>).map((v) => ({
              name: v[datum.key],
              value: isNaN(+v[datum.value]) ? undefined : +v[datum.value],
            })),
          });
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
