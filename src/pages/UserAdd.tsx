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
      { type: 'LOW', label: 'Baixo' },
      { type: 'MEDIUM', label: 'Médio' },
      { type: 'HIGH', label: 'Alto' },
    ],
    'LOW'
  );

  const [colorBlind, ColorBlind] = useButtonGroup(
    [
      { type: 'false', label: 'Não tenho' },
      { type: 'true', label: 'Tenho' },
    ],
    'false'
  );

  const [dyslexic, Dyslexic] = useButtonGroup(
    [
      { type: 'false', label: 'Não tenho' },
      { type: 'true', label: 'Tenho' },
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
      <Card className="min-h" title="Adicionar usuário">
        <form className="w-full max-w-lg" onSubmit={formik.handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <Input
                name="name"
                label="Nome"
                placeholder="como gostaria de ser chamado"
                formik={formik}
              />
            </div>
          </div>
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

          <button type="submit" className="button">
            Salvar
          </button>
        </form>
      </Card>
    </div>
  );
}
