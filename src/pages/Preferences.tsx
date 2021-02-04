import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Checkbox } from '../components/form/Checkbox';
import { Input } from '../components/form/Input';
import { Select } from '../components/form/Select';
import { Card } from '../components/ui/Card';
import { UserContext } from '../contexts/user.context';
import { getById, savePreferences } from '../services/user.service';

const types = ['NUMBER', 'STRING', 'DATE'];
const chartTypes = [];

for (const typeX of types) {
  for (const typeY of types) {
    if (typeX !== typeY) {
      chartTypes.push({
        typeX,
        typeY,
        chart: 'AUTO',
      });
    }
  }
}

export function Preferences(): JSX.Element {
  const { user } = useContext(UserContext);
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      stacked: false,
      multiline: false,
      rightAxis: false,
      binValues: 50,
      clampStrings: 30,
      chartTypes,
    },
    onSubmit: (values) => {
      savePreferences(+user, values).then(() => {
        backToHome();
      });
    },
  });

  useEffect(() => {
    getById(+user).then((userData) => {
      console.log(userData);

      formik.setFieldValue('stacked', userData['preferences'].stacked);
      formik.setFieldValue('multiline', userData['preferences'].multiline);
      formik.setFieldValue('rightAxis', userData['preferences'].rightAxis);
      formik.setFieldValue('binValues', userData['preferences'].binValues);
      formik.setFieldValue('clampStrings', userData['preferences'].clampStrings);

      for (const typeX of types) {
        for (const typeY of types) {
          if (typeX !== typeY) {
            const index = userData['preferences'].chartTypes.findIndex(
              (chartType) => chartType.typeX === typeX && chartType.typeY === typeY
            );

            formik.setFieldValue(
              `chartTypes.${index}.chart`,
              userData['preferences'].chartTypes[index].chart
            );
          }
        }
      }
    });
  }, [user]);

  const backToHome = () => {
    history.replace(`/`);
  };

  return (
    <Card title="Preferences">
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <div className="font-bold">Based on chart types:</div>
        <hr className="my-2" />
        <Checkbox
          checked={formik.values.stacked}
          name="stacked"
          label="Stacked bars when possible"
          formik={formik}
        />

        <hr className="my-2" />
        <Checkbox
          checked={formik.values.multiline}
          name="multiline"
          label="Multiline charts"
          formik={formik}
        />

        <hr className="my-2" />
        <Checkbox
          checked={formik.values.rightAxis}
          name="rightAxis"
          label="Line charts with right axis"
          formik={formik}
        />

        <hr className="my-2" />
        <Input name="binValues" label="Bin quantitative columns higher than" formik={formik} />

        <hr className="my-2" />
        <Input
          name="clampStrings"
          label="Clamp string columns with more distinct values than"
          formik={formik}
        />

        <div className="font-bold">Based on chart types:</div>
        <hr className="my-2" />
        {chartTypes.map((_, index) => (
          <div className="flex -mx-4 mb-3" key={index}>
            <div className="px-4 w-1/3">
              <Input
                name={`chartTypes.${index}.typeX`}
                label="Type X"
                disabled={true}
                formik={formik}
              />
            </div>
            <div className="px-4 w-1/3">
              <Input
                name={`chartTypes.${index}.typeY`}
                label="Type Y"
                disabled={true}
                formik={formik}
              />
            </div>
            <div className="px-4 w-1/3">
              <Select
                name={`chartTypes.${index}.chart`}
                label="Chart Type"
                options={[
                  { value: 'AUTO', label: 'Auto' },
                  { value: 'LINE', label: 'Line' },
                  { value: 'BAR', label: 'Bar' },
                ]}
                formik={formik}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button type="button" className="button mr-2" onClick={backToHome}>
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            Submit
          </button>
        </div>
      </form>
    </Card>
  );
}
