import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useHistory } from 'react-router-dom';

import { updateColumns, getColumns } from '../services/dataset.service';
import { Loading } from '../components/ui/Loading';
import { Card } from '../components/ui/Card';
import { Input } from '../components/form/Input';
import { Select } from '../components/form/Select';
import { UploadInfoField } from '../models/upload-info';

export function DatasetColumns(): JSX.Element {
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState<{ fields: Array<UploadInfoField> }>({ fields: [] });

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getColumns(id).then((response) => {
      const formFields: UploadInfoField[] = [];
      response.fields.forEach((field) => {
        formFields.push({
          name: field,
        });
      });

      setLoading(false);
      setValues({
        fields: formFields,
      });
    });
  }, [id]);

  const backToHome = () => {
    history.replace('/');
  };

  return (
    <div className="relative">
      <Card className="min-h">
        <Loading loading={isLoading} />

        {!isLoading && (
          <div className="mt-4">
            <Formik
              enableReinitialize={true}
              initialValues={values}
              onSubmit={async (values) => {
                setLoading(true);
                await updateColumns(id!, values.fields);
                backToHome();
              }}
            >
              {({ getFieldProps, values }) => (
                <Form>
                  <FieldArray name="fields">
                    {({ remove }) => (
                      <div>
                        {values.fields.length > 0 &&
                          values.fields.map((_, index) => (
                            <div className="flex -mx-4" key={index}>
                              <div className="px-4 w-1/2">
                                <Input
                                  name={`fields.${index}.name`}
                                  label="Name"
                                  formik={{ getFieldProps }}
                                  disabled
                                />
                              </div>
                              <div className="px-4 w-1/2">
                                <Select
                                  name={`fields.${index}.type`}
                                  label="Type"
                                  options={[
                                    { value: 'measure', label: 'Measure' },
                                    { value: 'dimension', label: 'Dimension' },
                                  ]}
                                  formik={{ getFieldProps }}
                                />
                              </div>
                              <div className="px-4 flex items-center">
                                <button
                                  type="button"
                                  className="button button-danger"
                                  onClick={() => remove(index)}
                                >
                                  <FontAwesomeIcon icon="times" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </FieldArray>
                  <div className="flex justify-end">
                    <button type="button" className="button" onClick={backToHome}>
                      Cancel
                    </button>
                    <button type="submit" className="button button-primary">
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </Card>
    </div>
  );
}
