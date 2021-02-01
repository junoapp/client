import { useButtonGroup } from '../hooks/useButtonGroup';
import { UploadFileForm } from '../components/UploadFileForm';
import { DatabaseConnectionForm } from '../components/DatabaseConnectionForm';

export function DatasetAdd(): JSX.Element {
  const [dataset, ButtonGroup] = useButtonGroup(
    [
      { type: 'file', label: 'CSV file' },
      { type: 'database', label: 'Database' },
    ],
    'file'
  );

  return (
    <div>
      <ButtonGroup />

      <div className="mt-4">
        {dataset === 'file' && <UploadFileForm />}
        {dataset === 'database' && <DatabaseConnectionForm />}
      </div>
    </div>
  );
}
