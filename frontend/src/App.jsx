import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import MaintenanceGuard from './components/MaintenanceGuard';
import SecurityProvider from './components/SecurityProvider';
import PageTracker from './components/PageTracker';
import RefreshDebugger from './components/RefreshDebugger';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useCallback, useState, useRef } from 'react';
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
  const userDetailsCachedRef = useRef(false)

  const fetchUserDetails = useCallback(async(retryCount = 0) => {
    // Skip if already cached and not explicitly requested
    if (userDetailsCachedRef.current && retryCount === 0) {
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
          userDetailsCachedRef.current = true
        } else {
          // User not logged in - this is normal
          userDetailsCachedRef.current = true
        }
      } else if (dataResponse.status === 401) {
        // 401 is expected when user is not authenticated - this is normal
        userDetailsCachedRef.current = true
      } else {
        // Handle other non-200 responses
        userDetailsCachedRef.current = true
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
      userDetailsCachedRef.current = true
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(()=>{
    /**user Details - only fetch once on app load */
    fetchUserDetails()
    
    // Failsafe: Don't let loading hang indefinitely
    const loadingTimeout = setTimeout(() => {
      if (!userDetailsCachedRef.current) {
        setLoading(false)
        userDetailsCachedRef.current = true
      }
    }, 20000) // Increased to 20 seconds to reduce false triggers
    
    return () => {
      clearTimeout(loadingTimeout);
    }
  },[fetchUserDetails]) // Now fetchUserDetails is stable

  // Create a refresh function for when login/logout occurs
  const refreshUserDetails = useCallback(async () => {
    userDetailsCachedRef.current = false
    setLoading(true)
    try {
      await fetchUserDetails(0) // Force fetch with retryCount 0
    } catch (error) {
      console.error('🔄 Error in refreshUserDetails:', error);
    } finally {
      setLoading(false)
    }
  }, [fetchUserDetails])

  // Create a truly silent refresh that only updates Redux without any loading states
  const silentRefreshUserDetails = useCallback(async () => {
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include'
      })
      
      if (dataResponse.status === 200) {
        const dataApi = await dataResponse.json()
        
        if (dataApi.success && dataApi.data) {
          dispatch(setUserDetails(dataApi.data))
          userDetailsCachedRef.current = true
          return dataApi.data
        } else {
          return null
        }
      } else if (dataResponse.status === 401) {
        dispatch(setUserDetails(null))
        return null
      } else {
        return null
      }
    } catch (error) {
      console.error('🔄 Error in silentRefreshUserDetails:', error);
      return null
    }
  }, [dispatch])

  if (loading) {
    return <Loading message="Setting up your marketplace experience..." />
  }

  return (
    <ErrorBoundary>
      <MaintenanceGuard>
        <SecurityProvider>
          <Context.Provider value={{
              fetchUserDetails,
              refreshUserDetails,
              silentRefreshUserDetails
          }}>
            <ProductProvider>
              <CartProvider>
                <RefreshDebugger />
                <PageTracker />
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
        </SecurityProvider>
      </MaintenanceGuard>
    </ErrorBoundary>
  );
}

export default App;