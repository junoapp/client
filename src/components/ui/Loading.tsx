import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Loading({ loading }: { loading: boolean }): JSX.Element {
  return loading ? (
    <div className="absolute top-1/2 left-1/2 -mt-4 -ml-4 h-40">
      <FontAwesomeIcon icon="circle-notch" spin size="2x" className="text-orange-500" />
    </div>
  ) : (
    <></>
  );
}
