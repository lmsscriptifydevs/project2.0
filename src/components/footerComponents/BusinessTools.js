import { Calculator, FileText, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const BusinessTools = () => {
  const tools = [
    {
      icon: <Calculator size={32} style={{ color: '#f16437' }} />,
      title: 'Rate Calculator',
      description: 'Calculate fair rates for your services or projects',
      link: '/business-tools'
    },
    {
      icon: <FileText size={32} style={{ color: '#f16437' }} />,
      title: 'Contract Generator',
      description: 'Generate professional contracts in minutes',
      link: '/business-tools'
    },
    {
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />,
      title: 'Project Timeline Planner',
      description: 'Plan and track your project timelines effectively',
      link: '/business-tools'
    },
    {
      icon: <Zap size={32} style={{ color: '#f16437' }} />,
      title: 'Invoice Generator',
      description: 'Create professional invoices quickly',
      link: '/business-tools'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section with Animation */}
      <section className="py-5 hero-animate" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-left">
              <h1 className="display-4 fw-bold mb-4">Free Business Tools</h1>
              <p className="lead mb-4">
                Access powerful tools to help grow your business and manage your freelance work more effectively.
              </p>
              <Link to="/signup" className="btn btn-lg px-4 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
                Get Started
              </Link>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 fade-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 tool-icon-rotate">
                <Zap className="mb-3" size={80} />
                <h3 className="mb-0">Free Tools</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section with Hover Animation */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Available Tools</h2>
          <div className="row g-4">
            {tools.map((tool, index) => (
              <div key={index} className="col-lg-3 col-md-6 tool-card-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card h-100 border-0 shadow-sm tool-card">
                  <div className="card-body p-4 text-center">
                    <div className="mb-3 tool-icon">
                      {tool.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{tool.title}</h5>
                    <p className="text-muted mb-3">{tool.description}</p>
                    <Link to={tool.link} className="btn btn-sm btn-hover" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                      Use Tool
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 cta-pulse" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Start Using Free Tools Today</h2>
          <p className="lead mb-4">
            All tools are completely free to use. No signup required for basic features.
          </p>
          <Link to="/signup" className="btn btn-lg px-5 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Explore All Tools
          </Link>
        </div>
      </section>

      <Footer />
      
      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-animate {
          animation: fadeInUp 0.8s ease-out;
        }

        .fade-in-left {
          animation: fadeInLeft 0.8s ease-out;
        }

        .fade-in-right {
          animation: fadeInRight 0.8s ease-out;
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .btn-bounce {
          animation: bounce 2s infinite;
        }

        .btn-bounce:hover {
          animation: none;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(241, 100, 55, 0.4);
        }

        .tool-icon-rotate {
          animation: rotate 20s linear infinite;
        }

        .cta-pulse {
          animation: pulse 3s ease-in-out infinite;
        }

        .tool-card-wrapper {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .tool-card {
          transition: all 0.3s ease;
        }

        .tool-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }

        .tool-icon {
          transition: transform 0.3s ease;
        }

        .tool-card:hover .tool-icon {
          transform: scale(1.2) rotate(5deg);
        }

        .btn-hover {
          transition: all 0.3s ease;
        }

        .btn-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(241, 100, 55, 0.4);
        }
      `}</style>
    </>
  );
};

export default BusinessTools;
