import { Link, useHistory, withRouter } from 'react-router-dom';

import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';

function Header(): JSX.Element {
  const history = useHistory();
  const { user, signOut } = useContext(UserContext);

  return (
    <header className="bg-yellow-500 p-3 text-white text-lg font-bold flex justify-between">
      <Link to="/">Juno</Link>

      {user && (
        <button
          type="button"
          onClick={() => {
            signOut();
            history.replace('/');
          }}
        >
          Sair
        </button>
      )}
    </header>
  );
}

export default withRouter(Header);
