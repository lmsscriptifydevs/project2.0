import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const FreeBusinessTools = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Free Business Tools</h1>
          <p className="lead mb-4">Access helpful tools to grow your business</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container text-center">
          <p className="lead mb-4">Our free business tools are available in the Business Tools section.</p>
          <Link to="/business-tools" className="btn btn-lg px-5" style={{ background: '#f16437', color: 'white', border: 'none' }}>
            View All Tools
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FreeBusinessTools;