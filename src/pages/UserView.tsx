import { useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

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

      <div className="text-lg mt-3">Public datasets</div>

      <hr />

      <div className="mt-5">
        <DatasetsList />
      </div>

      <div className="text-lg">My dashboards</div>

      <hr />
    </div>
  );
}
