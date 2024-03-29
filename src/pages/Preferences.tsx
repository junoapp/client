import { UserVisLiteracy } from '@junoapp/common';
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Checkbox } from '../components/form/Checkbox';
import { Input } from '../components/form/Input';
import { Select } from '../components/form/Select';
import { Card } from '../components/ui/Card';
import { UserContext } from '../contexts/user.context';
import { useButtonGroup } from '../hooks/useButtonGroup';
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

  const [visLiteracy, VisLiteracy, setVisLiteracy] = useButtonGroup(
    [
      { type: 'LOW', label: 'Baixo' },
      { type: 'MEDIUM', label: 'Médio' },
      { type: 'HIGH', label: 'Alto' },
    ],
    'LOW'
  );

  const [colorBlind, ColorBlind, setColorBlind] = useButtonGroup(
    [
      { type: 'false', label: 'Não tenho' },
      { type: 'true', label: 'Tenho' },
    ],
    'false'
  );

  const [dyslexic, Dyslexic, setDyslexic] = useButtonGroup(
    [
      { type: 'false', label: 'Não tenho' },
      { type: 'true', label: 'Tenho' },
    ],
    'false'
  );

  const formik = useFormik({
    initialValues: {
      stacked: true,
      multiline: true,
      rightAxis: true,
      binValues: 50,
      clampStrings: 30,
      chartTypes,
    },
    onSubmit: (values) => {
      savePreferences(+user, {
        ...values,
        disability: [
          colorBlind === 'true' ? 'colorBlind' : false,
          dyslexic === 'true' ? 'dyslexic' : false,
        ]
          .filter(Boolean)
          .join(', '),
        visLiteracy: visLiteracy as UserVisLiteracy,
      }).then(() => {
        backToHome();
      });
    },
  });

  useEffect(() => {
    getById(+user).then((userData) => {
      setVisLiteracy(userData.visLiteracy);
      setColorBlind(userData.disability.includes('colorBlind') ? 'true' : 'false');
      setDyslexic(userData.disability.includes('dyslexic') ? 'true' : 'false');

      if (userData['preferences']) {
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
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const backToHome = () => {
    history.replace(`/`);
  };

  return (
    <Card title="Preferences">
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="label">Deficiência - Daltonismo</label>

            <ColorBlind />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="label">Deficiência - Dislexia</label>

            <Dyslexic />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="label">Conhecimentos em visualização de dados</label>

            <VisLiteracy />
          </div>
        </div>

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
