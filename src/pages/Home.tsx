import { Link } from 'react-router-dom';

import { useButtonGroup } from '../hooks/useButtonGroup';
import { UploadFileForm } from '../components/UploadFileForm';
import { DatabaseConnectionForm } from '../components/DatabaseConnectionForm';
import { DatasetsList } from '../components/DatasetsList';
import { UsersList } from '../components/UsersList';

export function Home(): JSX.Element {
  const [dataset, ButtonGroup] = useButtonGroup(
    [
      { type: 'load', label: 'Load' },
      { type: 'file', label: 'CSV file' },
      { type: 'database', label: 'Database' },
    ],
    'load'
  );

  return (
    <div>
      <div className="flex">
        <Link to={`/user/add`} className="button button-primary">
          Add new user
        </Link>
      </div>

      <div className="mt-5">
        <UsersList />
      </div>

      {/* <div>Select a previous dataset or insert a new one:</div>

      <ButtonGroup />

      <div className="mt-4">
        {dataset === 'load' && <DatasetsList />}
        {dataset === 'file' && <UploadFileForm />}
        {dataset === 'database' && <DatabaseConnectionForm />}
      </div> */}
    </div>
  );
}
