import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './routes/components/Header';

function App() {
  return (
    <>
    <Header/>
    <main>
      
    </main>
    <Outlet/>
    <Footer/>
    </>
  );
}

export default App;
