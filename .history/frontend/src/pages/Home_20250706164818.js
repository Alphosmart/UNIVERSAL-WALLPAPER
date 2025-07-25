import React, { useEffect, useState } from 'react'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  const [products, setProducts] = useState([])

  const fetchProducts = async() => {
    try {
      const response = await fetch('/api/get-product')
      const data = await response.json()
      
      if(data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.log('Error fetching products:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div>
      <BannerProduct />
      
      <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpods"} />
      <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"} />

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