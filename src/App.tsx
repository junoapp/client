import React from 'react';

import { useButtonGroup } from './hooks/useButtonGroup';
import { UploadFile } from './components/UploadFile';
import { DatabaseConnectionForm } from './components/DatabaseConnectionForm';

function App() {
  const [dataset, ButtonGroup] = useButtonGroup(
    [
      { type: 'file', label: 'File (CSV or JSON)' },
      { type: 'database', label: 'Database' },
    ],
    undefined
  );

  return (
    <div className="App">
      <header className="bg-orange-500 p-3 text-white text-lg font-bold">Juno</header>

      <div className="container mx-auto pt-4 mb-8">
        <div>Connect to a dataset:</div>

        <ButtonGroup />

        <div className="mt-4">
          {dataset === 'file' && <UploadFile />}
          {dataset === 'database' && <DatabaseConnectionForm />}
        </div>
      </div>

      <div className="border h-12 border-red-600">Toolbar</div>

      <div className="flex flex-1">
        <div className="border w-1/6 h-10"></div>
        <div className="border flex-1 h-10"></div>
        <div className="border w-1/6 h-10"></div>
      </div>
    </div>
  );
}

export default App;
