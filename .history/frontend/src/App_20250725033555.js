import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useCallback, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import Loading from './components/Loading';

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const fetchUserDetails = useCallback(async() => {
    try {
      setLoading(true)
      const dataResponse = await fetch(SummaryApi.current_user.url,{
        method : SummaryApi.current_user.method,
        credentials : 'include'
      })

      const dataApi = await dataResponse.json()

      if(dataApi.success){
        dispatch(setUserDetails(dataApi.data))
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      // Don't show error for user details fetch as user might not be logged in
    } finally {
      setLoading(false)
    }
  },[dispatch])

  useEffect(()=>{
    /**user Details */
    fetchUserDetails()
  },[fetchUserDetails])

  if (loading) {
    return <Loading message="Initializing application..." />
  }

  return (
    <>
      <Context.Provider value={{
          fetchUserDetails
      }}>
        <ToastContainer 
          position='top-center'
        />
        
        <Header />
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;