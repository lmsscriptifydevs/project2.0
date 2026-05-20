import { CheckCircle, Lock, Shield, Verified } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const TrustSafetySecurity = () => {
  const securityFeatures = [
    {
      icon: <Shield size={32} style={{ color: '#f16437' }} />,
      title: 'Secure Payments',
      description: 'All payments are processed through secure, encrypted channels with fraud protection',
      animate: 'shield-pulse'
    },
    {
      icon: <Lock size={32} style={{ color: '#f16437' }} />,
      title: 'Data Protection',
      description: 'Your personal and financial data is protected with industry-leading encryption',
      animate: 'lock-rotate'
    },
    {
      icon: <Verified size={32} style={{ color: '#f16437' }} />,
      title: 'Verified Users',
      description: 'All freelancers and clients go through our verification process',
      animate: 'verify-bounce'
    },
    {
      icon: <CheckCircle size={32} style={{ color: '#f16437' }} />,
      title: 'Dispute Resolution',
      description: 'Fair and transparent dispute resolution process for all parties',
      animate: 'check-spin'
    }
  ];

  const safetyMeasures = [
    'Two-factor authentication',
    'SSL encryption for all data',
    'Regular security audits',
    'Fraud detection systems',
    'Secure payment escrow',
    'Identity verification'
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 security-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 security-fade">
              <h1 className="display-4 fw-bold mb-4">Trust, Safety & Security</h1>
              <p className="lead mb-4">
                Your safety and security are our top priorities. Learn how we protect you and your work on GrapeTask.
              </p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 security-icon-wrapper">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 security-icon">
                <Shield className="mb-3" size={80} />
                <h3 className="mb-0">Protected Platform</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features with Animations */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold features-fade">Security Features</h2>
          <div className="row g-4">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6 security-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className={`mb-3 ${feature.animate}`}>
                      {feature.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Measures */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold measures-fade">Safety Measures</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row g-3">
                    {safetyMeasures.map((measure, index) => (
                      <div key={index} className="col-md-6 measure-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="d-flex align-items-center">
                          <CheckCircle className="me-3" size={24} style={{ color: '#00ac4f' }} />
                          <span>{measure}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold badges-fade">Trust & Certifications</h2>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm text-center badge-card">
                <div className="card-body p-4">
                  <Verified size={48} style={{ color: '#00ac4f' }} />
                  <h5 className="fw-bold mt-3">Verified Platform</h5>
                  <p className="text-muted mb-0">Certified secure platform</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm text-center badge-card">
                <div className="card-body p-4">
                  <Shield size={48} style={{ color: '#f16437' }} />
                  <h5 className="fw-bold mt-3">SSL Encrypted</h5>
                  <p className="text-muted mb-0">256-bit encryption</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm text-center badge-card">
                <div className="card-body p-4">
                  <Lock size={48} style={{ color: '#f16437' }} />
                  <h5 className="fw-bold mt-3">GDPR Compliant</h5>
                  <p className="text-muted mb-0">Data protection compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 security-cta" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Your Security is Our Priority</h2>
          <p className="lead mb-4">
            Learn more about how we keep your account and data safe.
          </p>
          <Link to="/help-support" className="btn btn-lg px-5 btn-shine" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Learn More
          </Link>
        </div>
      </section>

      <Footer />
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shine {
          0% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
          }
        }

        .security-hero {
          animation: fadeIn 0.8s ease-out;
        }

        .security-fade {
          animation: fadeIn 1s ease-out;
        }

        .security-icon-wrapper {
          animation: fadeIn 1s ease-out;
        }

        .security-icon {
          animation: pulse 3s ease-in-out infinite;
        }

        .features-fade {
          animation: fadeIn 0.8s ease-out;
        }

        .security-card {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
          transition: transform 0.3s ease;
        }

        .security-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2) !important;
        }

        .shield-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .lock-rotate {
          animation: rotate 3s linear infinite;
        }

        .verify-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        .check-spin {
          animation: spin 4s linear infinite;
        }

        .security-card:hover .shield-pulse,
        .security-card:hover .lock-rotate,
        .security-card:hover .verify-bounce,
        .security-card:hover .check-spin {
          animation: none;
          transform: scale(1.3);
        }

        .measures-fade {
          animation: fadeIn 0.8s ease-out;
        }

        .measure-item {
          animation: slideIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .badges-fade {
          animation: fadeIn 0.8s ease-out;
        }

        .badge-card {
          animation: fadeIn 0.6s ease-out;
          transition: transform 0.3s ease;
        }

        .badge-card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }

        .security-cta {
          animation: fadeIn 0.8s ease-out;
        }

        .btn-shine {
          animation: shine 2s ease-in-out infinite;
        }

        .btn-shine:hover {
          animation: none;
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};

export default TrustSafetySecurity;
