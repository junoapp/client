import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { Home } from './pages/Home';
import { DatasetColumns } from './pages/DatasetColumns';
import { Dashboard } from './pages/Dashboard';
import { UserAdd } from './pages/UserAdd';
import { UserView } from './pages/UserView';
import { UploadFileForm } from './components/UploadFileForm';

library.add(fas);

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <header className="bg-yellow-500 p-3 text-white text-lg font-bold">
            <Link to="/">Juno</Link>
          </header>

          <div className="container mx-auto pt-4 mb-8">
            <Switch>
              <Route exact path="/user/add">
                <UserAdd />
              </Route>
              <Route exact path="/dataset/add">
                <UploadFileForm />
              </Route>
              <Route exact path="/dashboard/add/:id">
                <DatasetColumns />
              </Route>
              <Route exact path="/dataset/:id/view">
                <Dashboard />
              </Route>
              <Route exact path="/user/:id">
                <UserView />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
      </BrowserRouter>

      {/* <div className="border h-12 border-red-600">Toolbar</div>

      <div className="flex flex-1">
        <div className="border w-1/6 h-10"></div>
        <div className="border flex-1 h-10"></div>
        <div className="border w-1/6 h-10"></div>
      </div> */}
    </div>
  );
}

export default App;
