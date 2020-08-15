import React from 'react';
import { FormikProps } from 'formik';

export function Input({
  name,
  label,
  type,
  placeholder,
  formik,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  formik: FormikProps<any>;
}): JSX.Element {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        className="input"
        id={name}
        type={type || 'text'}
        placeholder={placeholder || ''}
        {...formik.getFieldProps(name)}
      />
    </div>
  );
}
