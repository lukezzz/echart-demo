import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import routeData from '../../data/routes'

const { SubMenu } = Menu;


export const HeaderMenu = () => {


    // active currrent menu


    return (

        <Menu
            mode="horizontal"
            theme='dark'
        // defaultSelectedKeys={['1']}
        // defaultOpenKeys={['2']}
        // tyle={{ lineHeight: '64px' }}
        // theme="dark"
        >
            {
                routeData.map(menu =>
                    menu.sub.length === 0 ?
                        <Menu.Item
                            key={menu.key}
                            icon={menu.icon}
                        >
                            {menu.title} < Link to={menu.path} />
                        </Menu.Item>
                        :
                        <SubMenu
                            key={menu.key}
                            icon={menu.icon}
                            title={menu.title}>
                            {
                                menu.sub.map(sub =>
                                    <Menu.Item
                                        key={sub.key}
                                        icon={sub.icon}>
                                        {sub.title} < Link to={sub.path} />
                                    </Menu.Item>
                                )
                            }

                        </SubMenu>
                )
            }
        </Menu>

    )
}
