import React, { useEffect, useState } from 'react';
import { formatRelative } from 'date-fns';
import { Link } from 'react-router-dom';

import { getAll, remove } from '../services/dataset.service';
import { Dataset, DatasetColumnType } from '../models/dataset';
import { Alert } from './ui/Alert';
import { Loading } from './ui/Loading';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function DatasetsList(): JSX.Element {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);

    getAll().then((datasets) => {
      setDatasets(datasets);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const countColumns = (dataset: Dataset, type: DatasetColumnType): React.ReactNode => {
    const count = dataset.columns.filter((column) => column.type === type).length;

    if (count > 0) {
      return (
        <Badge>
          {count} {type.toLowerCase()} column{count > 1 ? 's' : ''}
        </Badge>
      );
    }

    return null;
  };

  const onDeleteHandler = async (id: number) => {
    setIsLoading(true);
    await remove(id);
    load();
  };

  return (
    <div className="relative flex flex-wrap -mx-4 min-h">
      <Loading loading={isLoading} />

      {!isLoading && datasets.length === 0 && (
        <Alert
          title="No dataset loaded"
          message="Upload a CSV file or connect with a database."
          className="mx-4"
        />
      )}

      {!isLoading &&
        datasets.length > 0 &&
        datasets.map((dataset: Dataset) => (
          <div key={dataset['id']} className="w-1/3 px-4 mb-4">
            <Card title={dataset.originalname}>
              <div className="flex flex-col items-start">
                <Badge>CSV</Badge>
                {countColumns(dataset, DatasetColumnType.MEASURE)}
                {countColumns(dataset, DatasetColumnType.DIMENSION)}
                <span className="text-gray-600 text-xs mb-2">
                  Updated {formatRelative(new Date(dataset.updatedDate), new Date())}
                  <br />
                  Created {formatRelative(new Date(dataset.createdDate), new Date())}
                </span>
              </div>
              <div className="flex">
                <Link
                  to={`dataset/${dataset.id}/${dataset.columns.length > 0 ? 'data' : 'columns'}`}
                  className="button button-primary button-small mr-2"
                >
                  <FontAwesomeIcon icon="pencil-alt" />
                  Edit
                </Link>
                <button
                  type="button"
                  className="button button-danger button-small"
                  onClick={() => onDeleteHandler(dataset.id)}
                >
                  <FontAwesomeIcon icon="trash" />
                  Delete
                </button>
              </div>
            </Card>
          </div>
        ))}
    </div>
  );
}
