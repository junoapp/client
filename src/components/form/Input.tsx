import React from 'react';
import { FieldInputProps } from 'formik';

export function Input({
  name,
  label,
  type,
  placeholder,
  disabled,
  formik,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  formik: { getFieldProps: (name: string) => FieldInputProps<any> };
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
        disabled={disabled}
        {...formik.getFieldProps(name)}
      />
    </div>
  );
}
