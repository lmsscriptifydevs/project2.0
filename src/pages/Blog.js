// src/pages/Blog.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import busnis from "../assets/busnis.webp";
import img1 from "../assets/Client-logo1.webp";
import img2 from "../assets/Client-logo2.webp";
import img3 from "../assets/Client-logo3.webp";
import img4 from "../assets/Client-logo4.webp";
import img5 from "../assets/Client-logo5.webp";
import loptop from "../assets/laptop.webp";
import line from "../assets/line.webp";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { fetchBlogs } from "../redux/slices/blogSlice";

const BLOG_VIDEOS = ["video/Freelance9.mp4", "video/Freelance3.mp4", "video/Freelance8.mp4"];

const Blog = () => {
  const dispatch = useDispatch();
  const { list: blogs, isLoading, error } = useSelector((state) => state.blogs);

  // PERF STARTUP: Defer API calls until after first paint - UI renders first, data loads in background
  useEffect(() => {
    const fetchBlogsData = () => {
      dispatch(fetchBlogs());
    };
    
    // PERF: Defer API call until after first paint
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchBlogsData, { timeout: 500 });
    } else {
      setTimeout(fetchBlogsData, 0);
    }
    
    // Carousel auto-advance - defer slightly to ensure carousel is rendered
    const tick = () => document.querySelector('[data-bs-slide="next"]')?.click();
    let intervalId = null;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(tick, 5000);
    }, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [dispatch]);

  return (
    <>
      <Navbar SecondNav="none" />

      {/* Hero Video Section */}
      <div className="container-fluid blogVideoSection py-lg-0 py-md-0 py-5">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade w-100 h-100 d-lg-block d-md-block d-none"
          style={{
            objectFit: "cover",
            position: "absolute",
            zIndex: "-1",
            objectPosition: "center",
            height: "inherit",
          }}
        >
          <div className="carousel-inner h-100">
            {BLOG_VIDEOS.map((src, idx) => (
              <div
                key={src}
                className={`carousel-item ${idx === 0 ? "active" : ""} h-100`}
              >
                <div className="container-fluid p-0 poppins h-100">
                  <video
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload={idx === 0 ? "auto" : "metadata"}
                  >
                    <source src={src} type="video/mp4" />
                  </video>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev d-none" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next d-none" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <h1 className="text-center fw-semibold font-38 poppins">
          Freelance Marketplace Blog!<br />Insights, Tips & Trends from GrapeTask
        </h1>
      </div>

      {/* Blog Content */}
      <div className="container-fluid p-lg-5 p-md-5 p-sm-4 p-3 poppins">
        {isLoading ? (
          <p>Loading blogs...</p>
        ) : error ? (
          <p className="text-danger">Error loading blogs: {error}</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <> 
            {/* Featured Blog */}
            <div className="row mb-5">
              <div className="col-lg-6 col-md-6 col-12">
                <img
                  src={blogs[0].imageUrl || busnis}
                  className="w-100 rounded-4"
                  alt={blogs[0].title}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <p className="colororing font-16">
                  {blogs[0].category} | {new Date(blogs[0].created_at).toLocaleDateString()}
                </p>
                <hr style={{ opacity: 1, backgroundColor: "#3A4553" }} />
                <h4 className="font-28 font-600">{blogs[0].title}</h4>
                <p className="font-18 takegraycolor">{blogs[0].excerpt}</p>
                <Link to={`/blog/${blogs[0].id}`} className="colororing font-16">
                  Read More
                </Link>
              </div>
            </div>

            {/* Remaining Blogs Grid */}
            <div className="row justify-content-center">
              {blogs.slice(1).map((blog) => (
                <div key={blog.id} className="col-lg-4 col-md-6 col-12 mb-4">
                  <img
                    src={blog.imageUrl || loptop}
                    className="w-100 rounded-3"
                    alt={blog.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="mt-3 mb-3 d-flex justify-content-between colororing">
                    <p className="mb-0 font-16">
                      {blog.category} | {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <hr style={{ opacity: 1, backgroundColor: "#3A4553" }} />
                  <h6 className="font-20 font-600">{blog.title}</h6>
                  <p>{blog.excerpt}</p>
                  <Link to={`/blog/${blog.id}`} className="colororing font-16">
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Partners Section */}
      <div className="container-fluid p-lg-5 p-md-4 p-3 mt-lg-5 mt-md-4 mt-3 poppins">
        <h3 className="font-40 cocon font-500 text-center">Meet The Partners</h3>
        <div className="d-flex justify-content-center">
          <img src={line} className="text-center" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="row justify-content-around mt-4">
          {[img1, img2, img3, img4, img5].map((src) => (
            <div key={src} className="col-lg-2 col-md-4 col-sm-6 col-12 d-flex align-items-center justify-content-center mt-5">
              <img src={src} className="w-100" alt="" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Blog;
