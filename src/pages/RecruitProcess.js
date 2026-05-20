import React from 'react'
import { FiSearch } from 'react-icons/fi'
import Recomend from '../components/Recomend'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
const RecruitProcess = () => {
  return (
    <>
  <Navbar FirstNav='none' />    
    <div className="container-fluid pt-5 p-5 poppins">
        <div className="row">
          <h6 className='byerLine font-28 font-500 cocon blackcolor'>Skill Test</h6>
          <div className="col-lg-5 col-md-5 col-12"></div>
          <div className="col-lg-3 col-md-3 col-12">
            <div className='bgcard rounded-3'>
              <select className="form-select border-0 " style={{ backgroundColor: 'transparent' }} aria-label="Default select example">
                <option selected></option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12 mt-lg-0 mt-md-3 mt-3">

            <div className="input-group mb-lg-0  mb-md-0 mb-2 bgcard rounded-3">
              <button className="border-0" style={{ backgroundColor: 'transparent' }} type="button" id><span><FiSearch /></span></button>
              <input type="text" className="form-control border-0" style={{ backgroundColor: 'transparent' }} placeholder="Search" aria-describedby />
            </div>
          </div>

        </div>
        <Recomend/>
        <div class="row justify-content-center pt-5">
          <div class="col-lg-6 col-md-6 col-sm-11 col-12">
            <div className='background p-4 rounded-3'>
              <h6>Web Designing</h6>
            <div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed haifwhitecolor" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    Adobe After Effects
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse "
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body ">
                    <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed haifwhitecolor mt-3" type="button"
                    data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false"
                    aria-controls="collapseTwo">
                    Adobe After Effects
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse"
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                  </div>
                </div>

              </div>
              <div class="accordion-item">
                <h2 class="accordion-header ">
                    <button class="accordion-button collapsed haifwhitecolor mt-3" type="button"
                      data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false"
                      aria-controls="collapseThree">
                      Adobe After Effects
                    </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse"
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                  </div>
                </div>

              </div>
            </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-11 col-12 mt-lg-0 mt-md-3 mt-3">
            <div className='background p-4 rounded-3'>
              <h6>Programing</h6>
            <div class="accordion " id="accordionEample">
              <div class="accor">
                <h2 class="accordion-header ">
                    <button class="accordion-button collapsed haifwhitecolor" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapsefour" aria-expanded="false"
                      aria-controls="collapsefour">
                      Adobe After Effects
                    </button>
                </h2>
                <div id="collapsefour" class="accordion-collapse collapse"
                  data-bs-parent="#accordionEample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                   
                  </div>
                 
                </div>
              </div>
              <div class="accor">
                <h2 class="accordion-header ">
                    <button class="accordion-button collapsed haifwhitecolor mt-3" type="button"
                      data-bs-toggle="collapse" data-bs-target="#collapsefiv" aria-expanded="false"
                      aria-controls="collapsefiv">
                 Adobe After Effects
                    </button>
                </h2>
                <div id="collapsefiv" class="accordion-collapse collapse" data-bs-parent="#accordionEample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                  </div>
                 
                </div>
              </div>
              <div class="accor">
                <h2 class="accordion-header ">
                    <button class="accordion-button collapsed haifwhitecolor mt-3" type="button"
                      data-bs-toggle="collapse" data-bs-target="#collapsesix" aria-expanded="false"
                      aria-controls="collapsesix">
                     Adobe After Effects
                    </button>
                </h2>
                <div id="collapsesix" class="accordion-collapse collapse" data-bs-parent="#accordionEample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-11 col-12 mt-lg-5 mt-md-3 mt-3">
            <div className='background p-4 rounded-3'>
              <h6>Graphic Designing</h6>
            <div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed haifwhitecolor" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    Adobe After Effects
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse "
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed haifwhitecolor mt-3" type="button"
                    data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false"
                    aria-controls="collapseTwo">
                    Adobe After Effects
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse"
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                  </div>
                </div>

              </div>
              <div class="accordion-item">
                <h2 class="accordion-header ">
                    <button class="accordion-button collapsed haifwhitecolor mt-3" type="button"
                      data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false"
                      aria-controls="collapseThree">
                      Adobe After Effects
                    </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse"
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                  </div>
                </div>

              </div>
            </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-11 col-12 mt-lg-5 mt-md-3 mt-3">
            <div className='background p-4 rounded-3'>
              <h6>Office Skills</h6>
            <div class="accordion " id="accordionEample">
              <div class="accor">
                <h2 class="accordion-header ">
                    <button class="accordion-button collapsed haifwhitecolor" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapsefour" aria-expanded="false"
                      aria-controls="collapsefour">
                      Adobe After Effects
                    </button>
                </h2>
                <div id="collapsefour" class="accordion-collapse collapse"
                  data-bs-parent="#accordionEample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                   
                  </div>
                 
                </div>
              </div>
              <div class="accor">
                <h2 class="accordion-header ">
                    <button class="accordion-button collapsed haifwhitecolor mt-3" type="button"
                      data-bs-toggle="collapse" data-bs-target="#collapsefiv" aria-expanded="false"
                      aria-controls="collapsefiv">
                 Adobe After Effects
                    </button>
                </h2>
                <div id="collapsefiv" class="accordion-collapse collapse" data-bs-parent="#accordionEample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                  </div>
                 
                </div>
              </div>
              <div class="accor">
                <h2 class="accordion-header ">
                    <button class="accordion-button collapsed haifwhitecolor mt-3" type="button"
                      data-bs-toggle="collapse" data-bs-target="#collapsesix" aria-expanded="false"
                      aria-controls="collapsesix">
                     Adobe After Effects
                    </button>
                </h2>
                <div id="collapsesix" class="accordion-collapse collapse" data-bs-parent="#accordionEample">
                  <div class="accordion-body ">
                  <Link to="/tack" className='text-black'>Business funding in which companies sell their unpaid invoices.</Link>
                  </div>
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

export default RecruitProcess
