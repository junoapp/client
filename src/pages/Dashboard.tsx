import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { Dataset, DatasetColumnType } from '../models/dataset';
import { getById, getDataForColumn } from '../services/dataset.service';

export function Dashboard(): JSX.Element {
  const [chartData, setChartData] = useState<any[]>([]);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getById(+id).then(async (dataset: Dataset) => {
      const datas = [];

      for (const column of dataset.columns) {
        if (column.type === DatasetColumnType.DIMENSION) {
          const data = await getDataForColumn(dataset.id, column.id);

          datas.push({
            name: column.name,
            values: data,
          });
        }
      }

      setChartData(datas);
    });
  }, [id]);

  return (
    <div>
      {chartData &&
        chartData.map((chart) => (
          <HorizontalBarChart
            key={chart.name}
            name={chart.name}
            data={chart.values}
            onPress={(data) => console.log(data)}
          />
        ))}
    </div>
  );
}
