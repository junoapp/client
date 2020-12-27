import { FieldInputProps } from 'formik';
import { DropdownOption } from '../../models/dropdown-option';

export function Select({
  name,
  label,
  options,
  formik,
}: {
  name: string;
  label: string;
  options: Array<DropdownOption>;
  formik: { getFieldProps: (name: string) => FieldInputProps<any> };
}): JSX.Element {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <select className="select" id={name} {...formik.getFieldProps(name)}>
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
