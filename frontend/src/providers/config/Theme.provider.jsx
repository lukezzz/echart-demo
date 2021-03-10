import React, { createContext, useState } from 'react'


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