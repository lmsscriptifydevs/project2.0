import { Button } from '@mui/material';
import React from 'react';
import { BiTime } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';
import { TfiReload } from 'react-icons/tfi';

const BasicPromo = () => {
    return (
        <>
            <div className="d-flex justify-content-end mb-3 " >

                <div className='rounded-3 p-3' style={{ width: '70%', backgroundColor: '#F5F5FF' }}>

                    <div className='d-flex justify-content-between poppins'>
                        <div><h6 className='font-16 fw-semibold' style={{ color: '#404145' }}>BASIC PROMO</h6></div>
                        <div><h6 className='graycolor font-16 fw-semibold' style={{ color: '#404145' }}>₹868</h6></div>
                    </div>
                    <div className='mt-3'>
                        <p className='font-14 inter takegraycolor'>Basic Package Only Laptop-scenes Includes, Background Music
                            Logo, and 720HD Video</p>
                    </div>
                    <div className='d-flex graycolor mt-2'>
                        <div className='ms-1 takegraycolor font-14 fw-semibold'><p><BiTime className='me-2' size={16} />4 Days Delivery</p></div>
                        <div className='ms-4 takegraycolor font-14 fw-semibold'><p><TfiReload className='me-2' size={16} />1 Revision</p></div>
                    </div>
                    <div className=''>
                        <p className='font-12 ' style={{ color: '#95979D' }}><FaCheck className='colororing me-3' /> 8 captions</p>
                        <p className='font-12 ' style={{ color: '#95979D' }}><FaCheck className='colororing me-3' /> 5 screenshots</p>
                        <p className='font-12 ' style={{ color: '#95979D' }}><FaCheck className=' me-3' color='#95979D' /> Screen recording</p>
                        <p className='font-12 ' style={{ color: '#95979D' }}><FaCheck className='colororing me-3' /> Add logo</p>
                        <p className='font-12 ' style={{ color: '#95979D' }}><FaCheck className=' me-3' color='#95979D' /> Dynamic transitions</p>
                        <p className='font-12 ' style={{ color: '#95979D' }}><FaCheck className='colororing me-3' /> 30 seconds running time</p>
                    </div>
                    <div>
                        <u className='font-12 m-2 ms-0 colororing cursor-pointer' data-bs-toggle="modal" data-bs-target="#Withdrawn">Withdrawn Offer</u>
                        <u className='font-12 m-2 colororing cursor-pointer' data-bs-toggle="modal" data-bs-target="#Reject">Reject Offer</u>
                    </div>
                    {/* -------modal---------- */}
                    <div>
                        <div className="modal fade " id="Withdrawn" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="WithdrawnLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content ">
                                    <div className="modal-header border-bottom-0">
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                    </div>
                                    <div className="modal-body pt-0 justify-content-center text-center">
                                        <div>
                                            {/* <img src={goodteck} className='' width={100} height={100} alt="w8" /> */}
                                        </div>
                                        <div className='mt-4 px-3'>
                                            <h3 className='font-28 blackcolor cocon'>Are you sure , you want to withdraw service offer?</h3>
                                            <p className='font-16 mb-0 poppins takegraycolor'>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.</p>
                                        </div>
                                    </div>
                                    <div className="container-fluid mb-4">

                                        <div className='row justify-content-center my-4'>
                                            <div className="col-7">

                                                <Button className='btn-stepper poppins px-3 w-100 font-16' data-bs-dismiss="modal">Withdrawal</Button>
                                            </div>
                                            <div className="col-7">
                                                <Button className='btn-stepper-border poppins w-100 px-3 mt-3 font-16' data-bs-dismiss="modal">Cancel</Button>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* -------modal---------- */}
                    <div>
                        <div className="modal fade " id="Reject" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="RejectLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content ">
                                    <div className="modal-header border-bottom-0">
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                    </div>
                                    <div className="modal-body pt-0 justify-content-center text-center">
                                        <div>
                                            {/* <img src={goodteck} className='' width={100} height={100} alt="w8" /> */}
                                        </div>
                                        <div className='mt-4 px-3'>
                                            <h3 className='font-28 blackcolor  cocon'>Oops!<br />Freelancer Decline your offer</h3>
                                            <p className='font-16 mb-0 poppins takegraycolor'>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.</p>
                                        </div>
                                    </div>
                                    <div className="container-fluid mb-4">

                                        <div className='row justify-content-center my-4'>
                                            <div className="col-7">

                                                <Button className='btn-stepper poppins px-3 w-100 font-16' data-bs-dismiss="modal">Talk with Freelancer</Button>
                                            </div>
                                            <div className="col-7">
                                                <Button className='btn-stepper-border poppins w-100 px-3 mt-3 font-16' data-bs-dismiss="modal">Send Offer again</Button>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <style>
                {

                    `
                    .modal {
                        --bs-modal-width: 500px !important;
                    }
                    `
                }
            </style>
        </>

    );
}

export default BasicPromo;
