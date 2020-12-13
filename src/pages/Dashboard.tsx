import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import {
  Dataset,
  DatasetColumn,
  DatasetColumnExpandedType,
  DatasetColumnRole,
  DatasetDataType,
} from '../models/dataset';
import { getById, getDataForColumn, getSpec } from '../services/dataset.service';

import { VegaLite, VisualizationSpec } from 'react-vega';
import { generateId2 } from '../utils/functions';
import { AnyMark } from 'vega-lite/build/src/mark';

export function Dashboard(): JSX.Element {
  const [chartData, setChartData] = useState<any[]>([]);

  const [specs, setSpecs] = useState<any[]>([]);
  const [barData, setBarData] = useState<Record<string, any[]>[]>([]);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getById(+id).then(async (dataset: Dataset) => {
      const datas = [];

      const columnTable: {
        dimensions: string[];
        measures: string[];
        columns: string[][];
      } = {
        dimensions: [],
        measures: [],
        columns: [],
      };

      // columnTable.measures.push('count(*)');

      const _specs: any[] = [];
      const _data: Record<string, any[]>[] = [];

      const newData: { dimensions: DatasetColumn[]; measures: DatasetColumn[]; spec: any[] } = {
        dimensions: [],
        measures: [],
        spec: [],
      };
      for (const column of dataset.columns) {
        if (column.role === DatasetColumnRole.DIMENSION) {
          if (column.type === DatasetDataType.STRING) {
            if (column.distinctValues > 1 && column.distinctValues < 20) {
              newData.dimensions.push(column);
            }
          } else {
            if (column.expandedType === DatasetColumnExpandedType.GEO) {
              if (column.distinctValues > 1 && column.distinctValues < 20) {
                newData.dimensions.push(column);
              }
            } else {
              newData.dimensions.push(column);
            }
          }
        } else {
          newData.measures.push(column);
        }
      }

      newData.dimensions.sort((a, b) => {
        if (a.type === DatasetDataType.DATE) {
          return -1;
        }

        if (b.type === DatasetDataType.DATE) {
          return 1;
        }

        return a.distinctValues - b.distinctValues;
      });

      for (const dimension of newData.dimensions) {
        for (const measure of newData.measures) {
          const encodings: any[] = [
            {
              channel: '?',
              field: dimension.name,
              type:
                dimension.expandedType === DatasetColumnExpandedType.GEO
                  ? DatasetColumnExpandedType.NOMINAL
                  : dimension.expandedType,
            },
            {
              channel: '?',
              field: measure.name,
              aggregate: 'sum',
              type: measure.expandedType,
              scale: {},
            },
          ];

          if (dimension.type === DatasetDataType.DATE) {
            encodings[0].timeUnit = 'year';
          }

          newData.spec.push(encodings);
        }
      }

      console.log(newData.spec);

      for (const spec of newData.spec) {
        try {
          const data: any = await getSpec(dataset.id, spec);

          console.log(data);

          if (data.items[0].mark === 'point') {
            continue;
          }

          const id = generateId2();

          _data.push({
            [id]: data.items[0].data.values,
          });

          data.data = {
            name: id,
          };

          _specs.push(data.items[0]);
        } catch {
          continue;
        }
      }

      // console.log(newData);

      // for (const column of dataset.columns) {
      //   if (column.expandedType !== DatasetColumnExpandedType.GEO) {
      //     if (column.role === DatasetColumnRole.DIMENSION) {
      //       if (column.type === DatasetDataType.STRING) {
      //         if (column.distinctValues < 20) {
      //           columnTable.dimensions.push(column.name);
      //         }
      //       } else {
      //         columnTable.dimensions.push(column.name);
      //       }
      //     } else {
      //       columnTable.measures.push(column.name);
      //     }
      //   }
      // }

      // console.log(columnTable);

      // for (const dim of columnTable.dimensions) {
      //   columnTable.columns.push([dim]);

      //   for (const dim2 of columnTable.dimensions) {
      //     if (dim !== dim2) {
      //       columnTable.columns.push([dim, dim2]);
      //     }
      //   }
      // }

      // for (const dim of columnTable.dimensions) {
      //   for (const mes of columnTable.measures) {
      //     columnTable.columns.push([dim, mes]);
      //   }
      // }

      for (const mes of columnTable.measures) {
        // if (mes !== 'count(*)') {
        //   columnTable.columns.push([mes]);
        //   for (const mes1 of columnTable.measures) {
        //     if (mes !== mes1) {
        //       columnTable.columns.push([mes, mes1]);
        //     }
        //   }
        // }
        // if (!columnTable.columns[dim]) {
        //   columnTable.columns[dim] = {};
        // }
        // for (const mes of columnTable.measures) {
        //   if (mes === 'count(*)') {
        //     columnTable.columns[dim][mes] = ['bar', 'line'];
        //   } else {
        //     for (const func of ['sum', 'avg']) {
        //       columnTable.columns[dim][`${func}(${mes})`] = ['bar', 'line'];
        //     }
        //   }
        // }
      }

      // if (columnTable.measures.length > 1) {
      //   for (const mes1 of columnTable.measures) {
      //     if (mes1 === 'count(*)') {
      //       continue;
      //     }

      //     columnTable.columns[mes1] = {};

      //     for (const mes2 of columnTable.measures) {
      //       if (mes2 === 'count(*)') {
      //         continue;
      //       }

      //       if (mes1 !== mes2) {
      //         // columnTable.columns[mes1].push(mes2);

      //         for (const func of ['sum', 'avg']) {
      //           columnTable.columns[mes1][`${func}(${mes2})`] = ['point'];
      //         }
      //       }
      //     }
      //   }
      // }

      console.log(columnTable);

      for (const col of columnTable.columns) {
        try {
          const data: any = await getDataForColumn(dataset.id, col[0], col[1] ? col[1] : undefined);

          console.log(data);

          const id = generateId2();

          _data.push({
            [id]: data.items[0].data.values,
          });

          data.data = {
            name: id,
          };

          _specs.push(data.items[0]);
        } catch {
          continue;
        }

        // break;
      }

      // for (const name of Object.keys(columnTable.columns)) {
      //   for (const value of Object.keys(columnTable.columns[name])) {
      //     const data = await getDataForColumn(dataset.id, name, value);

      //     break;
      //     console.log(name, value);
      //     datas.push({
      //       name: name,
      //       values: data,
      //     });

      //     for (const mark of columnTable.columns[name][value]) {
      //       const id = generateId2();
      //       _specs.push({
      //         width: 400,
      //         height: 200,
      //         mark: mark as AnyMark,
      //         encoding: {
      //           x: {
      //             field: 'name',
      //             type: mark === 'point' ? 'quantitative' : 'ordinal',
      //             title: name,
      //           },
      //           y: { field: 'value', type: 'quantitative', title: value },
      //         },
      //         data: { name: id },
      //       });
      //       _data.push({
      //         [id]: data,
      //       });
      //     }
      //   }

      //   break;
      // }

      setSpecs(_specs);
      setBarData(_data);

      console.log(_specs, _data);
      setChartData(datas);
    });
  }, [id]);

  return (
    <div>
      {barData &&
        specs &&
        specs.length > 0 &&
        specs.map((spec, index) => (
          <div>
            <VegaLite key={index} spec={spec} data={barData[index]} />
          </div>
        ))}

      {/* {chartData &&
        chartData.map((chart) => (
          <HorizontalBarChart
            key={chart.name}
            name={chart.name}
            data={chart.values}
            onPress={(data) => console.log(data)}
          />
        ))} */}
    </div>
  );
}
