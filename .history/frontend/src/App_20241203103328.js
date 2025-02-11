import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './routes/components/Header';
import Footer from './routes/components/Footer';
import Home from './routes/pages/Home';

function App() {
  return (
    <>
    <Header/>
    <main>
    <Home/>
    </main>
    <Footer/>
    </>
  );
}

export default App;
