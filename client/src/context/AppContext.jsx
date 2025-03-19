import { createContext, useState } from "react";

export const AppContent = createContext()

export const AppContextProvider = (props) =>{
    const backendUrl = import.meta.env.VITE_API_BASE_URL
    const[isLoggedin, setIsLoggedin] = useState(false)
    const[userData, setuserData] = useState(false)


    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setuserData

    }
    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}