import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { Home } from './pages/Home';
import { DatasetColumns } from './pages/DatasetColumns';

library.add(fas);

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <header className="bg-orange-500 p-3 text-white text-lg font-bold">
            <Link to="/">Juno</Link>
          </header>

          <div className="container mx-auto pt-4 mb-8">
            <Switch>
              <Route path="/dataset/:id">
                <DatasetColumns />
              </Route>
              <Route path="/">
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
