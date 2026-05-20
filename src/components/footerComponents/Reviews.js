import { Quote, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const Reviews = () => {
  const reviews = [
    {
      name: 'Sarah Johnson',
      role: 'Client',
      rating: 5,
      text: 'GrapeTask has transformed how we work. The quality of freelancers is outstanding!',
      project: 'Web Development',
      icon: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Freelancer',
      rating: 5,
      text: 'Best platform I\'ve used. Great clients and fair payment system.',
      project: 'Graphic Design',
      icon: '👨‍💼'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Client',
      rating: 5,
      text: 'Found the perfect team for our project. Highly recommend!',
      project: 'Marketing Campaign',
      icon: '👩‍💼'
    },
    {
      name: 'David Kim',
      role: 'Freelancer',
      rating: 5,
      text: 'Earned over $100K in my first year. This platform changed my life!',
      project: 'Software Development',
      icon: '👨‍💻'
    }
  ];

  const stats = [
    { number: '4.9/5', label: 'Average Rating' },
    { number: '500K+', label: 'Total Reviews' },
    { number: '98%', label: 'Positive Reviews' },
    { number: '99%', label: 'Would Recommend' }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5 reviews-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Reviews & Testimonials</h1>
          <p className="lead mb-4">See what our users say about GrapeTask</p>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, i) => (
              <div key={i} className="col-lg-3 col-md-6 stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-center p-4 bg-white rounded shadow-sm">
                  <h2 className="display-4 fw-bold mb-2" style={{ color: '#f16437' }}>{stat.number}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold reviews-title">What Users Say</h2>
          <div className="row g-4">
            {reviews.map((review, i) => (
              <div key={i} className="col-lg-3 col-md-6 review-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', fontSize: '24px', backgroundColor: '#f16437' }}>
                        {review.icon}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">{review.name}</h6>
                        <p className="text-muted small mb-0">{review.role}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="text-warning" size={18} fill="currentColor" />
                      ))}
                    </div>
                    <Quote className="mb-3" size={24} style={{ color: '#f16437' }} />
                    <p className="mb-3 fst-italic">"{review.text}"</p>
                    <p className="text-muted small mb-0">Project: {review.project}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <Link to="/signup" className="btn btn-lg px-5 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Join Our Community
          </Link>
        </div>
      </section>
      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .reviews-hero { animation: fadeIn 0.8s ease-out; }
        .reviews-title { animation: fadeIn 0.8s ease-out; }
        .stat-card { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        .review-card { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .review-card:hover { transform: translateY(-10px); }
        .btn-bounce { animation: bounce 2s infinite; }
      `}</style>
    </>
  );
};

export default Reviews;
