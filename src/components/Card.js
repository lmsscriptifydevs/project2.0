import React, { memo, useCallback, useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import DefaultImage from '../assets/default.webp';

/** PERF: memo reduces re-renders when parent updates but card props unchanged (e.g. gig lists). */
const Card = memo(function Card(props) {
  const [imgSrc, setImgSrc] = useState(props.gigsImg);
  const [error, setError] = useState(false);

  // Sync with backend image when prop changes (e.g. gig data loads)
  useEffect(() => {
    if (props.gigsImg) {
      setImgSrc(props.gigsImg);
      setError(false);
    }
  }, [props.gigsImg]);

  const handleImageError = useCallback(() => {
    setError((prev) => {
      if (!prev) {
        setImgSrc(DefaultImage);
        return true;
      }
      return prev;
    });
  }, []);
    return (
        <>
            <div className='p-3 whitcard h-100 d-flex flex-column justify-content-between'>
                <div>

                    <img style={{width:'100%'}} src={imgSrc} onError={handleImageError} height={150} alt="Media File" loading="lazy" decoding="async" />
                    <div className="d-flex mt-3 justify-content-between ">

                        <h5 className=' fw-semibold font-20 poppins' style={{ minHeight: props.minHeight }}>{props.heading}</h5>
                        <div>
                            {props.arrow}
                        </div>
                    </div>
                    <p className='poppins font-12' style={{ color: '#667085' }}>{props.phara}</p>
                </div>
                <div>

                    <div className='d-flex align-tems-center'>
                        <div className='d-flex align-tems-center'>

                            <FaStar color={props.star1} />
                            <FaStar color={props.star2} className='mx-1' />
                            <FaStar color={props.star3} />
                            <FaStar color={props.star4} className='mx-1' />
                            <FaStar color={props.star5} />

                        </div>
                        <p className='inter font-14 mb-0 ms-2' style={{ color: '#667085' }}>({props.projectNumber})</p>
                    </div>
                    <div className='text-end mb-2 mt-2'>
                        <h6 className='colororing font-16 inter fw-semibold'>{props.price}</h6>
                    </div>
                </div>
            </div>
        </>
    );
});

export default Card;
