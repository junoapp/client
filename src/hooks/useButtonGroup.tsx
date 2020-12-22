import { useState } from 'react';
import { applyClass } from '../utils/functions';

export function useButtonGroup(
  options: Array<{ type: string; label: string }>,
  defaultValue: string | undefined
): [string | undefined, () => JSX.Element] {
  const [dataset, setDataset] = useState<string | undefined>(defaultValue);

  const ButtonGroup = () => (
    <div className="flex items-start mt-2">
      {options &&
        options.map((option) => (
          <button
            key={option.type}
            type="button"
            className={`button button-primary mr-2 ${applyClass(
              dataset === option.type,
              'active'
            )}`}
            onClick={() => setDataset(option.type)}
          >
            {option.label}
          </button>
        ))}
    </div>
  );

  return [dataset, ButtonGroup];
}
