import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import MaintenanceGuard from './components/MaintenanceGuard';
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

// Debug logging
console.log('🔍 App.jsx loaded at:', new Date().toISOString());

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const userDetailsCachedRef = useRef(false)

  console.log('🔍 App component rendered. Loading:', loading, 'UserCached:', userDetailsCachedRef.current);

  const fetchUserDetails = useCallback(async(retryCount = 0) => {
    console.log('🔍 fetchUserDetails called. RetryCount:', retryCount, 'UserCached:', userDetailsCachedRef.current);
    
    // Skip if already cached and not explicitly requested
    if (userDetailsCachedRef.current && retryCount === 0) {
      console.log('🔍 Skipping fetch - already cached and no refresh requested');
      setLoading(false)
      return
    }

    try {
      console.log('🔍 Starting user details fetch...');
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
      console.log('🔍 User details response status:', dataResponse.status);

      if (dataResponse.ok) {
        const dataApi = await dataResponse.json()
        console.log('🔍 User details API response:', dataApi);
        
        if (dataApi.success) {
          console.log('🔍 Setting user details in Redux:', dataApi.data);
          dispatch(setUserDetails(dataApi.data))
          userDetailsCachedRef.current = true
        } else {
          console.log('🔍 User not logged in - this is normal');
          // User not logged in - this is normal
          userDetailsCachedRef.current = true
        }
      } else if (dataResponse.status === 401) {
        console.log('🔍 401 response - user not authenticated (normal)');
        // 401 is expected when user is not authenticated - this is normal
        userDetailsCachedRef.current = true
      } else {
        console.log('🔍 Non-200 response:', dataResponse.status);
        // Handle other non-200 responses
        userDetailsCachedRef.current = true
      }
    } catch (error) {
      console.log('🔍 Error in fetchUserDetails:', error);
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
    console.log('🔍 App useEffect triggered. This should only run once on mount');
    /**user Details - only fetch once on app load */
    fetchUserDetails()
    
    // Failsafe: Don't let loading hang indefinitely
    const loadingTimeout = setTimeout(() => {
      console.log('🔍 Loading timeout triggered - forcing completion');
      setLoading(false)
      userDetailsCachedRef.current = true
    }, 15000) // 15 second absolute maximum
    
    return () => {
      console.log('🔍 App useEffect cleanup');
      clearTimeout(loadingTimeout);
    }
  },[fetchUserDetails]) // Now fetchUserDetails is stable

  // Create a refresh function for when login/logout occurs
  const refreshUserDetails = useCallback(async () => {
    console.log('🔄 refreshUserDetails called - forcing refresh');
    userDetailsCachedRef.current = false
    setLoading(true)
    try {
      await fetchUserDetails(0) // Force fetch with retryCount 0
      console.log('🔄 User details refresh completed');
    } catch (error) {
      console.error('🔄 Error in refreshUserDetails:', error);
    } finally {
      setLoading(false)
    }
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