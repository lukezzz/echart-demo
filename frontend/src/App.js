import React, { useContext } from 'react'

import Routes from './Routes';
import './App.module.less';
import { ConfigProvider } from 'antd';
import { LocaleContext } from './providers/config/Locale.provider'

const App = () => {

  const { locale } = useContext(LocaleContext)

  return (
    <ConfigProvider locale={locale}>
      <Routes />
    </ConfigProvider>
  );
}

export default App;
