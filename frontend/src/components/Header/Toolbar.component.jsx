import React, { memo, useContext } from 'react';
import { Dropdown, Menu, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons'

import dark from 'antd/dist/dark-theme';
import light from 'antd/dist/compact-theme';

import i18n from '../../translations/i18n'
import { useTranslation } from 'react-i18next';

import { LocaleContext } from '../../providers/config/Locale.provider'

import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';

const ThemeMenu = () => {


  const onLight = async () => {
    await window.less.modifyVars(light);
    await window.less.modifyVars({
      '@layout-header-background': '#fafafa',
      '@layout-slider-background': '#f0f0f0',
      '@menu-bg': '@component-background',
      '@btn-primary-bg': '@primary-color',
      '@checkbox-color': '@primary-color',
    })
  };
  const onDark = async () => {
    await window.less.modifyVars(dark);
  };


  return (
    <Menu selectedKeys={[]}>
      <Menu.Item key="light" onClick={onLight}>light</Menu.Item>
      <Menu.Item key="dark" onClick={onDark}>dark</Menu.Item>
    </Menu>
  )
}





const Toolbar = () => {

  const { t } = useTranslation();

  const { changeLocale } = useContext(LocaleContext)

  const changeLan = e => {
    i18n.changeLanguage(e.key)
    switch (e.key) {
      case 'en':
        changeLocale(enUS)
        break;

      default:
        changeLocale(zhCN)
        break;
    }
  }


  const LangMenu = () => {


    return (
      <Menu selectedKeys={[]} onClick={changeLan}>
        <Menu.Item key="en">English</Menu.Item>
        <Menu.Item key="zh">中文</Menu.Item>
      </Menu>
    )
  }

  return (
    <Space>
      <Dropdown overlay={LangMenu()} trigger={['click']}>
        <Button>{t("language")} <DownOutlined /></Button>
      </Dropdown>
      <Dropdown overlay={ThemeMenu} trigger={['click']}>
        <Button>{t("theme")} <DownOutlined /></Button>
      </Dropdown>
    </Space>
  )
};


export default memo(Toolbar);