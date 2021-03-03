import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import SecurityLayout from './layouts/SecurityLayout';


import {
  Home,

} from './pages';

const Routes = () => {

  return (
    <Switch>
      <SecurityLayout
        component={Home}
        exact
        authority={['']}
        path="/home"
      />
    </Switch>

  );
};

export default Routes;
