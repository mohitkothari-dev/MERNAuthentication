import axios from 'axios';
import { AuthContextProvider } from './context/AuthContext';
import Routes from './Routes';

axios.defaults.withCredentials = true;    //accept the cookies

function App() {

  return (
    <AuthContextProvider>
    <Routes></Routes>  
    </AuthContextProvider>  
    );
}

export default App;
