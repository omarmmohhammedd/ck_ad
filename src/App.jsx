import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Main from './Main';

// export const serverRoute = 'http://localhost:8080'
export const serverRoute = "https://ck-s.onrender.com";
export const token = localStorage.getItem('token')
function App() {
  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route element={<Main/>} path='/'/>
          </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
