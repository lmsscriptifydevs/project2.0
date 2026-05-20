import { Calendar, Clock, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const Blog = () => {
  const blogPosts = [
    {
      title: '10 Tips for Freelancers to Increase Earnings',
      category: 'Freelancing',
      date: 'Jan 15, 2024',
      readTime: '5 min read',
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />
    },
    {
      title: 'How to Hire the Right Freelancer for Your Project',
      category: 'Hiring',
      date: 'Jan 10, 2024',
      readTime: '7 min read',
      icon: <FileText size={32} style={{ color: '#f16437' }} />
    },
    {
      title: 'Remote Work Trends in 2024',
      category: 'Trends',
      date: 'Jan 5, 2024',
      readTime: '6 min read',
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />
    },
    {
      title: 'Building a Successful Freelance Career',
      category: 'Career',
      date: 'Dec 28, 2023',
      readTime: '8 min read',
      icon: <FileText size={32} style={{ color: '#f16437' }} />
    }
  ];

  const categories = ['All', 'Freelancing', 'Hiring', 'Trends', 'Career', 'Tips'];

  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5 blog-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Blog</h1>
          <p className="lead mb-4">Read the latest articles and insights about freelancing and remote work</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold blog-title">Latest Articles</h2>
          <div className="row g-4">
            {blogPosts.map((post, i) => (
              <div key={i} className="col-lg-3 col-md-6 blog-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="mb-3 blog-icon">{post.icon}</div>
                    <span className="badge bg-light text-dark mb-2">{post.category}</span>
                    <h5 className="fw-bold mb-3">{post.title}</h5>
                    <div className="d-flex align-items-center text-muted small mb-3">
                      <Calendar size={14} className="me-2" />
                      <span className="me-3">{post.date}</span>
                      <Clock size={14} className="me-2" />
                      <span>{post.readTime}</span>
                    </div>
                    <Link to="/blog" className="text-decoration-none" style={{ color: '#f16437' }}>
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4 fw-bold">Browse by Category</h2>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {categories.map((cat, i) => (
              <button key={i} className="btn btn-sm category-btn" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <Link to="/blog" className="btn btn-lg px-5 btn-pulse" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            View All Articles
          </Link>
        </div>
      </section>
      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .blog-hero { animation: fadeIn 0.8s ease-out; }
        .blog-title { animation: fadeIn 0.8s ease-out; }
        .blog-card { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .blog-card:hover { transform: translateY(-10px); }
        .blog-icon { animation: float 2s ease-in-out infinite; }
        .blog-card:hover .blog-icon { animation: none; transform: scale(1.2); }
        .category-btn { transition: transform 0.3s; }
        .category-btn:hover { transform: scale(1.1); }
        .btn-pulse { animation: pulse 2s infinite; }
      `}</style>
    </>
  );
};

export default Blog;
