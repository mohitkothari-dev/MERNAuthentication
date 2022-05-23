import axios from 'axios';
import React, {useState} from 'react';
import './ResetPassword.css';

function ResetPassword() {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isReset, setIsReset] = useState(false);

    async function sendEmail(e){
        e.preventDefault();
        try{
            const resetData = { email };
            await axios.post("http://localhost:3333/auth/forgot-password", resetData);
            setIsReset(true);
        } catch (error) {
            setError(error.response.data.errorMessage);
            setTimeout(() => {
                setError("");
            }, 5000);
        }

    }

    return (
        <div className="signup-wrap">
            <div className="signup-top">
                <h2>{isReset ? 'Reset Password' : 'Forgot your password ?' }</h2>
                {error && <h5 className="error">{error}</h5>}
                <form onSubmit={sendEmail}>
                {!isReset && (
                <div className="input-wrap">
                    <input type="email" name="email" id="email" placeholder="Enter Registered Email" onChange={(e) => setEmail(e.target.value)} value={email} autoFocus/>
                </div>
                )}

                {isReset && (
                  <>
                <div className="input-wrap">
                    <input type="number" name="otp" id="otp" placeholder="Enter OTP" autoFocus/>
                </div>
                <div className="input-wrap">    
                    <input type="password" name="pwd" id="pwd" placeholder="Enter new Password"/>
                </div>
                <div className="input-wrap">
                    <input type="password" name="pwdVerify" id="pwdVerify" placeholder="Verify new Password"/>
                </div>
                  </>  
                ) }
                <div className="input-wrap">
                <button type="submit">{!isReset ? 'Send OTP' : 'Reset'}</button>
                </div>
                </form>
            </div>
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

export default ResetPassword
