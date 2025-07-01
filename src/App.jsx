import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ClientRoutes from './routes/ClientRoutes';
import AdminRoutes from './routes/AdminRoutes';
import Navbar from './components/navbar';

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
        <Routes>
          <Route path='/*' element={<ClientRoutes/>}/>
          <Route path='/admin/*' element={<AdminRoutes/>}/>

        </Routes>
      </BrowserRouter>
  );
}

export default App;
