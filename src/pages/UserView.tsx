import { useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardList } from '../components/DashboardList';

import { DatasetsList } from '../components/DatasetsList';
import { UserContext } from '../contexts/user.context';
import { getById } from '../services/user.service';

export function UserView(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const user = useContext(UserContext);

  useEffect(() => {
    getById(+id).then((userData) => {
      user.signIn(id, userData.disability);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <div className="flex">
        <Link to={`/dataset/add`} className="button button-primary">
          Adicionar nova base de dados
        </Link>
      </div>

      <div className="text-lg mt-3">Meus Dashboards</div>

      <hr />

      <div className="mt-5">
        <DashboardList />
      </div>

      <div className="text-lg">Bases de dados públicos</div>

      <hr />

      <div className="mt-5">
        <DatasetsList />
      </div>
    </div>
  );
}
