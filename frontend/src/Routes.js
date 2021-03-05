import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import routeData from './data/routes'
import SecurityLayout from './layouts/SecurityLayout';


import {
  Home,
  LineChartContainer
} from './pages';

const loadComponent = name => {
  switch (name) {
    case 'home':
      return <Home />
    case 'line':
      return <LineChartContainer />

    default:
      return <Home />
  }
}

const Routes = () => {

  return (
    <Switch>
      {
        routeData.map(comp =>
          comp.sub.length === 0 ?
            <SecurityLayout
              component={() => loadComponent(comp.name)}
              authority={comp.authority}
              path={comp.path}
              key={comp.key}
            />
            :
            comp.sub.map(subComp =>
              <SecurityLayout
                component={() => loadComponent(subComp.name)}
                authority={subComp.authority}
                path={subComp.path}
                exact
                key={subComp.key}
              />
            )
        )
      }

    </Switch>

  );
};

export default Routes;
