import React from 'react';

import { useButtonGroup } from '../hooks/useButtonGroup';
import { UploadFileForm } from '../components/UploadFileForm';
import { DatabaseConnectionForm } from '../components/DatabaseConnectionForm';
import { DatasetsList } from '../components/DatasetsList';

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
      <div>Select a previous dataset or insert a new one:</div>

      <ButtonGroup />

      <div className="mt-4">
        {dataset === 'load' && <DatasetsList />}
        {dataset === 'file' && <UploadFileForm />}
        {dataset === 'database' && <DatabaseConnectionForm />}
      </div>
    </div>
  );
}
