import { useEffect, useState } from 'react';
import { formatRelative } from 'date-fns';
import { Link, useParams } from 'react-router-dom';

import { getAll, remove } from '../services/dataset.service';
import { DatasetInterface, DatasetColumnRole, DashboardInterface } from '@junoapp/common';
import { Alert } from './ui/Alert';
import { Loading } from './ui/Loading';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function DatasetsList(): JSX.Element {
  const [datasets, setDatasets] = useState<DashboardInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams<{ id: string }>();

  const load = () => {
    setIsLoading(true);

    getAll(+id).then((datasets) => {
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
        datasets.map((dashboard: DashboardInterface) => (
          <div key={dashboard.id} className="w-1/3 px-4 mb-4">
            <Card title={dashboard.name}>
              <div className="flex flex-col items-start">
                <Badge>CSV</Badge>
                {countColumns(dashboard.datasets[0], DatasetColumnRole.MEASURE)}
                {countColumns(dashboard.datasets[0], DatasetColumnRole.DIMENSION)}
                <span className="text-gray-600 text-xs mb-2">
                  Updated {formatRelative(new Date(dashboard.updatedDate), new Date())}
                  <br />
                  Created {formatRelative(new Date(dashboard.createdDate), new Date())}
                </span>
              </div>
              <div className="flex">
                <Link
                  to={`/user/${id}/dashboards/${dashboard.id}/view`}
                  className="button button-primary button-small mr-2"
                >
                  <FontAwesomeIcon icon="eye" />
                  View
                </Link>
                <Link
                  to={`/user/${id}/dashboards/${dashboard.id}/columns`}
                  className="button button-primary button-small mr-2"
                >
                  <FontAwesomeIcon icon="pencil-alt" />
                  Edit
                </Link>
                <button
                  type="button"
                  className="button button-danger button-small"
                  onClick={() => onDeleteHandler(dashboard.id)}
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
