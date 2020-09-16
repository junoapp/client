import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { Schema, SchemaColumn, SchemaColumnMeasure, SchemaIndexDimension } from '../models/schema';
import { generateMap, stopServer, requestData } from '../services/nanocube.service';

export function DatasetData(): JSX.Element {
  const [message, setMessage] = useState<string>('');
  const [indexDimensions, setIndexDimensions] = useState<SchemaIndexDimension[] | undefined>();
  const [totalColumn, setTotalColumn] = useState<SchemaColumn | undefined>();
  const [indexColumn, setIndexColumn] = useState<Record<string, SchemaColumnMeasure[]>>({});

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

    const total = await requestData<SchemaColumn[]>('q(juno)');

    setTotalColumn(total[0]);
    setIndexDimensions(schemas[0].index_dimensions);

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

    const teste = schemas[0].index_dimensions
      .filter((dimension) => dimension.num_levels <= 3)
      .map((dimension) => ({
        name: dimension.name,
        values: Object.keys(dimension.aliases).map((alias, index) => ({
          name: dimension.aliases[alias],
          index,
          value: indexData[dimension.name] && indexData[dimension.name][0].values[index],
        })),
      }));

    setChartData(teste);
  };

  const onPress = async (data: any) => {
    const d = await requestData<any>(
      `q(juno.b('country',pathagg(p(${data.index}))).b('state',dive(p(),1)))`
    );

    console.log(d);
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
          <HorizontalBarChart key={chart.name} data={chart.values} onPress={onPress} />
        ))}
    </div>
  );
}
