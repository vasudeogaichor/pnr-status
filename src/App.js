import './App.css';
import {PNRHome} from './home';
import  { LoginContainer } from './components/login'
import { Route, Router } from 'React';



function App() {
  return (
    <Router>
      <Route exact path='/login' element={< LoginContainer />}></Route>
    <div className="App">
      <PNRHome/>
    </div>
    </Router>
  );
}

export default App;
