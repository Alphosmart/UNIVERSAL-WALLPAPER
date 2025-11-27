import React from 'react'
import { useSelector } from 'react-redux'
// import BannerProduct from '../components/BannerProduct.jsx'
// import HorizontalCardProduct from '../components/HorizontalCardProduct.jsx'
import VerticalCardProduct from '../components/VerticalCardProduct.jsx'
import BackendStatus from '../components/BackendStatus'
import useSiteContent from '../hooks/useSiteContent'
import { Link } from 'react-router-dom'

const Home = () => {
  console.log('🔍 Home component: Rendering at', new Date().toISOString());
  
  const user = useSelector(state => state?.user?.user)
  const { content: siteContent } = useSiteContent()

  console.log('🔍 Home component: User state:', user?.name || 'Not logged in');
  console.log('🔍 Home component: Site content loading...');

  // Default content fallback
  const heroContent = siteContent?.homePage?.hero || {
    title: "Transform Your Space with Premium Wallpapers",
    subtitle: "Discover thousands of high-quality wallpapers from trusted sellers worldwide. From modern minimalist to classic elegant designs.",
    primaryButtonText: "Shop Now",
    primaryButtonLink: "/products",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "/about-us"
  }

  return (
    <div>
      <BackendStatus />
      
      <p className="text-center p-4 text-red-600 font-bold">🔍 DEBUG: Home component is rendering successfully!</p>
      
      {/* Dynamic Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {heroContent.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={heroContent.primaryButtonLink} 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              {heroContent.primaryButtonText}
            </Link>
            <Link 
              to={heroContent.secondaryButtonLink} 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              {heroContent.secondaryButtonText}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Temporarily commenting out product components to debug */}
      {/* <BannerProduct /> */}
      
      <p className="text-center p-4 text-blue-600 font-bold">🔍 DEBUG: About to load VerticalCardProduct...</p>
      
      {/* Show all products from our company */}
      <VerticalCardProduct category={"all"} heading={"All Interior Decoration Products"} />
      
      {/* Commenting out other components temporarily 
      <HorizontalCardProduct category={"wallpapers"} heading={"Premium Wallpapers"} />
      <HorizontalCardProduct category={"wall-paint"} heading={"Quality Wall Paints"} />

      <VerticalCardProduct category={"decorative-panels"} heading={"Decorative Panels"} />
      <VerticalCardProduct category={"tiles"} heading={"Designer Tiles"} />
      <VerticalCardProduct category={"flooring"} heading={"Premium Flooring"} />
      <VerticalCardProduct category={"curtains"} heading={"Curtains & Drapes"} />
      <VerticalCardProduct category={"lighting"} heading={"Decorative Lighting"} />
      <VerticalCardProduct category={"mirrors"} heading={"Designer Mirrors"} />
      <VerticalCardProduct category={"brushes-rollers"} heading={"Painting Tools"} />
      <VerticalCardProduct category={"wood-stain"} heading={"Wood Stains & Finishes"} />
      */}
    </div>
  )
}

export default Home