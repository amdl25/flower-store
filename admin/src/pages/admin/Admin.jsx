import React from 'react' 
import './Admin.css'
import Sidebar from '../../components/sidebar/Sidebar'
import {Routes, Route} from 'react-router-dom'
import AddProduct from '../../components/addProduct/AddProduct'
import ListProduct from '../../components/listProduct/ListProduct'
import AddFlower from '../../components/addFlower/AddFlower'
import ListFlower from '../../components/listFlower/ListFlower'
import AddOccasion from '../../components/addOccasion/AddOccasion'
import ListOccasion from '../../components/listOccasion/ListOccasion'
import AddPromoCode from '../../components/addPromoCode/AddPromoCode'
import ListPromoCode from '../../components/listPromoCode/ListPromoCode'
import AddMonthlyFlowerSubscription from '../../components/addMonthlyFlowerSubscription/AddMonthlyFlowerSubscription'
import ListMonthlyFlowerSubscription from '../../components/listMonthlyFlowerSubscription/ListMonthlyFlowerSubscription'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/listproduct' element={<ListProduct/>}/>
        <Route path='/addflower' element={<AddFlower/>}/>
        <Route path='/listflower' element={<ListFlower/>}/>
        <Route path='/addoccasion' element={<AddOccasion/>}/>
        <Route path='/listoccasion' element={<ListOccasion/>}/>
        <Route path='/addpromocode' element={<AddPromoCode/>}/>
        <Route path='/listpromocode' element={<ListPromoCode/>}/>
        <Route path='/addmonthlyflowersubscription' element={<AddMonthlyFlowerSubscription/>}/>
        <Route path='/listmonthlyflowersubscription' element={<ListMonthlyFlowerSubscription/>}/>
        
      </Routes>
    </div>
  )
}

export default Admin
