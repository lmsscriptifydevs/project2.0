import { CheckCircle, FileText, Globe, Shield } from 'lucide-react';
import Footer from "../Footer";
import Navbar from "../Navbar";

const ModernSlavery = () => {
  const commitments = [
    {
      icon: <Shield size={32} style={{ color: '#f16437' }} />,
      title: 'Zero Tolerance',
      description: 'We have zero tolerance for any form of modern slavery or human trafficking'
    },
    {
      icon: <Globe size={32} style={{ color: '#f16437' }} />,
      title: 'Global Standards',
      description: 'We adhere to international labor standards and human rights principles'
    },
    {
      icon: <FileText size={32} style={{ color: '#f16437' }} />,
      title: 'Regular Audits',
      description: 'We conduct regular audits to ensure compliance across our platform'
    },
    {
      icon: <CheckCircle size={32} style={{ color: '#f16437' }} />,
      title: 'Transparency',
      description: 'We are committed to transparency in our operations and reporting'
    }
  ];

  const actions = [
    'Comprehensive background checks for all users',
    'Regular monitoring and reporting mechanisms',
    'Partnership with anti-slavery organizations',
    'Training programs for our team',
    'Clear policies and procedures',
    'Whistleblower protection programs'
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 statement-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4 statement-title">Modern Slavery Statement</h1>
          <p className="lead mb-4">
            GrapeTask is committed to preventing modern slavery and human trafficking in all our operations.
          </p>
        </div>
      </section>

      {/* Statement Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto statement-content">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h2 className="fw-bold mb-4">Our Commitment</h2>
                  <p className="lead text-muted mb-4">
                    GrapeTask is committed to acting ethically and with integrity in all our business relationships. 
                    We take our responsibility to prevent acts of modern slavery and human trafficking seriously.
                  </p>
                  <p className="text-muted mb-4">
                    This statement sets out GrapeTask's actions to understand all potential modern slavery risks 
                    related to our business and to put in place steps that are aimed at ensuring that there is no 
                    slavery or human trafficking in our own business and our supply chains.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold commitments-fade">Our Commitments</h2>
          <div className="row g-4">
            {commitments.map((commitment, index) => (
              <div key={index} className="col-lg-3 col-md-6 commitment-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3 commitment-icon">
                      {commitment.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{commitment.title}</h5>
                    <p className="text-muted mb-0">{commitment.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actions Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold actions-fade">Actions We Take</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row g-3">
                    {actions.map((action, index) => (
                      <div key={index} className="col-md-6 action-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="d-flex align-items-start">
                          <CheckCircle className="me-3 mt-1" size={24} style={{ color: '#00ac4f' }} />
                          <span>{action}</span>
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

      {/* Contact Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Report Concerns</h2>
          <p className="lead text-muted mb-4">
            If you have any concerns about modern slavery or human trafficking, please contact us immediately.
          </p>
          <a href="mailto:compliance@grapetask.co" className="btn btn-lg px-5" style={{ background: '#f16437', color: 'white', border: 'none' }}>
            Contact Compliance
          </a>
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .statement-hero {
          animation: fadeIn 0.8s ease-out;
        }

        .statement-title {
          animation: fadeIn 1s ease-out;
        }

        .statement-content {
          animation: fadeIn 1s ease-out;
        }

        .commitments-fade {
          animation: fadeIn 0.8s ease-out;
        }

        .commitment-card {
          animation: scaleIn 0.8s ease-out forwards;
          opacity: 0;
          transition: transform 0.3s ease;
        }

        .commitment-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2) !important;
        }

        .commitment-icon {
          animation: float 2s ease-in-out infinite;
        }

        .commitment-card:hover .commitment-icon {
          animation: none;
          transform: scale(1.2);
        }

        .actions-fade {
          animation: fadeIn 0.8s ease-out;
        }

        .action-item {
          animation: slideIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default ModernSlavery;
