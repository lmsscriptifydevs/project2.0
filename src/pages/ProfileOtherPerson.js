import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "../redux/store/store";
import { formatDistanceToNow, format } from "date-fns";
import { AiFillStar } from "react-icons/ai";
import { FaGlobe, FaGraduationCap, FaCertificate, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import Navbar from "../components/Navbar";
import emptyProfile from "../assets/emptyProfileModal.webp";
import { getUserGigs } from "../redux/slices/offersSlice";
import { UserRating } from "../redux/slices/ratingSlice";
import { titleToSlug } from "../utils/helpers";

function stripHtmlTags(html) {
  if (typeof html !== "string") return "";
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText || "";
}

const ProfileOtherPerson = () => {
  const location = useLocation();
  const { id: paramId } = useParams();
  const userId = location?.state?.userId || paramId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userGigs } = useSelector((state) => state.offers);
  const { userRatingDetain, userallRating } = useSelector((state) => state.rating);

  const handleGigClick = (gig) => {
    const slug = titleToSlug(gig.title || "gig");
    const sellerName = userGigs?.fname || "expert";
    navigate(`/g/${slug}/${sellerName}/${gig.id}`);
  };

  useEffect(() => {
    if (!userId) return;
    const fetchGigs = () => {
      dispatch(getUserGigs({ id: userId }));
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchGigs, { timeout: 500 });
    } else {
      setTimeout(fetchGigs, 0);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchRating = () => {
      dispatch(UserRating());
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchRating, { timeout: 500 });
    } else {
      setTimeout(fetchRating, 0);
    }
  }, [dispatch]);

  const {
    overallAverageRating,
    overallAverageFive,
    overallAverageFour,
    overallAverageThree,
  } = useMemo(() => {
    const arr = Array.isArray(userallRating) ? userallRating : [];
    const filterRating = arr.filter((v) => v != null && !isNaN(v));
    const sum = filterRating.reduce((acc, r) => acc + r, 0);
    const avg = filterRating.length ? (sum / filterRating.length).toFixed(1) : 0;
    const f5 = arr.filter((v) => v === 5);
    const f4 = arr.filter((v) => v === 4);
    const f3 = arr.filter((v) => v === 3);
    return {
      overallAverageRating: avg,
      overallAverageFive: arr.length ? ((f5.length / arr.length) * 100).toFixed(0) : 0,
      overallAverageFour: arr.length ? ((f4.length / arr.length) * 100).toFixed(0) : 0,
      overallAverageThree: arr.length ? ((f3.length / arr.length) * 100).toFixed(0) : 0,
    };
  }, [userallRating]);

  const memberSince = userGigs?.created_at ? format(new Date(userGigs.created_at), 'MMMM yyyy') : null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .dark-profile-wrapper {
          --main-bg: #020617;
          --card-bg: rgba(255, 255, 255, 0.02);
          --card-bg-active: rgba(255, 255, 255, 0.04);
          --primary-orange: #f0591f;
          --secondary-blue-blur: rgba(59, 130, 246, 0.05);
          --pure-white: #ffffff;
          --light-gray-hover: #d4d4d8;
          --medium-gray-title: #a1a1aa;
          --body-gray-text: #71717a;
          --dark-gray-number: #52525b;
          --light-border: rgba(255, 255, 255, 0.06);
          --medium-border: rgba(255, 255, 255, 0.07);
          --orange-border-active: rgba(240, 89, 31, 0.4);

          background-color: var(--main-bg);
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          color: var(--pure-white);
          padding-bottom: 60px;
        }

        .dp-cover {
          height: 250px;
          background: linear-gradient(135deg, rgba(240,89,31,0.2) 0%, rgba(59,130,246,0.1) 100%);
          border-bottom: 1px solid var(--medium-border);
          position: relative;
          overflow: hidden;
        }
        .dp-cover::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .dp-header-content {
          margin-top: -75px;
          position: relative;
          z-index: 10;
        }

        .dp-avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 4px solid var(--main-bg);
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          object-fit: cover;
          background-color: var(--main-bg);
        }

        .dp-card {
          background-color: var(--card-bg);
          border: 1px solid var(--medium-border);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }
        .dp-card:hover {
          border-color: var(--light-border);
          background-color: var(--card-bg-active);
        }

        .dp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: var(--card-bg-active);
          border: 1px solid var(--medium-border);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          color: var(--light-gray-hover);
        }

        .dp-section-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--pure-white);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dp-section-title::before {
          content: '';
          display: block;
          width: 4px;
          height: 20px;
          background-color: var(--primary-orange);
          border-radius: 4px;
        }

        .dp-skill-tag {
          background-color: var(--secondary-blue-blur);
          border: 1px solid var(--medium-border);
          color: var(--light-gray-hover);
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 400;
        }

        .dp-timeline-item {
          position: relative;
          padding-left: 20px;
          margin-bottom: 16px;
        }
        .dp-timeline-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--medium-gray-title);
        }
        .dp-timeline-item:last-child { margin-bottom: 0; }

        .dp-gig-card {
          background-color: var(--card-bg);
          border: 1px solid var(--medium-border);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .dp-gig-card:hover {
          transform: translateY(-5px);
          border-color: var(--orange-border-active);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .dp-gig-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-bottom: 1px solid var(--medium-border);
        }

        .dp-gig-content {
          padding: 16px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .dp-gig-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--pure-white);
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dp-gig-desc {
          font-size: 13px;
          color: var(--body-gray-text);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .dp-gig-footer {
          margin-top: auto;
          border-top: 1px solid var(--light-border);
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dp-review-card {
          border-bottom: 1px solid var(--light-border);
          padding: 20px 0;
        }
        .dp-review-card:last-child { border-bottom: none; }

        .dp-progress {
          height: 6px;
          background-color: var(--card-bg-active);
          border-radius: 4px;
          overflow: hidden;
        }
        .dp-progress-bar {
          background-color: var(--primary-orange);
          height: 100%;
        }

        .dp-btn {
          background-color: transparent;
          border: 1px solid var(--medium-border);
          color: var(--light-gray-hover);
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
        }
        .dp-btn:hover {
          background-color: var(--card-bg-active);
          border-color: var(--primary-orange);
          color: var(--pure-white);
        }

        @media (max-width: 768px) {
          .dp-cover { height: 140px; }
          .dp-header-content { margin-top: -50px; text-align: center; }
          .dp-avatar { width: 100px; height: 100px; }
          .dp-badges-wrapper { justify-content: center !important; }
        }
      `,
        }}
      />

      <Navbar FirstNav="none" />

      <div className="dark-profile-wrapper">
        <div className="dp-cover"></div>

        <div className="container dp-header-content mb-5">
          <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end text-center text-md-start">
            <img
              src={userGigs?.image || emptyProfile}
              alt={userGigs?.fname || 'Profile'}
              className="dp-avatar"
              onError={(e) => { e.target.src = emptyProfile; }}
            />
            <div className="ms-md-4 mt-3 mt-md-0 pb-md-2 flex-grow-1 w-100">
              <h1 className="fw-bold mb-1" style={{ fontSize: '28px' }}>
                {userGigs?.fname ? `${userGigs.fname} ${userGigs.lname || ''}` : "Professional Freelancer"}
              </h1>
              <p className="mb-3" style={{ color: 'var(--medium-gray-title)', fontSize: '16px' }}>
                {userGigs?.extra_details?.occupation || userGigs?.role || "Expert"} 
                {userGigs?.level && (
                  <span className="badge ms-2 fw-normal py-1 px-2" style={{ backgroundColor: 'var(--card-bg-active)', border: '1px solid var(--medium-border)', color: 'var(--light-gray-hover)' }}>
                    Level {userGigs.level}
                  </span>
                )}
              </p>
              
              <div className="d-flex flex-wrap dp-badges-wrapper justify-content-md-start gap-2">
                {userGigs?.country && (
                  <span className="dp-badge">
                    <FaMapMarkerAlt style={{ color: 'var(--body-gray-text)' }} /> {userGigs.country}
                  </span>
                )}
                {memberSince && (
                  <span className="dp-badge">
                    <MdOutlineWorkOutline style={{ color: 'var(--body-gray-text)' }} /> Member since {memberSince}
                  </span>
                )}
                {userGigs?.gigs?.length > 0 && (
                  <span className="dp-badge" style={{ borderColor: 'rgba(240, 89, 31, 0.3)', color: 'var(--pure-white)' }}>
                    {userGigs.gigs.length} Active Gigs
                  </span>
                )}
                {userGigs?.orders_in_queue !== undefined && userGigs.orders_in_queue > 0 && (
                  <span className="dp-badge" style={{ borderColor: 'var(--primary-orange)', color: 'var(--pure-white)', backgroundColor: 'rgba(240, 89, 31, 0.15)', fontWeight: '600' }}>
                    {userGigs.orders_in_queue} {userGigs.orders_in_queue === 1 ? "Order" : "Orders"} in Queue
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            {/* LEFT SIDEBAR */}
            <div className="col-lg-4 mb-4">
              
              {/* About Section */}
              {userGigs?.bio && (
                <div className="dp-card">
                  <h3 className="dp-section-title">About Me</h3>
                  <p className="mb-0 lh-lg" style={{ color: 'var(--light-gray-hover)', fontSize: '14px', textAlign: 'justify' }}>
                    {userGigs.bio}
                  </p>
                </div>
              )}

              {/* Skills Section */}
              <div className="dp-card">
                <h3 className="dp-section-title">Skills</h3>
                <div className="d-flex flex-wrap gap-2">
                  {userGigs?.skills?.length > 0 ? (
                    userGigs.skills.map((value, index) => (
                      <span className="dp-skill-tag" key={value.skill ?? index}>
                        {value.skill}
                      </span>
                    ))
                  ) : (
                    <p className="w-100 text-center py-3 rounded mb-0" style={{ color: 'var(--body-gray-text)', fontSize: '14px', border: '1px dashed var(--medium-border)' }}>
                      No skills listed yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Education Section */}
              <div className="dp-card">
                <h3 className="dp-section-title">Education</h3>
                <div>
                  {userGigs?.educations?.length > 0 ? (
                    userGigs.educations.map((edu, index) => (
                      <div className="dp-timeline-item" key={index}>
                        <h6 className="mb-1 fw-medium" style={{ color: 'var(--pure-white)', fontSize: '15px' }}>{edu.degree}</h6>
                        <p className="mb-0" style={{ color: 'var(--medium-gray-title)', fontSize: '13px' }}>
                          <FaGraduationCap className="me-1" style={{ color: 'var(--body-gray-text)' }} /> 
                          {edu.university} {edu.year ? `• ${edu.year}` : ''}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="w-100 text-center py-3 rounded mb-0" style={{ color: 'var(--body-gray-text)', fontSize: '14px', border: '1px dashed var(--medium-border)' }}>
                      No education details provided.
                    </p>
                  )}
                </div>
              </div>

              {/* Certifications Section */}
              <div className="dp-card">
                <h3 className="dp-section-title">Certifications</h3>
                <div>
                  {userGigs?.certifications?.length > 0 ? (
                    userGigs.certifications.map((cert, index) => (
                      <div className="dp-timeline-item" key={index}>
                        <h6 className="mb-1 fw-medium" style={{ color: 'var(--pure-white)', fontSize: '15px' }}>{cert.title}</h6>
                        <p className="mb-0" style={{ color: 'var(--medium-gray-title)', fontSize: '13px' }}>
                          <FaCertificate className="me-1" style={{ color: 'var(--body-gray-text)' }} /> 
                          {cert.provider} {cert.year ? `• ${cert.year}` : ''}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="w-100 text-center py-3 rounded mb-0" style={{ color: 'var(--body-gray-text)', fontSize: '14px', border: '1px dashed var(--medium-border)' }}>
                      No certifications added.
                    </p>
                  )}
                </div>
              </div>

              {/* Web Section */}
              {userGigs?.extra_details?.personal_website && (
                <div className="dp-card">
                  <h3 className="dp-section-title">On the Web</h3>
                  <a 
                    href={userGigs.extra_details.personal_website.startsWith('http') ? userGigs.extra_details.personal_website : `https://${userGigs.extra_details.personal_website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="dp-btn w-100"
                  >
                    <FaGlobe style={{ color: 'var(--body-gray-text)' }} /> Personal Website
                  </a>
                </div>
              )}
            </div>

            {/* RIGHT CONTENT AREA */}
            <div className="col-lg-8">
              
              {/* Portfolio Section */}
              {userGigs?.portfolios?.length > 0 && (
                <div className="mb-5">
                  <h2 className="fw-bold mb-4 ms-1" style={{ fontSize: '22px', color: 'var(--pure-white)' }}>Portfolio</h2>
                  <div className="row">
                    {userGigs.portfolios.map((portfolio, index) => (
                      <div className="col-md-6 mb-4" key={index}>
                        <div className="dp-card p-2 h-100 mb-0" style={{ borderRadius: '16px' }}>
                          <img 
                            src={portfolio.image || emptyProfile} 
                            alt={portfolio.title} 
                            className="w-100 rounded" 
                            style={{ height: '180px', objectFit: 'cover' }} 
                            onError={(e) => { e.target.src = emptyProfile; }}
                          />
                          <div className="pt-3 pb-1 px-2">
                            <h5 className="fw-medium mb-1 text-truncate" style={{ fontSize: '16px', color: 'var(--pure-white)' }}>{portfolio.title}</h5>
                            <p className="mb-0 text-truncate" style={{ fontSize: '13px', color: 'var(--body-gray-text)' }}>{portfolio.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Gigs Section */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4 ms-1" style={{ fontSize: '22px', color: 'var(--pure-white)' }}>Active Gigs</h2>
                <div className="row">
                  {userGigs?.gigs?.length > 0 ? (
                    userGigs.gigs.map((value, index) => {
                      const gigImage = value?.media ? (value.media.image1 || value.media.image2 || value.media.image3) : emptyProfile;
                      const gigPrice = value?.packages?.[0]?.total || value?.package?.[0]?.total || "0";

                      return (
                        <div className="col-md-6 mb-4" key={value.id ?? index}>
                          <div className="dp-gig-card" onClick={() => handleGigClick(value)}>
                            <img src={gigImage} alt={value.title} className="dp-gig-img" onError={(e) => { e.target.src = emptyProfile; }} />
                            <div className="dp-gig-content">
                              <h3 className="dp-gig-title">{value.title}</h3>
                              <p className="dp-gig-desc">{stripHtmlTags(value.description)}</p>
                              <div className="dp-gig-footer">
                                <div className="d-flex align-items-center gap-2">
                                  <div className="d-flex align-items-center gap-1">
                                    <AiFillStar size={16} color="var(--primary-orange)" />
                                    <span className="fw-medium" style={{ color: 'var(--pure-white)', fontSize: '14px' }}>
                                      {value.average_rating || "5.0"}
                                    </span>
                                  </div>
                                  {value.orders_in_queue !== undefined && value.orders_in_queue > 0 && (
                                    <span className="badge rounded-pill px-2 py-1 font-11 fw-semibold" style={{ backgroundColor: 'rgba(240, 89, 31, 0.15)', color: '#f0591f', border: '1px solid rgba(240, 89, 31, 0.3)' }}>
                                      {value.orders_in_queue} {value.orders_in_queue === 1 ? "Order" : "Orders"} in queue
                                    </span>
                                  )}
                                </div>
                                <div className="text-end">
                                  <span className="d-block" style={{ color: 'var(--body-gray-text)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Starting at</span>
                                  <span className="fw-bold" style={{ color: 'var(--pure-white)', fontSize: '18px' }}>{"$"}{gigPrice}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12">
                      <div className="dp-card text-center py-5">
                        <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', backgroundColor: 'var(--card-bg-active)' }}>
                          <MdOutlineWorkOutline size={34} style={{ color: 'var(--medium-gray-title)' }} />
                        </div>
                        <h4 className="fw-medium mb-2" style={{ color: 'var(--pure-white)', fontSize: '18px' }}>No Gigs Available</h4>
                        <p className="mb-0" style={{ color: 'var(--body-gray-text)', fontSize: '14px' }}>This user hasn't published any gigs yet.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              {userRatingDetain?.length > 0 && (
                <div className="dp-card">
                  <h2 className="fw-bold mb-4" style={{ fontSize: '22px', color: 'var(--pure-white)' }}>Reviews & Ratings</h2>
                  <div className="row align-items-center mb-5 p-4 rounded mx-0" style={{ backgroundColor: 'var(--card-bg-active)' }}>
                    <div className="col-md-4 text-center border-md-end mb-4 mb-md-0" style={{ borderColor: 'var(--medium-border) !important' }}>
                      <h3 className="fw-bold mb-0" style={{ fontSize: '42px', color: 'var(--pure-white)' }}>{overallAverageRating}</h3>
                      <div className="d-flex justify-content-center gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <AiFillStar key={i} size={22} color={overallAverageRating >= i ? "var(--primary-orange)" : "var(--medium-gray-title)"} />
                        ))}
                      </div>
                      <p className="mb-0" style={{ color: 'var(--body-gray-text)', fontSize: '13px' }}>Based on {userallRating?.length || 0} reviews</p>
                    </div>
                    <div className="col-md-8 px-md-4">
                      {[
                        { label: '5 Stars', pct: overallAverageFive },
                        { label: '4 Stars', pct: overallAverageFour },
                        { label: '3 Stars', pct: overallAverageThree }
                      ].map((item, idx) => (
                        <div className="d-flex align-items-center mb-3" key={idx}>
                          <span className="fw-medium" style={{ width: '60px', color: 'var(--medium-gray-title)', fontSize: '13px' }}>{item.label}</span>
                          <div className="dp-progress flex-grow-1 mx-3">
                            <div className="dp-progress-bar" style={{ width: `${item.pct}%` }}></div>
                          </div>
                          <span style={{ width: '35px', textAlign: 'right', color: 'var(--body-gray-text)', fontSize: '13px' }}>{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {userRatingDetain.map((value, index) => (
                      <div className="dp-review-card" key={value.id ?? index}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center">
                            <img
                              className="rounded-circle object-fit-cover"
                              style={{ border: '2px solid var(--medium-border)' }}
                              src={value.user?.image || emptyProfile}
                              width={48}
                              height={48}
                              alt="reviewer"
                              onError={(e) => { e.target.src = emptyProfile; }}
                            />
                            <div className="ms-3">
                              <h6 className="fw-medium mb-1" style={{ color: 'var(--pure-white)', fontSize: '15px' }}>{value.user?.fname || "User"}</h6>
                              <div className="d-flex align-items-center gap-2">
                                <div className="d-flex">
                                  {[1,2,3,4,5].map(i => (
                                    <AiFillStar key={i} size={14} color={value.rating >= i ? "var(--primary-orange)" : "var(--medium-gray-title)"} />
                                  ))}
                                </div>
                                <span style={{ color: 'var(--body-gray-text)', fontSize: '12px' }}>• {formatDistanceToNow(new Date(value.created_at), { addSuffix: true })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 mb-0" style={{ color: 'var(--light-gray-hover)', fontSize: '14px', lineHeight: '1.6' }}>
                          {value.comments}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileOtherPerson;
