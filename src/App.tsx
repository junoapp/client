import React from 'react';
import { useFormik } from 'formik';
import { useButtonGroup } from './hooks/useButtonGroup';

function App() {
  const [dataset, ButtonGroup] = useButtonGroup(
    [
      { type: 'file', label: 'File (CSV or JSON)' },
      { type: 'database', label: 'Database' },
    ],
    undefined
  );

  const formik = useFormik({
    initialValues: {
      type: '',
      host: '',
      port: '',
      username: '',
      password: '',
      database: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="App">
      <header className="bg-orange-500 p-3 text-white text-lg font-bold">Juno</header>

      <div className="container mx-auto pt-4 mb-8">
        <div>Connect to a dataset:</div>

        <ButtonGroup />

        <div className="mt-4">
          {dataset === 'file' ? (
            <div>
              <label className="label">Upload a file:</label>
              <div className="mt-2">
                <label htmlFor="file" className="button">
                  Select a file
                </label>
                <input type="file" className="opacity-0 absolute hidden" name="file" id="file" />
              </div>
            </div>
          ) : (
            dataset === 'database' && (
              <form className="w-full max-w-lg" onSubmit={formik.handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="label" htmlFor="type">
                      Type
                    </label>
                    <div className="relative">
                      <select className="select" id="type" {...formik.getFieldProps('type')}>
                        <option>Select a type</option>
                        <option value="postgre">Postgres</option>
                        <option value="mySql" disabled>
                          MySQL
                        </option>
                        <option value="oracle" disabled>
                          Oracle
                        </option>
                        <option value="sqlServer" disabled>
                          SQL Server
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-3/4 px-3">
                    <label className="label" htmlFor="host">
                      Host
                    </label>
                    <input
                      className="input"
                      id="host"
                      type="text"
                      placeholder="localhost"
                      {...formik.getFieldProps('host')}
                    />
                  </div>
                  <div className="w-1/4 px-3">
                    <label className="label" htmlFor="port">
                      Port
                    </label>
                    <input
                      className="input"
                      id="port"
                      type="text"
                      placeholder="5432"
                      {...formik.getFieldProps('port')}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="label" htmlFor="username">
                      Username
                    </label>
                    <input
                      className="input"
                      id="username"
                      type="text"
                      placeholder="user"
                      {...formik.getFieldProps('username')}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="label" htmlFor="password">
                      Password
                    </label>
                    <input
                      className="input"
                      id="password"
                      type="password"
                      placeholder="**********"
                      {...formik.getFieldProps('password')}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="label" htmlFor="database">
                      Database
                    </label>
                    <input
                      className="input"
                      id="database"
                      type="text"
                      placeholder="database"
                      {...formik.getFieldProps('database')}
                    />
                  </div>
                </div>

                <button type="submit" className="button">
                  Save
                </button>
              </form>
            )
          )}
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
