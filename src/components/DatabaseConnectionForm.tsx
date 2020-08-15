import React from 'react';
import { useFormik } from 'formik';
import { Input } from './Input';
import { Select } from './Select';

export function DatabaseConnectionForm() {
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
    <form className="w-full max-w-lg" onSubmit={formik.handleSubmit}>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <Select
            name="type"
            label="Type"
            options={[
              { value: 'postgre', label: 'Postgres' },
              { value: 'mySql', label: 'MySQL', isDisabled: true },
              { value: 'oracle', label: 'Oracle', isDisabled: true },
              { value: 'sqlServer', label: 'SQL Server', isDisabled: true },
            ]}
            formik={formik}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-3/4 px-3">
          <Input name="host" label="Host" placeholder="localhost" formik={formik} />
        </div>
        <div className="w-1/4 px-3">
          <Input name="port" label="Port" placeholder="5432" formik={formik} />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <Input name="username" label="Username" placeholder="user" formik={formik} />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <Input
            name="password"
            label="Password"
            placeholder="**********"
            type="password"
            formik={formik}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <Input name="database" label="Database" placeholder="database" formik={formik} />
        </div>
      </div>

      <button type="submit" className="button">
        Save
      </button>
    </form>
  );
}
