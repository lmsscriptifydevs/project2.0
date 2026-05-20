import React from 'react'
import Navbar from '../../components/Navbar'
import '../../style/paymentCard.scss'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Paymentcard = () => { 
    const navigate = useNavigate();
    return (
        <>
            <Navbar FirstNav='none' />
            <div className="container-fluid p-lg-5 p-md-4 p-3 pt-5">
                    <h6 className='font-30 font-500 cocon byerLine'>Add  a payout method</h6>
                <div class="row justify-content-center payment-cards mt-4">
                    <div className="col-lg-3 col-md-3 col-12 poppins">
                        <div class="nav flex-column nav-pills me-3 p-4 rounded-3  Paymentwhite h-100" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <button class="nav-link active d-flex align-items-center ps-0" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                                <div className='payment-span'>
                                    <div>

                                    </div>
                                </div>
                                <div className='ms-3 text-start'>

                                    <h6 className='mb-0 font-20'>Payment card</h6>
                                    <p className='mb-0 font-12 takegraycolor'>Visa, Mastercard</p>
                                </div>
                            </button>
                            <button class="nav-link ps-0 d-flex align-items-center" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                            <div className='payment-span'>
                                    <div>

                                    </div>
                                </div>
                                <div className='ms-3'>

                                    <h6 className='mb-0 font-20'>Paypal</h6>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-9 col-12 mt-lg-0 mt-0 mt-4">
                        <div class="tab-content Paymentwhite p-lg-4 p-md-4 p-sm-3 p-2 pb-5 rounded-3" id="v-pills-tabContent">
                            <div class="tab-pane fade show active pt-2 pb-2" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabindex="0">
                                {/* <div className="row">
                                    <h6 className='font-600 font-20 blackcolor poppins'>Payment Card</h6>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>CARD NUMBER</label>
                                        <div className='bgcard rounded-3 mt-1'>
                                            <input type="text" className="form-control orderinput border-0 p-2 poppins" style={{ backgroundColor: 'transparent' }} placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>SECURITY CODE</label>
                                        <div className='bgcard rounded-3 mt-1'>
                                            <select className="form-select font-16 border-0 p-2" style={{ backgroundColor: 'transparent' }} aria-label="Default select example">
                                                <option selected></option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>FIRST NAME</label>
                                        <div className='bgcard rounded-3 mt-1'>
                                            <input type="text" className="form-control orderinput border-0 border-0 p-2 poppins" style={{ backgroundColor: 'transparent' }} placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>LAST NAME</label>
                                        <div className='bgcard rounded-3 mt-1'>
                                            <input type="text" className="form-control orderinput border-0 p-2 poppins" style={{ backgroundColor: 'transparent' }} placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>EXPIRATION MONTH</label>
                                        <div className='bgcard rounded-3 mt-1'>

                                            <input type="text" className="form-control orderinput border-0 border-0 p-2 poppins" style={{ backgroundColor: 'transparent' }} placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>EXPIRATION YEAR</label>
                                        <div className='bgcard rounded-3 mt-1'>
                                            <input type="text" className="form-control orderinput border-0 p-2 poppins" style={{ backgroundColor: 'transparent' }} placeholder="" />
                                        </div>
                                    </div>
                                    <div className='mt-4 '>
                                    <Button className='btn-stepper poppins px-3  font-16' onClick={()=> navigate('/dopayout')}>Save</Button>
                                    </div>
                                </div> */}
                            </div>
                            <div class="tab-pane fade pt-2 pb-2" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabindex="0">
                                <div className="row">
                                    <h6 className='font-600 font-20 blackcolor poppins'>Payment Card</h6>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>Enter USERNAME</label>
                                        <div className='bgcard rounded-3 mt-1'>
                                            <input type="text" className="form-control orderinput border-0 border-0 p-2 poppins" style={{ backgroundColor: 'transparent' }} placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>ENTER EMAIL</label>
                                        <div className='bgcard rounded-3 mt-1'>
                                            <input type="text" className="form-control orderinput border-0 p-2 poppins" style={{ backgroundColor: 'transparent' }} placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>PASSWORD</label>
                                        <div className='bgcard rounded-3 mt-1'>
                                            <input type="text" className="form-control orderinput border-0 border-0 p-2 poppins" style={{ backgroundColor: 'transparent' }} placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-3">
                                        <label htmlFor="" className='font-16 poppins'>AMOUNT</label>
                                        <div className='bgcard rounded-3 mt-1'>
                                            <input type="text" className="form-control orderinput border-0 p-2 poppins" style={{ backgroundColor: 'transparent' }} placeholder="" />
                                        </div>
                                    </div>
                                    <div className='mt-4 '>
                                    <Button className='btn-stepper poppins px-3  font-16' onClick={()=> navigate('/dopayout')}>Save</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Paymentcard
