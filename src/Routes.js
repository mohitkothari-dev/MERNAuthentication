import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Register from './MyComponents/Register';
import AuthContext from './context/AuthContext';
import { useContext } from 'react';
import Users from './MyComponents/Users';
import ResetPassword from './MyComponents/ResetPassword';

function Routes() {
    const { userLoggedIn } = useContext(AuthContext);
    console.log(userLoggedIn);
    
    return (
        <Router>
            <Switch>
        {userLoggedIn === true && (
            <>
            <Route path="/user">
              <Users></Users>
            </Route>
            </>
          )
        }
        
        {userLoggedIn === false && (
          <>
            <Route path="/reset-password">
                <ResetPassword></ResetPassword>
            </Route>
            <Route exact path="/">
              <Register></Register>
            </Route>
          </>
          )
        }
      </Switch>
    </Router>
    )
}

export default Routes
