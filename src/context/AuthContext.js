import React, {createContext, useEffect, useState} from 'react'
import axios from 'axios';

const AuthContext = createContext();

function AuthContextProvider(props) {
    const [userLoggedIn, setuserLoggedIn] = useState(undefined);

    async function getLoggedIn() {
        const userLoggedInRes = await axios.get("http://localhost:3333/auth/userloggedin");
        //const userLoggedInRes = await axios.get("https://mern-auth-backend-api.herokuapp.com/auth/userloggedin");
        setuserLoggedIn(userLoggedInRes.data);
    }

    useEffect(() => {
        getLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{userLoggedIn, getLoggedIn}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export { AuthContextProvider };