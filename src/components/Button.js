import React from 'react'
import{FcGoogle} from 'react-icons/fc'
const Button = (props) => {
  return (
    <div className="btn-pill-wrapper">
       <button type='button' className='btn-pill'><span className='google-img me-3'><FcGoogle/></span>{props.text} </button> 
    </div>
  )
}

export default Button
