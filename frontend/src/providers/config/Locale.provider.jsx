import React, { createContext, useState } from 'react'
import enUS from 'antd/lib/locale/en_US';
import i18n from '../../translations/i18n'
import zhCN from 'antd/lib/locale/zh_CN';

export const LocaleContext = createContext({

    locale: enUS,
    changeLocale: () => { },

})



const LocaleProvider = ({ children }) => {

    const setCurLanguage = () => {
        switch (i18n.language) {
            case 'en':
                return enUS

            default:
                return zhCN
        }
    }
    const [locale, setLocale] = useState(setCurLanguage())

    const changeLocale = newLocale => {
        console.log(newLocale)
        setLocale(newLocale)
    }

    return (
        <LocaleContext.Provider
            value={{
                locale,
                changeLocale,
            }}
        >
            {children}
        </LocaleContext.Provider>
    )
}

export default LocaleProvider