import React, { memo } from 'react';
import { Dropdown, Menu, Button, Space, Switch } from 'antd';

import dark from 'antd/dist/dark-theme';
import light from 'antd/dist/compact-theme';

import i18n from '../../i18n'

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

const changeLan = checked => {
  if (checked) {
    i18n.changeLanguage('zh')
  } else {
    i18n.changeLanguage('en')
  }
}

const Toolbar = () => {

  return (
    <Space>
      <Switch
        checkedChildren="中文"
        unCheckedChildren="EN"
        defaultChecked={false}
        onChange={changeLan} />
      <Dropdown overlay={ThemeMenu} trigger={['click']}>
        <Button>Theme</Button>
      </Dropdown>
    </Space>
  )
};


export default memo(Toolbar);