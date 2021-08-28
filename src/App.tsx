import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { Home } from './pages/Home';
import { DatasetColumns } from './pages/DatasetColumns';
import { Dashboard } from './pages/Dashboard';
import { UserAdd } from './pages/UserAdd';
import { UserView } from './pages/UserView';
import { UploadFileForm } from './components/UploadFileForm';
import Header from './components/Header';
import { Preferences } from './pages/Preferences';
import { UserContext } from './contexts/user.context';
import { useContext } from 'react';

library.add(fas);

function App(): JSX.Element {
  const { disability } = useContext(UserContext);

  return (
    <div className={`App ${disability?.includes('dyslexic') ? 'dyslexic-font' : ''}`}>
      <BrowserRouter>
        <Header />
        <div>
          <div className="container mx-auto pt-4 mb-8">
            <Switch>
              <Route exact path="/user/add">
                <UserAdd />
              </Route>
              <Route exact path="/dataset/add">
                <UploadFileForm />
              </Route>
              <Route exact path="/dashboard/add/:id">
                <DatasetColumns action="add" />
              </Route>
              <Route exact path="/dashboard/:id/edit">
                <DatasetColumns action="edit" />
              </Route>
              <Route exact path="/dashboard/view/:id">
                <Dashboard />
              </Route>
              <Route exact path="/user/view/:id">
                <UserView />
              </Route>
              <Route exact path="/preferences">
                <Preferences />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
