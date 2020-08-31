import React from 'react';
import { applyClass } from '../../utils/functions';

export function Card({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div
      className={`w-full h-full rounded overflow-hidden shadow bg-white ${applyClass(className)}`}
    >
      {title && (
        <div className="px-6 pt-4">
          <div className="font-bold text-xl mb-2">{title}</div>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}
