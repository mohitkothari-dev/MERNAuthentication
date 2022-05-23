import React, { useContext, useState } from 'react'
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import './Register.css';

function Register() {
    //to capture the values from the user
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [verifyPassword, setverifyPassword] = useState("");
    const [error, setErrors] = useState("");

    const {getLoggedIn} = useContext(AuthContext);      //using destructor
    const history = useHistory();

    //SignUp Url
    async function register (e) {
        e.preventDefault();
        try {
            const registerData = {
                email, password, verifyPassword,
            };
            await axios.post("http://localhost:3333/auth/", registerData);
            //await axios.post("https://mern-auth-backend-api.herokuapp.com/auth", registerData);
            await getLoggedIn();
            history.push("/user");
        } catch (error) {
            setErrors(error.response.data.errorMessage);
            setTimeout(() => {
                setErrors("");
            }, 5000);
        }
    }
    
    //SignIn Url
    async function login (e) {
        e.preventDefault();
        try {
            const loginData = {
                email, password,
            };
            await axios.post("http://localhost:3333/auth/login", loginData);
            //await axios.post("https://mern-auth-backend-api.herokuapp.com/auth/login", loginData);
            await getLoggedIn();
            history.push("/user");
        } catch (error) {
            setErrors(error.response.data.errorMessage);
            setTimeout(() => {
                setErrors("");
            }, 5000);
        }
    }

    const [isSignup, setIsSignup] = useState(false)

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }

    return (
        <div className="signup-wrap">
            <div className="signup-top">
            <h2>{isSignup ? 'Sign Up' : 'Sign In'}</h2>
            {error && <h5 className="error">{error}</h5>}
            <form onSubmit={isSignup ? register : login} >
                <div className="input-wrap">
                <input type="email" name="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} autoFocus/>
                </div>
                <div className="input-wrap">    
                <input type="password" name="pwd" id="pwd" placeholder="Password" onChange={(e) => setpassword(e.target.value)} value={password}/>
                </div>
                { isSignup && (
                    <div className="input-wrap">
                    <input type="password" name="pwdVerify" id="pwdVerify" placeholder="Verify password" onChange={(e) => setverifyPassword(e.target.value)} value={verifyPassword}/>
                    </div>
                ) }
                <div className="input-wrap">
                    {!isSignup ? 
                    <p>Forgot <span>Password?</span></p> :
                    <>
                    <input type="checkbox"/>
                    <p>Accept the <span>Terms and Conditions</span></p>
                    </>
                    }
                </div>
                <div className="input-wrap">
                <button type="submit">{isSignup ? 'Sign Up' : 'Sign In'}</button>
                <p onClick={switchMode}>
                    <span>{isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }</span>
                </p>
                </div>
            </form>
            </div>

            {/* Social Sign in */}
            <div className="signup-bottom">
                <h3>Or SignUp With</h3>
                <ul>
                <li><i className="fab fa-facebook-f"></i></li>
                <li><i className="fab fa-github"></i></li>
                <li><i className="fab fa-google-plus-g"></i></li>
                </ul>
            </div>
        </div>
    )
}

export default Register
