import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { Dataset } from '../models/dataset';
import { Schema, SchemaColumn, SchemaColumnMeasure, SchemaIndexDimension } from '../models/schema';
import { getById } from '../services/dataset.service';
import { generateMap, stopServer, requestData } from '../services/nanocube.service';

export function DatasetData(): JSX.Element {
  const [message, setMessage] = useState<string>('');
  const [indexDimensions, setIndexDimensions] = useState<SchemaIndexDimension[] | undefined>();
  const [totalColumn, setTotalColumn] = useState<SchemaColumn | undefined>();
  const [indexColumn, setIndexColumn] = useState<Record<string, SchemaColumnMeasure[]>>({});
  const [dataset, setDataset] = useState<Dataset | undefined>();

  const [chartData, setChartData] = useState<any[]>();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    generateMap(+id).then((msg) => {
      setMessage(JSON.stringify(msg));

      requestHandler();
    });
  }, [id]);

  const stopServerHandler = () => {
    stopServer();
  };

  const requestHandler = async () => {
    const schemas: Schema[] = await requestData<Schema[]>('schema()');
    const total: SchemaColumn[] = await requestData<SchemaColumn[]>('q(juno)');

    setTotalColumn(total[0]);
    setIndexDimensions(schemas[0].index_dimensions);

    const dataset: Dataset = await getById(+id);
    setDataset(dataset);

    const indexData: Record<string, SchemaColumnMeasure[]> = {};

    for (const index of schemas[0].index_dimensions) {
      if (index.hint === 'categorical') {
        const data = await requestData<SchemaColumn[]>(
          `q(juno.b('${index.name}',dive(${index.num_levels})))`
        );

        indexData[index.name] = data[0].measure_columns;
      }
    }

    setIndexColumn(indexData);

    const chartData = schemas[0].index_dimensions
      .filter((dimension) => dimension.num_levels <= 3)
      .map((dimension) => {
        const column = dataset.columns.find((column) => column.name === dimension.name);

        return {
          name: dimension.name,
          index: column?.index || 0,
          values: Object.keys(dimension.aliases).map((alias, index) => ({
            name: dimension.aliases[alias],
            index,
            value: indexData[dimension.name] && indexData[dimension.name][0].values[index],
          })),
        };
      });

    chartData.sort((a, b) => a.index - b.index);

    setChartData(chartData);
  };

  const onPress = async (chart: any, data: any) => {
    console.log({ chart, data, dataset, chartData, indexDimensions });

    if (chartData) {
      const index = chartData.findIndex((cData) => cData.name === chart.name);
      const next = chartData.find((cData) => cData.index > chartData[index].index);

      if (next) {
        const [d] = await requestData<SchemaColumn[]>(
          `q(juno.b('country',pathagg(p(${data.index}))).b('${next.name}',dive(p(),1)))`
        );

        const indexDimension = indexDimensions?.find((index) => index.name === next.name);

        console.log(d, indexDimension);
      }
    }
  };

  return (
    <div>
      <div>{message}</div>
      <hr />
      <button type="button" className="button button-primary" onClick={stopServerHandler}>
        Stop server
      </button>
      <hr />
      <button type="button" className="button button-primary" onClick={requestHandler}>
        Some request
      </button>

      {totalColumn &&
        totalColumn.measure_columns.map((column, index) => (
          <div key={index}>
            <strong>{column.name}:</strong> {column.values[0]}
          </div>
        ))}

      {chartData &&
        chartData.map((chart) => (
          <HorizontalBarChart
            key={chart.name}
            data={chart.values}
            onPress={(data) => onPress(chart, data)}
          />
        ))}
    </div>
  );
}
