import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { MainLayout } from './layouts//MainLayout'


const SecurityLayout = props => {
  const { component: Component, authority: Authority, ...rest } = props;


  return (
    <Route
      {...rest}
      render={matchProps => (
        <MainLayout>
          <Component {...matchProps} />
        </MainLayout>
      )}
    />
  );
};

SecurityLayout.propTypes = {
  component: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default SecurityLayout;
