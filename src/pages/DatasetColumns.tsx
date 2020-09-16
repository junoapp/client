import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useHistory } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { updateColumns, getColumns } from '../services/dataset.service';
import { Loading } from '../components/ui/Loading';
import { Card } from '../components/ui/Card';
import { Input } from '../components/form/Input';
import { Select } from '../components/form/Select';
import { UploadInfoField } from '../models/upload-info';
import { DropdownOption } from '../models/dropdown-option';

export function DatasetColumns(): JSX.Element {
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState<{ fields: Array<UploadInfoField> }>({ fields: [] });
  const [name, setName] = useState<string | undefined>(undefined);
  const [indexOptions, setIndexOptions] = useState<DropdownOption[]>([]);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getColumns(+id).then((response) => {
      const formFields: UploadInfoField[] = [];
      const indexes: DropdownOption[] = [];

      response.fields.forEach((field, index) => {
        formFields.push({
          name: field,
          index,
        });

        indexes.push({
          label: index.toString(),
          value: index.toString(),
          isDisabled: false,
        });
      });

      setIndexOptions(indexes);
      setName(response.name);
      setLoading(false);
      setValues({
        fields: formFields,
      });
    });
  }, [id]);

  const backToHome = () => {
    history.replace('/');
  };

  const onDragEnd = (result: DropResult, swap: (indexA: number, indexB: number) => void) => {
    if (result.destination) {
      swap(result.source.index, result.destination.index);
    }
  };

  return (
    <div className="relative">
      <Card className="min-h" title={name}>
        <Loading loading={isLoading} />

        {!isLoading && (
          <div className="mt-4">
            <Formik
              enableReinitialize={true}
              initialValues={values}
              onSubmit={async (values) => {
                setLoading(true);
                await updateColumns(+id, values.fields);
                backToHome();
              }}
            >
              {({ getFieldProps, values }) => (
                <Form>
                  <FieldArray name="fields">
                    {({ remove, move }) => (
                      <DragDropContext onDragEnd={(result) => onDragEnd(result, move)}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                              {values.fields.length > 0 &&
                                values.fields.map((item, index) => (
                                  <Draggable key={item.name} draggableId={item.name} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        className="flex -mx-4 bg-white"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <div className="px-4 flex items-center">
                                          <FontAwesomeIcon icon="bars" />
                                        </div>
                                        <div className="px-4 w-1/5">
                                          <Select
                                            name={`fields.${index}.index`}
                                            label="Index"
                                            options={indexOptions}
                                            formik={{ getFieldProps }}
                                          />
                                        </div>
                                        <div className="px-4 w-2/5">
                                          <Input
                                            name={`fields.${index}.name`}
                                            label={`Name ${item.name} ${index}`}
                                            formik={{ getFieldProps }}
                                            disabled
                                          />
                                        </div>
                                        <div className="px-4 w-2/5">
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
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}
                  </FieldArray>
                  <div className="flex justify-end">
                    <button type="button" className="button mr-2" onClick={backToHome}>
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
