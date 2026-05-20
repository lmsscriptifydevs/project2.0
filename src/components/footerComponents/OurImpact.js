import { Globe, Heart, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const OurImpact = () => {
  const impacts = [
    {
      icon: <Users size={32} style={{ color: '#f16437' }} />,
      title: 'Economic Empowerment',
      description: 'Helping millions of freelancers earn a living and support their families',
      number: '4M+',
      label: 'Freelancers Empowered'
    },
    {
      icon: <Globe size={32} style={{ color: '#f16437' }} />,
      title: 'Global Opportunities',
      description: 'Breaking down geographical barriers to create global opportunities',
      number: '180+',
      label: 'Countries Reached'
    },
    {
      icon: <Heart size={32} style={{ color: '#f16437' }} />,
      title: 'Community Support',
      description: 'Supporting local communities through our platform and initiatives',
      number: '$2B+',
      label: 'Earned by Freelancers'
    },
    {
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />,
      title: 'Business Growth',
      description: 'Enabling businesses to scale and grow with flexible talent',
      number: '500K+',
      label: 'Businesses Served'
    }
  ];

  const initiatives = [
    {
      title: 'Education Programs',
      description: 'Free training and certification programs for freelancers',
      impact: '100K+'
    },
    {
      title: 'Mentorship Network',
      description: 'Connecting experienced freelancers with newcomers',
      impact: '50K+'
    },
    {
      title: 'Community Grants',
      description: 'Supporting freelancer communities worldwide',
      impact: '$5M+'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 impact-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 impact-fade-in">
              <h1 className="display-4 fw-bold mb-4">Our Impact</h1>
              <p className="lead mb-4">
                See how GrapeTask is making a positive difference in the lives of freelancers and businesses worldwide.
              </p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 impact-scale">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 impact-icon">
                <Heart className="mb-3" size={80} />
                <h3 className="mb-0">Making a Difference</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats with Animation */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold stats-fade-in">Our Global Impact</h2>
          <div className="row g-4">
            {impacts.map((impact, index) => (
              <div key={index} className="col-lg-3 col-md-6 impact-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3 icon-float">
                      {impact.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{impact.title}</h5>
                    <p className="text-muted mb-3">{impact.description}</p>
                    <h2 className="display-5 fw-bold mb-2 number-count" style={{ color: '#f16437' }}>{impact.number}</h2>
                    <p className="text-muted mb-0">{impact.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold initiative-fade-in">Our Initiatives</h2>
          <div className="row g-4">
            {initiatives.map((initiative, index) => (
              <div key={index} className="col-lg-4 col-md-6 initiative-card" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">{initiative.title}</h5>
                    <p className="text-muted mb-3">{initiative.description}</p>
                    <div className="d-flex align-items-center">
                      <TrendingUp className="me-2" size={20} style={{ color: '#00ac4f' }} />
                      <span className="fw-bold" style={{ color: '#f16437' }}>{initiative.impact} Impact</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 impact-cta" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Be Part of Our Impact</h2>
          <p className="lead mb-4">
            Join us in creating positive change in the freelance economy.
          </p>
          <Link to="/signup" className="btn btn-lg px-5 btn-glow" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Join Us
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
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
            transform: translateY(-10px);
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
          }
        }

        .impact-hero {
          animation: fadeIn 0.8s ease-out;
        }

        .impact-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .impact-scale {
          animation: scaleIn 1s ease-out;
        }

        .impact-icon {
          animation: float 3s ease-in-out infinite;
        }

        .stats-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .impact-card {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
          transition: transform 0.3s ease;
        }

        .impact-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2) !important;
        }

        .icon-float {
          animation: float 2s ease-in-out infinite;
        }

        .impact-card:hover .icon-float {
          animation: none;
          transform: scale(1.2);
        }

        .number-count {
          animation: countUp 1s ease-out;
        }

        .initiative-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .initiative-card {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
          transition: transform 0.3s ease;
        }

        .initiative-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }

        .impact-cta {
          animation: fadeIn 0.8s ease-out;
        }

        .btn-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .btn-glow:hover {
          animation: none;
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(255, 255, 255, 0.6) !important;
        }
      `}</style>
    </>
  );
};

export default OurImpact;
