import { Globe, Heart, Target, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const AboutUs = () => {
  const values = [
    {
      icon: <Heart className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Our Mission',
      description: 'Connecting talented professionals with opportunities worldwide, creating a global marketplace for freelancers and businesses.'
    },
    {
      icon: <Target className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Our Vision',
      description: 'To become the world\'s leading platform for freelance work, empowering millions to work on their own terms.'
    },
    {
      icon: <Zap className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology to provide the best experience for our users.'
    },
    {
      icon: <Globe className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Global Reach',
      description: 'Serving clients and freelancers in Pakistan.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Freelancer' },
    { number: '300+', label: 'Project Complete' },
    { number: '1', label: 'Pakistan' },
    { number: '95%', label: 'Satisfaction' }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 about-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-left">
              <h1 className="display-4 fw-bold mb-4">About GrapeTask</h1>
              <p className="lead mb-4">
                We're building the world's most trusted freelance marketplace, connecting talented professionals with businesses that need their expertise.
              </p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 fade-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 icon-float">
                <Users className="mb-3" size={80} />
                <h3 className="mb-0">Our Story</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 stat-animate" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="text-center p-4 bg-white rounded shadow-sm">
                  <h2 className="display-4 fw-bold mb-2 number-count" style={{ color: '#f16437' }}>{stat.number}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Our Values</h2>
          <div className="row g-4">
            {values.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6 value-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3 d-flex justify-content-center value-icon">
                      {value.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{value.title}</h5>
                    <p className="text-muted mb-0">{value.description}</p>
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
          <h2 className="display-5 fw-bold mb-4">Join Our Mission</h2>
          <p className="lead mb-4">
            Be part of the future of work. Join millions of freelancers and businesses on GrapeTask.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/signup" className="btn btn-lg px-5 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
              Get Started
            </Link>
            <Link to="/contact-us" className="btn btn-lg px-5" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
              Contact Us
            </Link>
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
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        .about-hero { animation: fadeInUp 0.8s ease-out; }
        .fade-in-left { animation: fadeInLeft 0.8s ease-out; }
        .fade-in-right { animation: fadeInRight 0.8s ease-out; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .icon-float { animation: float 3s ease-in-out infinite; }
        .stat-animate { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .number-count { animation: countUp 1s ease-out; }
        .value-card { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .value-card:hover { transform: translateY(-10px); }
        .value-icon { transition: transform 0.3s; }
        .value-card:hover .value-icon { transform: scale(1.2) rotate(5deg); }
        .cta-pulse { animation: pulse 3s ease-in-out infinite; }
        .btn-bounce { animation: bounce 2s infinite; }
        .icon-size { width: 40px; height: 40px; }
      `}</style>
    </>
  );
};

export default AboutUs;
