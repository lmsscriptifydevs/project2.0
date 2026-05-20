import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import loptop from "../assets/laptop.webp";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { fetchBlogs } from "../redux/slices/blogSlice";

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { list: blogs, isLoading, error } = useSelector((state) => state.blogs);
  const [blog, setBlog] = useState(null);

  // PERF STARTUP: Defer API calls until after first paint - UI renders first, data loads in background
  useEffect(() => {
    if (!blogs.length) {
      const fetchBlogsData = () => {
        dispatch(fetchBlogs());
      };
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(fetchBlogsData, { timeout: 500 });
      } else {
        setTimeout(fetchBlogsData, 0);
      }
    }
  }, [dispatch, blogs.length]);

  useEffect(() => {
    if (blogs.length) {
      const found = blogs.find((b) => b.id.toString() === id);
      setBlog(found || null);
    }
  }, [blogs, id]);

  if (isLoading || !blog) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          {isLoading ? <p>Loading blog...</p> : <p>Blog not found.</p>}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-5 poppins">
        <div className="mb-4">
          <Link to="/blog" className="btn btn-outline-secondary">← Back to Blogs</Link>
        </div>

        <img
          src={blog.imageUrl || loptop}
          alt={blog.title ?? ""}
          className="w-100 rounded-4 mb-4"
          decoding="async"
        />

        <p className="colororing font-16">
          {blog.category} | {new Date(blog.created_at).toLocaleDateString()}
        </p>
        <hr style={{ opacity: 1, backgroundColor: "#3A4553" }} />

        <h2 className="font-32 font-600">{blog.title}</h2>
        <p className="font-18 mt-3 takegraycolor">{blog.excerpt}</p>

        <div className="mt-4" dangerouslySetInnerHTML={{ __html: blog.content }} />

        <div className="mt-5">
          <Link to="/blog" className="colororing font-16">
            ← Back to Blog List
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;
