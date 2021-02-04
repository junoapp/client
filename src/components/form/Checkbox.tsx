import { FieldInputProps } from 'formik';

export function Checkbox({
  name,
  label,
  disabled,
  formik,
  checked,
}: {
  name: string;
  label: string;
  checked: boolean;
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
        id={name}
        type="checkbox"
        checked={checked}
        className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
        disabled={disabled}
        {...formik.getFieldProps(name)}
      />
    </div>
  );
}
