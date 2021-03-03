import Routes from './Routes';
import './App.module.less';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';


function App() {
  return (
    <ConfigProvider locale={enUS}>
      <Routes />
    </ConfigProvider>
  );
}

export default App;
