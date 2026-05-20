import { Quote, Star, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const UpworkReviews = () => {
  const reviews = [
    {
      name: 'Client Review',
      text: 'GrapeTask exceeded our expectations. Found amazing talent quickly!',
      rating: 5,
      date: 'Jan 2024'
    },
    {
      name: 'Freelancer Review',
      text: 'Best platform for finding quality projects. Payment is always on time.',
      rating: 5,
      date: 'Dec 2023'
    },
    {
      name: 'Client Review',
      text: 'Professional freelancers and excellent customer support.',
      rating: 5,
      date: 'Nov 2023'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Platform Reviews</h1>
          <p className="lead mb-4">See what users are saying about GrapeTask</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {reviews.map((r, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {[...Array(r.rating)].map((_, j) => (
                        <Star key={j} className="text-warning" size={18} fill="currentColor" />
                      ))}
                    </div>
                    <Quote className="mb-3" size={24} style={{ color: '#f16437' }} />
                    <p className="mb-3 fst-italic">"{r.text}"</p>
                    <p className="text-muted small mb-0">{r.name} • {r.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Link to="/success-stories" className="btn btn-lg px-5" style={{ background: '#f16437', color: 'white', border: 'none' }}>
        Read More Reviews
      </Link>
      <Footer />
    </>
  );
};

export default UpworkReviews;
