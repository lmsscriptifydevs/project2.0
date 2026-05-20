import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "./Footer";
import Navbar from "./Navbar";

const Privacy = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 privacy-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-left">
              <h1 className="display-4 fw-bold mb-4">Privacy Policy</h1>
              <p className="lead mb-4">
                GrapeTask is committed to protecting the privacy and security of your personal information.
              </p>
              <p className="small opacity-75">Last updated: January 2024</p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 fade-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 icon-float">
                <Shield className="mb-3" size={80} />
                <h3 className="mb-0">Your Data Protected</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Introduction</h3>
                  <p className="text-muted">
                    GrapeTask is committed to protecting the privacy and security of your personal information. 
                    This Privacy Policy describes how we collect, use, and disclose your personal information 
                    when you visit our website www.grapetask.co (the "Site") and use our services.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Information We Collect</h3>
                  <p className="text-muted mb-3">We collect various types of information, including:</p>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">1</span>
                      <span className="text-muted">Personal information you provide when registering (name, email, etc.)</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">2</span>
                      <span className="text-muted">Payment and billing information for transactions</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">3</span>
                      <span className="text-muted">Usage data and browsing information</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">4</span>
                      <span className="text-muted">Communications between users on the platform</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>How We Use Your Information</h3>
                  <p className="text-muted mb-3">We may use the information collected for various purposes, including:</p>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">1</span>
                      <span className="text-muted">To provide, maintain, and improve our services.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">2</span>
                      <span className="text-muted">To personalize your experience on our Site.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">3</span>
                      <span className="text-muted">To communicate with you, including responding to your inquiries and providing updates about our services.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">4</span>
                      <span className="text-muted">To comply with legal obligations.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Information Sharing and Disclosure</h3>
                  <p className="text-muted">
                    We do not sell, trade, or otherwise transfer your personal information to outside parties. 
                    We may share your information with trusted third parties who assist us in operating our 
                    website or servicing you, so long as those parties agree to keep this information confidential.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Data Security</h3>
                  <p className="text-muted">
                    We take reasonable measures to protect the confidentiality and security of your personal 
                    information. We use industry-standard encryption and security protocols. However, no method 
                    of transmission over the internet or electronic storage is 100% secure.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Your Choices</h3>
                  <p className="text-muted">
                    You can choose not to provide certain information, but this may limit your ability to use 
                    certain features of our Site. You may opt-out of receiving promotional emails from us by 
                    following the instructions in those emails. You can also request access to, correction of, 
                    or deletion of your personal data by contacting us.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Cookies</h3>
                  <p className="text-muted mb-3">
                    We use cookies and similar tracking technologies to track activity on our Site and hold 
                    certain information. For more details, please see our Cookie Policy.
                  </p>
                  <Link to="/cookies" className="btn btn-sm" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                    View Cookie Policy
                  </Link>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Changes to this Privacy Policy</h3>
                  <p className="text-muted">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by 
                    posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Contact Us</h3>
                  <p className="text-muted mb-4">
                    If you have any questions about this Privacy Policy, please contact us.
                  </p>
                  <Link to="/contact-us" className="btn" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h3 className="text-center mb-4 fw-bold">Related Policies</h3>
          <div className="row justify-content-center g-3">
            <div className="col-md-3 col-6">
              <Link to="/terms" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Terms of Service</h6>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/cookies" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Cookie Policy</h6>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/trust-safety" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Trust & Safety</h6>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/accessibility" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Accessibility</h6>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .privacy-hero { animation: fadeInUp 0.8s ease-out; }
        .fade-in-left { animation: fadeInLeft 0.8s ease-out; }
        .fade-in-right { animation: fadeInRight 0.8s ease-out; }
        .icon-float { animation: float 3s ease-in-out infinite; }
        
        .section-card {
          animation: fadeInUp 0.6s ease-out;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .section-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }

        .policy-link {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .policy-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
        }
        .policy-link:hover h6 {
          color: #f16437 !important;
        }
      `}</style>
    </>
  );
};

export default Privacy;
