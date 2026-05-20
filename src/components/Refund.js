import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "./Footer";
import Navbar from "./Navbar";

const Refund = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 refund-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-left">
              <h1 className="display-4 fw-bold mb-4">Refund Policy</h1>
              <p className="lead mb-4">
                Our commitment to fair transactions and customer satisfaction.
              </p>
              <p className="small opacity-75">Last updated: January 2024</p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 fade-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 icon-float">
                <RefreshCw className="mb-3" size={80} />
                <h3 className="mb-0">Fair Refunds</h3>
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
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>General Refund Policy</h3>
                  <p className="text-muted">
                    All transactions conducted through GrapeTask are subject to this refund policy.
                  </p>
                  <p className="text-muted">
                    GrapeTask reserves the right to issue refunds at its discretion.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Refund Eligibility</h3>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-success me-3 mt-1">✓</span>
                      <span className="text-muted">Refunds may be issued in cases of service dissatisfaction, non-delivery of services, or any breach of terms outlined in GrapeTask's Terms of Service.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-danger me-3 mt-1">✗</span>
                      <span className="text-muted">Refunds will not be issued for completed services unless there is a proven case of fraud, misrepresentation, or failure to deliver services as described.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Refund Process</h3>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">1</span>
                      <span className="text-muted">Clients must initiate refund requests within 7 days of service delivery.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">2</span>
                      <span className="text-muted">Refund requests should be submitted through GrapeTask's platform, providing clear details and evidence supporting the request.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">3</span>
                      <span className="text-muted">GrapeTask will review refund requests and may request additional information from both parties involved.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Resolution Process</h3>
                  <p className="text-muted">
                    GrapeTask will mediate disputes between clients and freelancers to reach a fair resolution.
                  </p>
                  <p className="text-muted">
                    If GrapeTask determines that a refund is warranted, the funds will be returned to the 
                    client's account balance or original payment method, depending on the circumstances.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Exceptions</h3>
                  <p className="text-muted">
                    Certain services or transactions may be exempt from refunds, such as customized work 
                    or services explicitly marked as non-refundable.
                  </p>
                  <p className="text-muted">
                    GrapeTask may make exceptions to this policy in extenuating circumstances or as required by law.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Dispute Resolution</h3>
                  <p className="text-muted">
                    In the event of a dispute between a client and a freelancer, GrapeTask may intervene 
                    to facilitate communication and resolution.
                  </p>
                  <p className="text-muted">
                    Clients and freelancers are encouraged to communicate openly and attempt to resolve 
                    issues before requesting a refund.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Policy Updates</h3>
                  <p className="text-muted">
                    GrapeTask reserves the right to update or modify this refund policy at any time without prior notice.
                  </p>
                  <p className="text-muted">
                    Users will be notified of any changes to the refund policy through GrapeTask's platform 
                    or communication channels.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Legal Disclaimer</h3>
                  <p className="text-muted mb-4">
                    This refund policy is subject to GrapeTask's Terms of Service and Privacy Policy.
                    If you have any questions about our refund policy, please contact us.
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
              <Link to="/privacy" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Privacy Policy</h6>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/shipping" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Delivery Policy</h6>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/help-support" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Help & Support</h6>
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

        .refund-hero { animation: fadeInUp 0.8s ease-out; }
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

export default Refund;
