import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "./Footer";
import Navbar from "./Navbar";

const Terms = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 terms-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-left">
              <h1 className="display-4 fw-bold mb-4">Terms and Conditions</h1>
              <p className="lead mb-4">
                Please read these terms and conditions carefully before using GrapeTask's services.
              </p>
              <p className="small opacity-75">Last updated: January 2024</p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 fade-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 icon-float">
                <FileText className="mb-3" size={80} />
                <h3 className="mb-0">Legal Terms</h3>
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
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Welcome to GrapeTask</h3>
                  <p className="text-muted">
                    Welcome to GrapeTask! These terms and conditions outline the rules and regulations 
                    for the use of our website www.grapetask.co (the "Site") and the services provided by GrapeTask.
                  </p>
                  <p className="text-muted">
                    By accessing this Site, you accept these terms and conditions in full. Do not continue 
                    to use the Site if you do not accept all of the terms and conditions stated on this page.
                  </p>
                </div>
              </div>

              {/* Payment & Withdrawal Policy */}
              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Payments, Fees & Withdrawals</h3>
                  
                  <h5 className="fw-bold mb-3 mt-4">Platform Fees:</h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded h-100">
                        <h6 className="fw-bold text-primary mb-2">Clients: 0%</h6>
                        <p className="text-muted mb-0 small">No service fee</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded h-100">
                        <h6 className="fw-bold text-success mb-2">Freelancers: 10%</h6>
                        <p className="text-muted mb-0 small">Low and transparent platform fee</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded h-100">
                        <h6 className="fw-bold text-warning mb-2">Business Developers</h6>
                        <p className="text-muted mb-0 small">Earn from project margins (Fixed 20% commission)</p>
                      </div>
                    </div>
                  </div>

                  <h5 className="fw-bold mb-3 mt-4">Withdrawal Timeline:</h5>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">✓ Payments are released within <strong>3 days</strong></li>
                    <li className="mb-2">✓ Faster than most global freelancing platforms</li>
                  </ul>

                  <h5 className="fw-bold mb-3 mt-4">Secure Transactions:</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">✓ Funds are held securely until project milestones are completed</li>
                    <li className="mb-0">✓ Transparent payment tracking for all users</li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Intellectual Property</h3>
                  <p className="text-muted">
                    Unless otherwise stated, GrapeTask and/or its licensors own the intellectual property 
                    rights for all material on the Site. All intellectual property rights are reserved. 
                    You may view and/or print pages from the Site for your own personal use subject to 
                    restrictions set in these terms and conditions.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Restrictions</h3>
                  <p className="text-muted mb-3">You are specifically restricted from all of the following:</p>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">1</span>
                      <span className="text-muted">Publishing any material from the Site in any other media.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">2</span>
                      <span className="text-muted">Selling, sublicensing, and/or otherwise commercializing any material from the Site.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">3</span>
                      <span className="text-muted">Using the Site in any way that is or may be damaging to the Site.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">4</span>
                      <span className="text-muted">Engaging in any data mining, data harvesting, data extracting, or any other similar activity in relation to the Site.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>User Content</h3>
                  <p className="text-muted">
                    Our Site allows you to post, link, store, share, and otherwise make available certain 
                    information, text, graphics, videos, or other material. By posting or submitting content, 
                    you grant GrapeTask a non-exclusive, royalty-free, worldwide, irrevocable, sub-licensable 
                    license to use, reproduce, adapt, publish, translate, and distribute it in any and all media.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Limitation of Liability</h3>
                  <p className="text-muted">
                    In no event shall GrapeTask nor any of its officers, directors, and employees, be liable 
                    to you for anything arising out of or in any way connected with your use of this Site, 
                    whether such liability is under contract, tort, or otherwise.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Termination</h3>
                  <p className="text-muted">
                    We reserve the right to terminate your access to the Site, without any advance notice.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Governing Law</h3>
                  <p className="text-muted">
                    These terms and conditions are governed by and construed in accordance with applicable laws, 
                    and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Changes to This Agreement</h3>
                  <p className="text-muted">
                    We reserve the right to modify these terms and conditions at any time. Your decision to 
                    continue to visit and make use of the Site after such changes have been made constitutes 
                    your formal acceptance of the new terms and conditions.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Contact Us</h3>
                  <p className="text-muted mb-4">
                    If you have any questions about these terms and conditions, please contact us.
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
              <Link to="/privacy" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Privacy Policy</h6>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/cookies" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Cookie Policy</h6>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/refund" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Refund Policy</h6>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/shipping" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Delivery Policy</h6>
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

        .terms-hero { animation: fadeInUp 0.8s ease-out; }
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

export default Terms;
