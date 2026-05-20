import React from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

const Entercode = () => {
    return (
        <>
            <Navbar FirstNav='none' />           
            <div className="container pt-5 pb-5">
                <div className="row justify-content-center text-center">
                    <h3 className='font-36 font-500 cocon Refertextcolor'>
                        Claim Your 50 Bonus Bids!
                    </h3>
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className='boxshado rounded-3 p-lg-5 p-md-4 p-4 mt-5'>
                            <h6 className='font-16 font-500 inter thankstextcolor'>
                                Your friend has referred you to GrapeTask because they believe in your talent. Enter your details below to claim your bonus bids.
                            </h6>
                            <div className="input-group mb-3 mt-lg-4 mt-3">
                                <input type="text" className="form-control orderinput p-2 poppins" placeholder="First Name" />
                            </div>
                            <div className="input-group mb-3 mt-lg-4 mt-3">
                                <input type="email" className="form-control orderinput p-2 poppins" placeholder="Email" />
                            </div>
                            <div className="form-check colororing text-start">
                                <input className="form-check-input" type="checkbox" id="gridCheck" />
                                <label className="form-check-label colorgray text-start" htmlFor="gridCheck">
                                    I agree to <span className='font-16 font-600 poppins text-decoration-underline'>Terms & Conditions</span>
                                </label>
                            </div>
                            <Link to='/referl'>
                                <button type='button' className='btn-circl mt-3 rounded-1'>
                                    Continue
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Entercode;
