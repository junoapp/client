import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { applyClass } from '../../utils/functions';

export function Alert({
  title,
  message,
  className,
}: {
  title: string;
  message: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-blue-100 border-blue-500 rounded-b text-blue-900 px-4 py-3 shadow-md w-full h-fit ${applyClass(
        className
      )}`}
      role="alert"
    >
      <div className="flex">
        <div className="py-1 h-6 w-6 text-blue-500 mr-4">
          <FontAwesomeIcon icon="info-circle" />
        </div>
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
