import { Briefcase, MapPin, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const FindJobsUSA = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Find Freelance Jobs in the USA</h1>
          <p className="lead mb-4">Explore local freelance job opportunities in the USA</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container text-center">
          <p className="lead mb-4">Discover opportunities with US-based clients. Browse our job listings.</p>
          <Link to="/freelance-jobs-usa" className="btn btn-lg px-5" style={{ background: '#f16437', color: 'white', border: 'none' }}>
            Browse Jobs
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FindJobsUSA;
