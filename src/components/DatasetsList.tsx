import { useEffect, useState } from 'react';
import { formatRelative } from 'date-fns';
import { Link } from 'react-router-dom';

import { getAll } from '../services/dataset.service';
import { DatasetInterface, DatasetColumnRole } from '@junoapp/common';
import { Alert } from './ui/Alert';
import { Loading } from './ui/Loading';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function DatasetsList(): JSX.Element {
  const [datasets, setDatasets] = useState<DatasetInterface[]>([]);
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

  const countColumns = (dataset: DatasetInterface, type: DatasetColumnRole): React.ReactNode => {
    const count = dataset.columns.filter((column) => column.role === type).length;

    if (count > 0) {
      return (
        <Badge>
          {count} colunas de {type.toLowerCase() === 'measure' ? 'medidas' : 'dimensões'}
        </Badge>
      );
    }

    return null;
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
        datasets.map((dataset: DatasetInterface) => (
          <div key={dataset.id} className="w-1/3 px-4 mb-4">
            <Card title={dataset.originalname}>
              <div className="flex flex-col items-start">
                <Badge>CSV</Badge>
                {countColumns(dataset, DatasetColumnRole.MEASURE)}
                {countColumns(dataset, DatasetColumnRole.DIMENSION)}
                <span className="text-gray-600 text-xs mb-2">
                  Updated {formatRelative(new Date(dataset.updatedDate), new Date())}
                  <br />
                  Created {formatRelative(new Date(dataset.createdDate), new Date())}
                </span>
              </div>
              <div className="flex">
                <Link
                  to={`/dashboard/add/${dataset.id}`}
                  className="button button-primary button-small mr-2"
                >
                  <FontAwesomeIcon icon="pencil-alt" className="mr-1" />
                  Criar novo Dashboard
                </Link>
              </div>
            </Card>
          </div>
        ))}
    </div>
  );
}
