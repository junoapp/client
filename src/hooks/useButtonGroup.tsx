import { useState } from 'react';
import { applyClass } from '../utils/functions';

export function useButtonGroup(
  options: Array<{ type: string; label: string }>,
  defaultValue: string | undefined
): [string | undefined, () => JSX.Element, React.Dispatch<React.SetStateAction<string>>] {
  const [state, setState] = useState<string | undefined>(defaultValue);

  const ButtonGroup = () => (
    <div className="flex items-start">
      {options &&
        options.map((option) => (
          <button
            key={option.type}
            type="button"
            className={`button button-primary rounded-none first:rounded-l-md last:rounded-r-md ${applyClass(
              state === option.type,
              'active'
            )}`}
            onClick={() => setState(option.type)}
          >
            {option.label}
          </button>
        ))}
    </div>
  );

  return [state, ButtonGroup, setState];
}
