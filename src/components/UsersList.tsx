import { useEffect, useState } from 'react';
import { formatRelative } from 'date-fns';
import { Link } from 'react-router-dom';

import { getAll, remove } from '../services/user.service';
import { UserInterface } from '@junoapp/common';
import { Alert } from './ui/Alert';
import { Loading } from './ui/Loading';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function UsersList(): JSX.Element {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);

    getAll().then((users) => {
      setUsers(users);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const onDeleteHandler = async (id: number) => {
    setIsLoading(true);
    await remove(id);
    load();
  };

  return (
    <div className="relative flex flex-wrap -mx-4 min-h">
      <Loading loading={isLoading} />

      {!isLoading && users.length === 0 && (
        <Alert
          title="No user added"
          message="Add some user to start a new dashboard."
          className="mx-4"
        />
      )}

      {!isLoading &&
        users.length > 0 &&
        users.map((user: UserInterface) => (
          <div key={user['id']} className="w-1/3 px-4 mb-4">
            <Card title={user.name}>
              <div className="flex flex-col items-start">
                <Badge>VisLiteracy: {user.visLiteracy}</Badge>
                {user.disability && <Badge>Disability: {user.disability}</Badge>}

                <span className="text-gray-600 text-xs mb-2">
                  Updated {formatRelative(new Date(user.updatedDate), new Date())}
                  <br />
                  Created {formatRelative(new Date(user.createdDate), new Date())}
                </span>
              </div>
              <div className="flex">
                <Link
                  to={`user/${user.id}/dashboards`}
                  className="button button-primary button-small mr-2"
                >
                  <FontAwesomeIcon icon="eye" />
                  View
                </Link>
                <button
                  type="button"
                  className="button button-danger button-small"
                  onClick={() => onDeleteHandler(user.id)}
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
