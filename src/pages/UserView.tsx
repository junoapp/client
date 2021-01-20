import { useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardList } from '../components/DashboardList';

import { DatasetsList } from '../components/DatasetsList';
import { UserContext } from '../contexts/user.context';

export function UserView(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const user = useContext(UserContext);

  useEffect(() => {
    user.signIn(id);
  }, [user, id]);

  return (
    <div>
      <div className="flex">
        <Link to={`/dataset/add`} className="button button-primary">
          Add new dataset
        </Link>
      </div>

      <div className="text-lg mt-3">My dashboards</div>

      <hr />

      <div className="mt-5">
        <DashboardList />
      </div>

      <div className="text-lg">Public datasets</div>

      <hr />

      <div className="mt-5">
        <DatasetsList />
      </div>
    </div>
  );
}
