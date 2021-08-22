import { useState, useEffect, useContext } from 'react';
import { Formik, Form } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useHistory } from 'react-router-dom';

import { getById } from '../services/dataset.service';
import * as dashboardService from '../services/dashboard.service';
import { Loading } from '../components/ui/Loading';
import { Card } from '../components/ui/Card';
import { Input } from '../components/form/Input';
import { Select } from '../components/form/Select';
import { UploadInfoField } from '../models/upload-info';
import { DropdownOption } from '../models/dropdown-option';
import { DashboardGoal, DashboardPurpose, DatasetColumnRole } from '@junoapp/common';
import { UserContext } from '../contexts/user.context';
import { DatasetSchemaAggregateFunction } from '@junoapp/common';
import { capitalize } from '../utils/functions';

export function DatasetColumns({ action }: { action: 'add' | 'edit' }): JSX.Element {
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState<{
    name: string;
    type: string;
    purpose: string;
    fields: Array<UploadInfoField>;
  }>({ name: '', type: '', purpose: '', fields: [] });

  const [name, setName] = useState<string | undefined>(undefined);
  const [loadingCount, setLoadingCount] = useState(0);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { user } = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    if (action === 'add') {
      getById(+id).then((response) => {
        if (response.columns.length === 0) {
          setTimeout(() => {
            setLoadingCount(loadingCount + 1);
          }, 1000);
          return;
        }

        const formFields: UploadInfoField[] = [];
        const indexes: DropdownOption[] = [];

        response.columns.forEach((field, index) => {
          formFields.push({
            id: field.id,
            originalName: field.name,
            name: capitalize(field.name),
            role: field.role,
            index,
            removed: false,
            type: field.type,
            aggregate:
              field.role === DatasetColumnRole.MEASURE
                ? DatasetSchemaAggregateFunction.Sum
                : DatasetSchemaAggregateFunction.None,
          });

          indexes.push({
            label: index.toString(),
            value: index.toString(),
            isDisabled: false,
          });
        });

        setName(capitalize(response.originalname));
        setLoading(false);
        setValues({
          name: capitalize(response.originalname),
          type: '',
          purpose: '',
          fields: formFields,
        });
      });
    } else {
      dashboardService.getById(+id).then((response) => {
        const formFields: UploadInfoField[] = [];
        const indexes: DropdownOption[] = [];

        response.userDatasets[0].columns.forEach((field, index) => {
          formFields.push({
            id: field.id,
            originalName: field.column.name,
            name: field.name,
            role: field.role,
            index,
            removed: field.removed,
            type: field.column.type,
            aggregate: field.aggregate,
          });

          indexes.push({
            label: index.toString(),
            value: index.toString(),
            isDisabled: false,
          });
        });

        setName(response.name);
        setLoading(false);
        setValues({
          name: response.name,
          type: response.goalType,
          purpose: response.goalPurpose,
          fields: formFields,
        });
      });
    }
  }, [id, action, loadingCount]);

  const backToHome = () => {
    history.replace(`/user/view/${user}`);
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

                setLoading(true);
                if (action === 'add') {
                  await dashboardService.save({
                    datasetId: +id,
                    name: values.name,
                    user: +user,
                    goal: values.type as DashboardGoal,
                    purpose: values.purpose as DashboardPurpose,
                    colums: fields,
                  });
                } else {
                  await dashboardService.update({
                    id: +id,
                    name: values.name,
                    user: +user,
                    goal: values.type as DashboardGoal,
                    purpose: values.purpose as DashboardPurpose,
                    colums: fields,
                  });
                }
                backToHome();
              }}
            >
              {({ getFieldProps, values, setFieldValue }) => (
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
                          { value: 'DECISION_MAKING', label: 'Decision Making' },
                          { value: 'AWARENESS', label: 'Awareness' },
                          { value: 'MOTIVATIONAL_LEARNING', label: 'Motivational Learning' },
                          { value: 'OTHER', label: 'Other' },
                        ]}
                        formik={{ getFieldProps }}
                      />
                    </div>
                    <div className="px-4 w-1/3">
                      <Select
                        name={`purpose`}
                        label="Goal Purpose"
                        options={[
                          { value: 'STRATEGIC', label: 'Strategic' },
                          { value: 'OPERATIONAL', label: 'Operational' },
                          { value: 'ORGANIZATIONAL', label: 'Organizational' },
                          { value: 'LEARNING', label: 'Learning' },
                        ]}
                        formik={{ getFieldProps }}
                      />
                    </div>
                  </div>

                  <hr className="mt-2 mb-4" />

                  <div>
                    {values.fields.length > 0 &&
                      values.fields.map((item, index) => (
                        <div className="flex -mx-4 bg-white">
                          {/* <div className="px-4 flex items-center">
                            <FontAwesomeIcon icon="bars" />
                          </div> */}
                          <div className="px-4 w-2/5">
                            <Input
                              name={`fields.${index}.name`}
                              label={`Name`}
                              formik={{ getFieldProps }}
                            />
                          </div>
                          <div className="px-4 w-2/5">
                            <Input
                              name={`fields.${index}.type`}
                              label={`Type`}
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
                          <div className="px-4 w-2/5">
                            <Select
                              name={`fields.${index}.aggregate`}
                              label="Aggregate"
                              options={[
                                { value: 'NONE', label: 'None' },
                                { value: 'MIN', label: 'Min' },
                                { value: 'MEAN', label: 'Mean' },
                                { value: 'SUM', label: 'Sum' },
                                { value: 'BIN', label: 'Bin' },
                                { value: 'MAX', label: 'Max' },
                                { value: 'MEDIAN', label: 'Median' },
                              ]}
                              formik={{ getFieldProps }}
                              disabled={
                                values.fields[index].role === 'dimension' ||
                                values.fields[index].originalName === 'count'
                              }
                            />
                          </div>
                          <div className="px-4 flex items-center">
                            <button
                              type="button"
                              className={`button ${
                                item.removed ? 'button-success' : 'button-danger'
                              }`}
                              onClick={() =>
                                setFieldValue(
                                  `fields.${index}.removed`,
                                  !values.fields[index].removed
                                )
                              }
                            >
                              <FontAwesomeIcon icon={item.removed ? 'plus' : 'times'} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
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
