import { useState, ChangeEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { uploadDataset } from '../services/dataset.service';
import { Loading } from './ui/Loading';
import { Card } from './ui/Card';

export function UploadFileForm(): JSX.Element {
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const onChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();

    if (event.target.files) {
      try {
        setLoading(true);

        const response = await uploadDataset(event.target.files[0]);

        console.log(response);

        history.push(`/user/${id}/dashboards/${response.id}/columns`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="relative">
      <Card className="min-h">
        <Loading loading={isLoading} />

        {!isLoading && (
          <div>
            <label className="label">Upload a file:</label>
            <div className="mt-2">
              <label htmlFor="file" className="button">
                Select a file
              </label>
              <input
                type="file"
                className="hide"
                name="file"
                id="file"
                onChange={onChangeHandler}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
