import React from 'react'
// import BannerProduct from '../components/BannerProduct.jsx'
// import HorizontalCardProduct from '../components/HorizontalCardProduct.jsx'
import VerticalCardProduct from '../components/VerticalCardProduct.jsx'
import BackendStatus from '../components/BackendStatus'
import useSiteContent from '../hooks/useSiteContent'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'

const Home = () => {
  const { content: siteContent } = useSiteContent()
  const { allProducts, loading: productsLoading } = useProducts()

  // Default content fallback
  const heroContent = siteContent?.homePage?.hero || {
    title: "Transform Your Space with Premium Wallpapers",
    subtitle: "Discover thousands of high-quality wallpapers from trusted sellers worldwide. From modern minimalist to classic elegant designs.",
    primaryButtonText: "Shop Now",
    primaryButtonLink: "/products",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "/about-us"
  }

  const featuredProductsContent = siteContent?.homePage?.featuredProducts || {
    title: 'Featured Products',
    productIds: []
  }

  const featuredProductIds = Array.isArray(featuredProductsContent.productIds)
    ? featuredProductsContent.productIds
    : []

  const featuredProducts = featuredProductIds
    .map((productId) => allProducts.find((product) => product._id === productId))
    .filter(Boolean)

  return (
    <div>
      <BackendStatus />
      
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
      
      {!productsLoading && featuredProductIds.length > 0 && (
        <div className="container mx-auto px-4 my-8">
          <h2 className="text-2xl font-semibold py-4">{featuredProductsContent.title || 'Featured Products'}</h2>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="h-44 bg-slate-100 p-3 flex items-center justify-center">
                    <img
                      src={product.productImage?.[0]}
                      alt={product.productName}
                      className="max-h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{product.productName}</h3>
                    <p className="text-sm text-gray-500 capitalize line-clamp-1">{product.category}</p>
                    <p className="text-red-600 font-semibold mt-2">
                      {product.displayPricing?.formatted?.sellingPrice || `$${Number(product.sellingPrice || 0).toLocaleString('en-US')}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Selected featured product IDs are not available in current product list.</p>
          )}
        </div>
      )}
      
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