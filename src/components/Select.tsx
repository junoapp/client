import React from 'react';
import { FormikProps } from 'formik';

export function Select({
  name,
  label,
  options,
  formik,
}: {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
    isDisabled?: boolean;
  }>;
  formik: FormikProps<any>;
}): JSX.Element {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <select className="select" id={name} {...formik.getFieldProps('type')}>
          <option>Select a {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.isDisabled || false}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
