import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import routeData from './Routes.map'
import SecurityLayout from './layouts/SecurityLayout';


import {
  Home,
  Chart1
} from './pages';

const loadComponent = name => {
  console.log(name)
  switch (name) {
    case 'home':
      return <Home />
    case 'chart1':
      return <Chart1 />

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
