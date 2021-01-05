import { Link, useParams } from 'react-router-dom';

import { DatasetsList } from '../components/DatasetsList';

export function UserView(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <div className="flex">
        <Link to={`/user/${id}/dashboards/add`} className="button button-primary">
          Add new dashboard
        </Link>
      </div>

      <div className="mt-5">
        <DatasetsList />
      </div>
    </div>
  );
}
