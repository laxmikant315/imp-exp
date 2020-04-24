import React, { useEffect, useState } from 'react';
import { getSwingStocks } from '../context/service-s';
import StockContent from './StockContent';
const SwingStocks=()=>{

   const [stocks,setStocks]= useState([]);
   const [loading,setLoading]= useState(false);
    useEffect(()=>{
       
       
       async function asyncFunc(){
        setLoading(true)
       const stocks= await getSwingStocks()
       setStocks(stocks);
       setLoading(false)
       } 
       asyncFunc();

    },[])
return <div>

    {loading? <h1>Loading...</h1> :
    <>
    {
stocks && stocks.length>0 ? stocks.map(stock=>(<div>
<StockContent stockDetails={stock}/>
</div>)) :<h1>No Stock found</h1>
    }</>
}
    </div>

}
export default SwingStocks;