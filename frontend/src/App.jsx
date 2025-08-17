import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import MaintenanceGuard from './components/MaintenanceGuard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useCallback, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import Loading from './components/Loading';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [userDetailsCached, setUserDetailsCached] = useState(false)

  const fetchUserDetails = useCallback(async(retryCount = 0) => {
    // Skip if already cached and not explicitly requested
    if (userDetailsCached) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Add timeout for user details - longer timeout for initial load
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout for initial load
      
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      clearTimeout(timeoutId)

      if (dataResponse.ok) {
        const dataApi = await dataResponse.json()
        
        if (dataApi.success) {
          dispatch(setUserDetails(dataApi.data))
          setUserDetailsCached(true)
        } else {
          // User not logged in - this is normal
          setUserDetailsCached(true)
        }
      } else if (dataResponse.status === 401) {
        // 401 is expected when user is not authenticated - this is normal
        setUserDetailsCached(true)
      } else {
        // Handle other non-200 responses
        setUserDetailsCached(true)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // Retry once with shorter timeout if initial request times out
        if (retryCount === 0) {
          setTimeout(() => fetchUserDetails(1), 100)
          return
        }
      } else if (error.name !== 'TypeError') {
        // Don't log network errors when user is not authenticated
      }
      setUserDetailsCached(true)
    } finally {
      setLoading(false)
    }
  }, [dispatch, userDetailsCached])

  useEffect(()=>{
    /**user Details - only fetch once on app load */
    fetchUserDetails()
    
    // Failsafe: Don't let loading hang indefinitely
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
        setUserDetailsCached(true)
      }
    }, 15000) // 15 second absolute maximum
    
    return () => clearTimeout(loadingTimeout)
  },[fetchUserDetails, loading])

  // Create a refresh function for when login/logout occurs
  const refreshUserDetails = useCallback(() => {
    setUserDetailsCached(false)
    return fetchUserDetails()
  }, [fetchUserDetails])

  if (loading) {
    return <Loading message="Setting up your marketplace experience..." />
  }

  return (
    <ErrorBoundary>
      <MaintenanceGuard>
        <Context.Provider value={{
            fetchUserDetails,
            refreshUserDetails
        }}>
          <ProductProvider>
            <CartProvider>
              <ToastContainer 
                position='top-center'
              />
              
              <Header />
              <main className='min-h-[calc(100vh-120px)] pt-16'>
                <Outlet />
              </main>
              <Footer />
            </CartProvider>
          </ProductProvider>
        </Context.Provider>
      </MaintenanceGuard>
    </ErrorBoundary>
  );
}

export default App;