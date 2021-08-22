import { UserVisLiteracy } from '@junoapp/common';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';

import { Input } from '../components/form/Input';
import { Card } from '../components/ui/Card';
import { useButtonGroup } from '../hooks/useButtonGroup';
import { save } from '../services/user.service';

export function UserAdd(): JSX.Element {
  const history = useHistory();
  const [visLiteracy, VisLiteracy] = useButtonGroup(
    [
      { type: 'LOW', label: 'Low' },
      { type: 'MEDIUM', label: 'Medium' },
      { type: 'HIGH', label: 'High' },
    ],
    'LOW'
  );

  const [colorBlind, ColorBlind] = useButtonGroup(
    [
      { type: 'false', label: 'No' },
      { type: 'true', label: 'Yes' },
    ],
    'false'
  );

  const [dyslexic, Dyslexic] = useButtonGroup(
    [
      { type: 'false', label: 'No' },
      { type: 'true', label: 'Yes' },
    ],
    'false'
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      disability: '',
      visLiteracy: '',
    },
    onSubmit: (values) => {
      save({
        name: values.name,
        disability: [
          colorBlind === 'true' ? 'colorBlind' : false,
          dyslexic === 'true' ? 'dyslexic' : false,
        ]
          .filter(Boolean)
          .join(', '),
        visLiteracy: visLiteracy as UserVisLiteracy,
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
              <label className="label">Disability - Color blind</label>

              <ColorBlind />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="label">Disability - Dyslexic</label>

              <Dyslexic />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="label">Vis Literacy</label>

              <VisLiteracy />
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
