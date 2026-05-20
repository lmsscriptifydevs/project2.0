import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "./Footer";
import Navbar from "./Navbar";

const Shipping = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 shipping-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-left">
              <h1 className="display-4 fw-bold mb-4">Service Delivery Policy</h1>
              <p className="lead mb-4">
                Understanding how digital services are delivered on GrapeTask.
              </p>
              <p className="small opacity-75">Last updated: January 2024</p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 fade-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 icon-float">
                <Truck className="mb-3" size={80} />
                <h3 className="mb-0">Digital Delivery</h3>
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
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Service Delivery Policy</h3>
                  <p className="text-muted">
                    GrapeTask facilitates the delivery of digital services between clients (buyers) and 
                    experts (freelancers). As such, there are no physical goods shipped or delivered.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Delivery of Digital Services</h3>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">1</span>
                      <span className="text-muted">Upon agreement between the client and expert, services will be delivered digitally through GrapeTask's platform.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">2</span>
                      <span className="text-muted">Experts (freelancers) are responsible for delivering services within the agreed-upon timeframe and according to the specifications outlined in the service contract.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Communication and Collaboration</h3>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">1</span>
                      <span className="text-muted">GrapeTask provides tools and features to facilitate communication and collaboration between clients and experts.</span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <span className="badge bg-light text-dark me-3 mt-1">2</span>
                      <span className="text-muted">Clients and experts should use GrapeTask's messaging system for all communication related to service delivery to ensure transparency and accountability.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Service Completion and Approval</h3>
                  <p className="text-muted">
                    Once services are completed, experts should submit deliverables through GrapeTask's 
                    platform for client review and approval.
                  </p>
                  <p className="text-muted">
                    Clients have the option to accept deliverables as complete or request revisions if necessary.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Resolution of Delivery Issues</h3>
                  <p className="text-muted">
                    In the event of delivery issues or disputes, GrapeTask may intervene to facilitate 
                    communication and resolution between clients and experts.
                  </p>
                  <p className="text-muted">
                    Clients and experts are encouraged to communicate openly and attempt to resolve 
                    delivery issues amicably.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Feedback and Ratings</h3>
                  <p className="text-muted">
                    After service delivery, clients have the opportunity to provide feedback and ratings 
                    based on their experience with the expert.
                  </p>
                  <p className="text-muted">
                    Feedback and ratings help maintain quality standards and assist future clients in 
                    selecting the right expert for their needs.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Timeliness of Delivery</h3>
                  <p className="text-muted">
                    Experts are expected to deliver services within the agreed-upon timeframe specified 
                    in the service contract.
                  </p>
                  <p className="text-muted">
                    Delays in service delivery should be communicated promptly to the client, along with 
                    an updated timeline for completion.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4 section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Service Guarantees</h3>
                  <p className="text-muted">
                    GrapeTask does not guarantee the quality or outcome of services delivered by experts.
                  </p>
                  <p className="text-muted">
                    Clients are encouraged to review experts' profiles, portfolios, and feedback before 
                    engaging their services.
                  </p>
                </div>
              </div>

              <div className="card border-0 shadow-sm section-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4" style={{ color: '#f16437' }}>Policy Updates</h3>
                  <p className="text-muted">
                    GrapeTask reserves the right to update or modify this delivery policy at any time without prior notice.
                  </p>
                  <p className="text-muted mb-4">
                    Users will be notified of any changes to the delivery policy through GrapeTask's platform 
                    or communication channels.
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
              <Link to="/refund" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none text-center policy-link">
                <h6 className="fw-bold mb-0" style={{ color: '#333' }}>Refund Policy</h6>
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

        .shipping-hero { animation: fadeInUp 0.8s ease-out; }
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

export default Shipping;
