import React, { memo } from 'react';

const Grapetask = memo(function Grapetask(props) {
  return (
    <>
      <div className="container-fluid work-done-cards px-3 p-4">
        <div className='row d-flex justify-content-center'>
          <div className='text-center get-work-done'>
            <div className='d-flex justify-content-center'>
              <img className='w-50' src={props.imges} alt="Imge Not Found" loading="lazy" decoding="async" />
            </div>
            <div className='text-center'>

              <h6 className='mt-3 fw-semibold'>{props.heading}</h6>
              <p className='font-16 mb-0' style={{ color: 'rgba(102, 112, 133, 1)' }}>{props.para}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Grapetask;
