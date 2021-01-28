import { FieldInputProps } from 'formik';
import { DropdownOption } from '../../models/dropdown-option';

export function Select({
  name,
  label,
  options,
  formik,
  disabled,
}: {
  name: string;
  label: string;
  options: Array<DropdownOption>;
  formik: { getFieldProps: (name: string) => FieldInputProps<any> };
  disabled?: boolean;
}): JSX.Element {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <select className="select" id={name} {...formik.getFieldProps(name)} disabled={disabled}>
          <option value="">Select a {label.toLowerCase()}</option>
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
