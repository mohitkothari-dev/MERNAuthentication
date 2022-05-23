import axios from 'axios'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Users.css';

function Users() {

    const {getLoggedIn} = useContext(AuthContext);

    const history = useHistory();

    async function logOut() {
        await axios.get("http://localhost:3333/auth/logout");
        //await axios.get("https://mern-auth-backend-api.herokuapp.com/auth/logout");
        await getLoggedIn();
        history.push("/");
    }
    return (
        <div className="user">
            <h3>Hello, World!</h3>
            <button onClick={logOut}>Log Out</button>
        </div>
    )
}

export default Users
