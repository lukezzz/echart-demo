import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import routeData from './Routes.map'
import SecurityLayout from './layouts/SecurityLayout';


import {
  Home,
} from './pages';

const loadComponent = name => {
  switch (name) {
    case 'home':
      return <Home />

    default:
      return <Home />
  }
}

const Routes = () => {

  return (
    <Switch>
      {
        routeData.map(comp =>
          <SecurityLayout
            component={() => loadComponent(comp.name)}
            authority={comp.authority}
            path={comp.path}
            key={comp.key}
          />
        )
      }

    </Switch>

  );
};

export default Routes;
