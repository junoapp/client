import { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useHistory } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { updateColumns, getById } from '../services/dataset.service';
import { Loading } from '../components/ui/Loading';
import { Card } from '../components/ui/Card';
import { Input } from '../components/form/Input';
import { Select } from '../components/form/Select';
import { UploadInfoField } from '../models/upload-info';
import { DropdownOption } from '../models/dropdown-option';
import { DashboardGoal, DashboardPurpose, DatasetColumnRole } from '@junoapp/common';

export function DatasetColumns(): JSX.Element {
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState<{
    name: string;
    type: string;
    purpose: string;
    fields: Array<UploadInfoField>;
  }>({ name: '', type: '', purpose: '', fields: [] });

  const [name, setName] = useState<string | undefined>(undefined);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getById(+id).then((response) => {
      const formFields: UploadInfoField[] = [];
      const indexes: DropdownOption[] = [];

      response.datasets[0].columns.forEach((field, index) => {
        formFields.push({
          id: field.id,
          name: field.name,
          role: field.role,
          index,
        });

        indexes.push({
          label: index.toString(),
          value: index.toString(),
          isDisabled: false,
        });
      });

      setName(response.datasets[0].originalname);
      setLoading(false);
      setValues({
        name: response.datasets[0].originalname,
        type: '',
        purpose: '',
        fields: formFields,
      });
    });
  }, [id]);

  const backToHome = () => {
    history.goBack();
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
                const fields = values.fields.map((f, i) => ({
                  ...f,
                  index: i,
                  role: f.role as DatasetColumnRole,
                }));
                console.log(values, fields);
                setLoading(true);
                await updateColumns(+id, {
                  id: +id,
                  name: values.name,
                  goal: values.type as DashboardGoal,
                  purpose: values.purpose as DashboardPurpose,
                  colums: fields,
                });
                backToHome();
              }}
            >
              {({ getFieldProps, values }) => (
                <Form>
                  <div className="flex -mx-4 bg-white">
                    <div className="px-4 w-1/3">
                      <Input name={`name`} label={`Name`} formik={{ getFieldProps }} />
                    </div>
                    <div className="px-4 w-1/3">
                      <Select
                        name={`type`}
                        label="Goal Type"
                        options={[
                          { value: 'decisionMaking', label: 'Decision Making' },
                          { value: 'awareness', label: 'Awareness' },
                          { value: 'motivationalLearning', label: 'Motivational Learning' },
                          { value: 'other', label: 'Other' },
                        ]}
                        formik={{ getFieldProps }}
                      />
                    </div>
                    <div className="px-4 w-1/3">
                      <Select
                        name={`purpose`}
                        label="Goal Purpose"
                        options={[
                          { value: 'strategic', label: 'Strategic' },
                          { value: 'operational', label: 'Operational' },
                          { value: 'organizational', label: 'Organizational' },
                          { value: 'learning', label: 'Learning' },
                        ]}
                        formik={{ getFieldProps }}
                      />
                    </div>
                  </div>

                  <hr className="mt-2 mb-4" />

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
                                        <div className="px-4 w-1/5">{index}</div>
                                        <div className="px-4 w-2/5">
                                          <Input
                                            name={`fields.${index}.name`}
                                            label={`Name`}
                                            formik={{ getFieldProps }}
                                            disabled
                                          />
                                        </div>
                                        <div className="px-4 w-2/5">
                                          <Select
                                            name={`fields.${index}.role`}
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
