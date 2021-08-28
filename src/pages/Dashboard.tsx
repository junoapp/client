import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VerticalBarChart } from '../charts/VerticalBarChart';
import {
  DatasetRecommendation,
  DatasetChartSpec,
  DashboardInterface,
  DatasetRecommendationMultipleLinesData,
  DatasetChartSpecValues,
  DashboardRecommendation,
  DatasetGeoChartSpecValues,
  DatasetSchemaAggregateFunction,
} from '@junoapp/common';
import { getById } from '../services/dashboard.service';
import { getSpec } from '../services/dashboard-recommendation.service';

import { LineChart } from '../charts/LineChart';
import { Heatmap } from '../charts/Heatmap';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { StackedHorizontalBarChart } from '../charts/StackedHorizontalBarChart';
import { FieldDefBase } from 'vega-lite/build/src/channeldef';
import { Field } from 'vega';
import { InlineData } from 'vega-lite/build/src/data';
import { VegaLite } from 'react-vega';
import { MultipleLineChart } from '../charts/MultipleLineChart';
import { applyClass } from '../utils/functions';
import { Card } from '../components/ui/Card';
import MapChart from '../charts/MapChart';
import { MapBox } from '../charts/Mapbox';
import { GroupedHorizontalBarChart } from '../charts/GroupedHorizontalBarChart';

function convert(value: string) {
  return isNaN(+value) ? undefined : +value;
}

const formatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
}).format;

