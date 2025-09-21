import React from 'react'
import { useSelector } from 'react-redux'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import BackendStatus from '../components/BackendStatus'
// import ShippingPartnerBanner from '../components/ShippingPartnerBanner'

const Home = () => {
  const user = useSelector(state => state?.user?.user)

  return (
    <div>
      <BackendStatus />
      <BannerProduct />
      
      {/* Show all products from our company */}
      <VerticalCardProduct category={"all"} heading={"All Interior Decoration Products"} />
      
      <HorizontalCardProduct category={"wallpapers"} heading={"Premium Wallpapers"} />
      <HorizontalCardProduct category={"wall-paint"} heading={"Quality Wall Paints"} />

      {/* Shipping Partner Banner - Only show to non-shipping company users */}
      {/* {user?.role !== 'SHIPPING_COMPANY' && <ShippingPartnerBanner />} */}

      <VerticalCardProduct category={"decorative-panels"} heading={"Decorative Panels"} />
      <VerticalCardProduct category={"tiles"} heading={"Designer Tiles"} />
      <VerticalCardProduct category={"flooring"} heading={"Premium Flooring"} />
      <VerticalCardProduct category={"curtains"} heading={"Curtains & Drapes"} />
      <VerticalCardProduct category={"lighting"} heading={"Decorative Lighting"} />
      <VerticalCardProduct category={"mirrors"} heading={"Designer Mirrors"} />
      <VerticalCardProduct category={"brushes-rollers"} heading={"Painting Tools"} />
      <VerticalCardProduct category={"wood-stain"} heading={"Wood Stains & Finishes"} />
    </div>
  )
}

export default Home