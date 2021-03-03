import React, { memo } from 'react';
import { Dropdown, Menu } from 'antd';

import dark from 'antd/dist/dark-theme';
import light from 'antd/dist/compact-theme';
import antd from 'antd/dist/default-theme'

const ThemeMenu = () => {


  const onLight = async () => {
    await window.less.modifyVars(light);
  };
  const onDark = async () => {
    await window.less.modifyVars(dark);
  };
  const onDefault = async () => {
    await window.less.modifyVars(antd);
    await window.less.modifyVars({
      "@primary-color": "#1da57a",
      "@layout-header-background": "#fafafa",
      "@menu-bg": "#fafafa",
      "@layout-slider-background": "#f0f0f0",
      "@layout-body-background": "#ffffff",
      "@layout-trigger-background": "#7c7c7c"
    });
  };


  return (
    <Menu selectedKeys={[]}>
      <Menu.Item key="light" onClick={onLight}>
        light
          </Menu.Item>
      <Menu.Item key="dark" onClick={onDark}>
        dark
          </Menu.Item>
      <Menu.Item key="default" onClick={onDefault}>
        default
          </Menu.Item>
    </Menu>
  )
}

const Toolbar = () => {

  return (
    <Dropdown overlay={ThemeMenu} trigger={['click']}>
      <span className='avatar-dropdown'>
        <span className="avatar-username">theme</span>
      </span>
    </Dropdown>
  )
};

export default memo(Toolbar);