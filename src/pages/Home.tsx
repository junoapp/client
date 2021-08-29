import { Link, useHistory } from 'react-router-dom';

import { UsersList } from '../components/UsersList';
import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';

export function Home(): JSX.Element {
  const history = useHistory();
  const { user } = useContext(UserContext);

  if (user) {
    history.replace(`/user/view/${user}`);
  }

  return (
    <div>
      <div className="flex">
        <Link to={`/user/add`} className="button button-primary">
          Adicionar usuário
        </Link>
      </div>

      <div className="mt-5">
        <UsersList />
      </div>
    </div>
  );
}
