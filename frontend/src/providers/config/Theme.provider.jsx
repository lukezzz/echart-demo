import React, { createContext, useState } from 'react'
import enUS from 'antd/lib/locale/en_US';
import i18n from '../../translations/i18n'
import zhCN from 'antd/lib/locale/zh_CN';

export const ThemeContext = createContext({

    theme: 'light',
    changeTheme: () => { },

})



const ThemeProvider = ({ children }) => {


    const [theme, setTheme] = useState('light')

    const changeTheme = newTheme => {
        console.log(newTheme)
        setTheme(newTheme)
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                changeTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider