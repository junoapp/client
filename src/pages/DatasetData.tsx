import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateMap, stopServer, request } from '../services/nanocube.service';

export function DatasetData(): JSX.Element {
  const [message, setMessage] = useState<string>('');

  const { id } = useParams();

  useEffect(() => {
    generateMap(id).then((msg) => {
      setMessage(JSON.stringify(msg));
    });
  }, [id]);

  const stopServerHandler = () => {
    stopServer();
  };

  const requestHandler = () => {
    request();
  };

  return (
    <div>
      <div>{message}</div>
      <hr />
      <button type="button" className="button button-primary" onClick={stopServerHandler}>
        Stop server
      </button>
      <hr />
      <button type="button" className="button button-primary" onClick={requestHandler}>
        Some request
      </button>
    </div>
  );
}
