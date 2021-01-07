import { UserDisability, UserVisLiteracy } from '@junoapp/common';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';

import { Input } from '../components/form/Input';
import { Select } from '../components/form/Select';
import { Card } from '../components/ui/Card';
import { save } from '../services/user.service';

export function UserAdd(): JSX.Element {
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      name: '',
      disability: '',
      visLiteracy: '',
    },
    onSubmit: (values) => {
      save({
        name: values.name,
        disability: (values.disability || null) as UserDisability,
        visLiteracy: values.visLiteracy as UserVisLiteracy,
      }).then((user) => {
        history.replace('/');
      });
    },
  });

  return (
    <div className="relative">
      <Card className="min-h" title="Add new user">
        <form className="w-full max-w-lg" onSubmit={formik.handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <Input name="name" label="Name" placeholder="name" formik={formik} />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <Select
                name="disability"
                label="Disability"
                options={[{ value: 'colorBlind', label: 'Color blind' }]}
                formik={formik}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <Select
                name="visLiteracy"
                label="Vis Literacy"
                options={[
                  { value: 'LOW', label: 'Low' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HIGH', label: 'High' },
                ]}
                formik={formik}
              />
            </div>
          </div>

          <button type="submit" className="button">
            Save
          </button>
        </form>
      </Card>
    </div>
  );
}
