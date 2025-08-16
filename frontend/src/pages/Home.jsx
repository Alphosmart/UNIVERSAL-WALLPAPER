import React from 'react'
import { useSelector } from 'react-redux'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import BackendStatus from '../components/BackendStatus'
import ShippingPartnerBanner from '../components/ShippingPartnerBanner'

const Home = () => {
  const user = useSelector(state => state?.user?.user)

  return (
    <div>
      <BackendStatus />
      <BannerProduct />
      
      {/* Show all products from all sellers */}
      <VerticalCardProduct category={"all"} heading={"All Products from Our Sellers"} />
      
      <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpods"} />
      <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"} />

      {/* Shipping Partner Banner - Only show to non-shipping company users */}
      {user?.role !== 'SHIPPING_COMPANY' && <ShippingPartnerBanner />}

      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />
      <VerticalCardProduct category={"Mouse"} heading={"Mouse"} />
      <VerticalCardProduct category={"televisions"} heading={"Televisions"} />
      <VerticalCardProduct category={"camera"} heading={"Camera & Photography"} />
      <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"} />
      <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"} />
      <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"} />
      <VerticalCardProduct category={"trimmers"} heading={"Trimmers"} />
    </div>
  )
}

export default Home