export function Dashboard(): JSX.Element {
  const [dashboard, setDashboard] = useState<DashboardRecommendation | undefined>(undefined);
  const [chartData, setChartData] = useState<DatasetChartSpec[]>([]);
  const [page, setPage] = useState<string>();
  const [d, setD] = useState<DatasetRecommendation[]>([]);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getById(+id).then((dashboard: DashboardInterface) => {
      getSpec(dashboard.id).then((data: DashboardRecommendation) => {
        // setD(data);
        setDashboard(data);

        let cData: DatasetChartSpec[] = [];

        setPage(data.pages[0].name);

        const clampStrings = dashboard.userDatasets[0].owner.preferences
          ? dashboard.userDatasets[0].owner.preferences.clampStrings
          : 30;

        for (const page of data.pages) {
          for (const datum of page.charts) {
            if (datum.multipleLines) {
              const fieldX = [
                ...new Set(
                  datum.multipleLines.specs.map((spec) => (spec as any).userDimension.name)
                ),
              ];
              const fieldY = [
                ...new Set(datum.multipleLines.specs.map((spec) => (spec as any).userMeasure.name)),
              ];

              cData.push({
                page: page.name,
                type: 'multiple-line',
                name:
                  fieldX.length > 1
                    ? `${fieldY[0]} by ${fieldX.join(', ')}`
                    : `${fieldY.join(', ')} by ${fieldX[0]}`,
                values: datum.multipleLines.data,
                axis: datum.multipleLines.axis,
                keysTitle: fieldX.length > 1 ? fieldX : fieldY,
              });
            } else if (Object.keys(datum.encoding).length === 3) {
              const fieldColor = (datum.encoding.color as FieldDefBase<Field>).field.toString();

              if (datum.userMeasure.aggregate === DatasetSchemaAggregateFunction.Mean) {
                cData.push({
                  page: page.name,
                  type:
                    datum.key === (datum.encoding.x as FieldDefBase<Field>).field
                      ? 'grouped-vertical-bar'
                      : 'grouped-horizontal-bar',
                  name: `${datum.userMeasure.name} by ${
                    datum.trimValues ? `Top ${clampStrings}` : ''
                  } ${datum.userDimension.name} and ${datum.userSecondDimension.name}`,
                  values: ((datum.data as InlineData).values as Array<any>).map((v) => ({
                    name: v[datum.key],
                    name2: v[fieldColor],
                    value: convert(v[datum.value]), // isNaN(+v[datum.value]) ? undefined : +v[datum.value],
                  })),
                });
              } else {
                cData.push({
                  page: page.name,
                  type:
                    datum.key === (datum.encoding.x as FieldDefBase<Field>).field
                      ? 'stacked-vertical-bar'
                      : 'stacked-horizontal-bar',
                  name: `${datum.userMeasure.name} by ${
                    datum.trimValues ? `Top ${clampStrings}` : ''
                  } ${datum.userDimension.name} and ${datum.userSecondDimension.name}`,
                  values: ((datum.data as InlineData).values as Array<any>).map((v) => ({
                    name: v[datum.key],
                    name2: v[fieldColor],
                    value: convert(v[datum.value]), // isNaN(+v[datum.value]) ? undefined : +v[datum.value],
                  })),
                });
              }
            } else if (datum.mark === 'text') {
              cData.push({
                page: page.name,
                type: datum.mark,
                name: datum.value,
                values: [
                  {
                    name: datum.value,
                    value: +(datum.data as InlineData).values[0],
                  },
                ],
              });
            } else if (datum.mark === 'geo-lat-lng') {
              cData.push({
                page: page.name,
                type: datum.mark,
                name: `${datum.value} ${datum.userDimension.name} map`,
                values: ((datum.data as InlineData).values as Array<any>).map((v) => ({
                  name: v[datum.key],
                  value: convert(v[datum.value]),
                  latitude: v['latitude'],
                  longitude: v['longitude'],
                })),
              });
            } else {
              cData.push({
                page: page.name,
                type:
                  datum.mark === 'bar'
                    ? datum.key === (datum.encoding.x as FieldDefBase<Field>).field
                      ? 'vertical-bar'
                      : 'horizontal-bar'
                    : datum.mark,
                name: `${datum.userMeasure.name} of ${
                  datum.trimValues ? `Top ${clampStrings}` : ''
                } ${datum?.userDimension?.name ?? datum.key} ${
                  datum.mark === 'heatmap' ? 'heatmap' : ''
                }`,
                values: ((datum.data as InlineData).values as Array<any>).map((v) => ({
                  name: v[datum.key],
                  value: convert(v[datum.value]), // isNaN(+v[datum.value]) ? undefined : +v[datum.value],
                })),
                geofile: datum.geoFile,
                keysTitle: [datum.userMeasure.name],
              });
            }
          }
        }

        console.log(cData);

        setChartData(cData);
      });
    });

    return () => {
      setChartData([]);
      setD([]);
    };
  }, [id]);

  return (
    <div>
      <div className="flex flex-wrap mb-2">
        {dashboard &&
          dashboard.pages.length > 1 &&
          dashboard.pages.map((dashboardPage) => (
            <button
              key={dashboardPage.name}
              type="button"
              className={`button button-primary mr-2 mb-2 ${applyClass(
                dashboardPage.name === page,
                'active'
              )}`}
              onClick={() => setPage(dashboardPage.name)}
            >
              {dashboardPage.name}
            </button>
          ))}
      </div>

      <div className="flex -mx-4 mb-4">
        {chartData &&
          chartData
            .filter((chart) => chart.type === 'text')
            .map((chart) => (
              <Card title={chart.name} key={chart.name} className="mx-4">
                <div key={chart.name} className="card">
                  <h3>{formatter((chart.values[0] as DatasetChartSpecValues).value)}</h3>
                </div>
              </Card>
            ))}
      </div>

      <div className="space-y-4">
        {chartData &&
          chartData
            .filter((chart) => chart.page === page && chart.type !== 'text')
            .map((chart, index) => (
              <div key={`${chart.name}-${index}`}>
                <Card title={chart.name}>
                  {chart.type === 'geoshape' && (
                    <MapChart
                      name={chart.name}
                      geofile={chart.geofile}
                      data={chart.values as DatasetChartSpecValues[]}
                    />
                  )}

                  {chart.type === 'geo-lat-lng' && (
                    <MapBox name={chart.name} data={chart.values as DatasetGeoChartSpecValues[]} />
                  )}

                  {chart.type === 'multiple-line' && (
                    <MultipleLineChart
                      name={chart.name}
                      data={chart.values as DatasetRecommendationMultipleLinesData[]}
                      axis={chart.axis!}
                      keys={chart.keysTitle}
                    />
                  )}

                  {chart.type === 'line' && (
                    <LineChart
                      name={chart.name}
                      data={chart.values as DatasetChartSpecValues[]}
                      keys={chart.keysTitle}
                    />
                  )}

                  {chart.type === 'heatmap' && (
                    <Heatmap name={chart.name} data={chart.values as DatasetChartSpecValues[]} />
                  )}

                  {chart.type === 'vertical-bar' && (
                    <VerticalBarChart
                      name={chart.name}
                      data={chart.values as DatasetChartSpecValues[]}
                      keys={chart.keysTitle}
                    />
                  )}

                  {chart.type === 'horizontal-bar' && (
                    <HorizontalBarChart
                      name={chart.name}
                      data={chart.values as DatasetChartSpecValues[]}
                      keys={chart.keysTitle}
                    />
                  )}

                  {chart.type === 'stacked-horizontal-bar' && (
                    <StackedHorizontalBarChart
                      name={chart.name}
                      data={chart.values as DatasetChartSpecValues[]}
                    />
                  )}

                  {chart.type === 'grouped-horizontal-bar' && (
                    <GroupedHorizontalBarChart
                      name={chart.name}
                      data={chart.values as DatasetChartSpecValues[]}
                    />
                  )}
                </Card>
              </div>
            ))}
      </div>

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
