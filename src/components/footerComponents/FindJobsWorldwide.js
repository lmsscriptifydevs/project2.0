import { Globe, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const FindJobsWorldwide = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Find Freelance Jobs Worldwide</h1>
          <p className="lead mb-4">Browse international freelance job listings</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container text-center">
          <p className="lead mb-4">Connect with clients from around the world. Explore global opportunities.</p>
          <Link to="/freelance-jobs-worldwide" className="btn btn-lg px-5" style={{ background: '#f16437', color: 'white', border: 'none' }}>
            Browse Global Jobs
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FindJobsWorldwide;
