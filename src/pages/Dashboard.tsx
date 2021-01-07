import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VerticalBarChart } from '../charts/VerticalBarChart';
import {
  DatasetRecommendation,
  DatasetChartSpec,
  DashboardInterface,
  UserVisLiteracy,
} from '@junoapp/common';
import { getById, getSpec } from '../services/dataset.service';

import { LineChart } from '../charts/LineChart';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { FieldDefBase } from 'vega-lite/build/src/channeldef';
import { Field } from 'vega';
import { InlineData } from 'vega-lite/build/src/data';
import { VegaLite, VisualizationSpec } from 'react-vega';

function convert(value: string) {
  return isNaN(+value) ? undefined : +value;
}

export function Dashboard(): JSX.Element {
  const [chartData, setChartData] = useState<DatasetChartSpec[]>([]);
  const [d, setD] = useState<DatasetRecommendation[]>([]);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getById(+id).then((dashboard: DashboardInterface) => {
      getSpec(dashboard.id).then((data: DatasetRecommendation[]) => {
        setD(data);

        let cData: DatasetChartSpec[] = [];

        for (const datum of data) {
          if (
            dashboard.user.visLiteracy !== UserVisLiteracy.low &&
            data.length > 2 &&
            data[0].mark === 'line' &&
            data[1].mark === 'line' &&
            data[0].value === data[1].value
          ) {
            if (datum.key === data[0].key) {
              cData.push({
                type: 'line-2',
                hasSecondAxis: true,
                // datum.mark === 'bar'
                //   ? datum.key === (datum.encoding.x as FieldDefBase<Field>).field
                //     ? 'vertical-bar'
                //     : 'horizontal-bar'
                //   : datum.mark,
                name: `${datum.value} by ${datum.trimValues ? 'Top 30' : ''} ${datum.key}`,
                values: ((datum.data as InlineData).values as Array<any>).map((v) => {
                  const v2 = ((data[1].data as InlineData).values as Array<any>).find(
                    (vv) => vv[data[1].key] === v[datum.key]
                  );

                  return {
                    name: v[datum.key],
                    value: convert(v[datum.value]),
                    value2: v2 ? convert(v2[data[1].value]) : undefined,
                  };
                }),
              });

              console.log(cData);
            }
          } else {
            cData.push({
              type: datum.mark,
              hasSecondAxis: false,
              // datum.mark === 'bar'
              //   ? datum.key === (datum.encoding.x as FieldDefBase<Field>).field
              //     ? 'vertical-bar'
              //     : 'horizontal-bar'
              //   : datum.mark,
              name: `${datum.value} by ${datum.trimValues ? 'Top 30' : ''} ${datum.key}`,
              values: ((datum.data as InlineData).values as Array<any>).map((v) => ({
                name: v[datum.key],
                value: isNaN(+v[datum.value]) ? undefined : +v[datum.value],
              })),
            });
          }
        }

        setChartData(cData);
      });
    });
  }, [id]);

  return (
    <div>
      {chartData &&
        chartData.map((chart) => (
          <div key={chart.name}>
            {chart.type === 'line-2' && (
              <LineChart
                name={chart.name}
                data={chart.values}
                hasSecondAxis={true}
                onPress={(data) => console.log(data)}
              />
            )}

            {chart.type === 'line' && (
              <LineChart
                name={chart.name}
                data={chart.values}
                hasSecondAxis={false}
                onPress={(data) => console.log(data)}
              />
            )}

            {/* {chart.type === 'vertical-bar' && (
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
            )} */}
          </div>
        ))}

      {d &&
        d
          .filter((dd) => dd.mark !== 'line')
          .map((dd) => (
            <span>
              <VegaLite spec={dd as any} data={dd.data as any} />
            </span>
          ))}
    </div>
  );
}
