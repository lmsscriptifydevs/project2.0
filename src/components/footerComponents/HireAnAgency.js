import { Building2, CheckCircle, Shield, Star, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const HireAnAgency = () => {
  const benefits = [
    {
      icon: <Users className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Team of Experts',
      description: 'Work with entire teams of specialists, not just individuals.'
    },
    {
      icon: <Zap className="icon-size text-warning" />,
      title: 'Faster Delivery',
      description: 'Get projects completed faster with dedicated agency teams.'
    },
    {
      icon: <Shield className="icon-size text-success" />,
      title: 'Reliable & Scalable',
      description: 'Agencies can scale up or down based on your project needs.'
    },
    {
      icon: <Star className="icon-size text-danger" />,
      title: 'Proven Track Record',
      description: 'Agencies have portfolios of successful projects and clients.'
    }
  ];

  const agencyTypes = [
    {
      title: 'Web Development Agencies',
      description: 'Full-service web development teams for complex projects',
      count: '500+'
    },
    {
      title: 'Design Agencies',
      description: 'Creative teams for branding, UI/UX, and graphic design',
      count: '300+'
    },
    {
      title: 'Marketing Agencies',
      description: 'Digital marketing experts for SEO, PPC, and social media',
      count: '400+'
    },
    {
      title: 'Content Agencies',
      description: 'Teams of writers, editors, and content strategists',
      count: '250+'
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="text-success" size={24} />,
      text: 'Verified agency profiles'
    },
    {
      icon: <CheckCircle className="text-success" size={24} />,
      text: 'Portfolio and case studies'
    },
    {
      icon: <CheckCircle className="text-success" size={24} />,
      text: 'Client reviews and ratings'
    },
    {
      icon: <CheckCircle className="text-success" size={24} />,
      text: 'Team size and expertise'
    },
    {
      icon: <CheckCircle className="text-success" size={24} />,
      text: 'Project management tools'
    },
    {
      icon: <CheckCircle className="text-success" size={24} />,
      text: 'Secure payment protection'
    }
  ];

  const stats = [
    { number: '1,500+', label: 'Verified Agencies' },
    { number: '50,000+', label: 'Projects Completed' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Hire an Agency</h1>
              <p className="lead mb-4">
                Need a team instead of an individual? Connect with professional agencies that can handle your entire project from start to finish.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/freelancers" className="btn btn-lg px-4" style={{ background: 'white', color: '#f16437', border: 'none' }}>
                  Browse Agencies
                </Link>
                <Link to="/signup" className="btn btn-lg px-4" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
                  Get Started
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-5 bg-white bg-opacity-10 rounded-4">
                <Building2 className="mb-3" size={80} />
                <h3 className="mb-0">Professional Agencies</h3>
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
              <div key={index} className="col-lg-3 col-md-6">
                <div className="text-center p-4 bg-white rounded shadow-sm">
                  <h2 className="display-4 fw-bold mb-2" style={{ color: '#f16437' }}>{stat.number}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Hire an Agency?</h2>
          <div className="row g-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="text-center p-4 h-100">
                  <div className="mb-3 d-flex justify-content-center">
                    {benefit.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{benefit.title}</h5>
                  <p className="text-muted">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agency Types Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Types of Agencies</h2>
          <div className="row g-4">
            {agencyTypes.map((type, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">{type.title}</h5>
                    <p className="text-muted mb-3">{type.description}</p>
                    <p className="fw-bold mb-0" style={{ color: '#f16437' }}>{type.count} Agencies</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">What You Get</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="row g-3">
                {features.map((feature, index) => (
                  <div key={index} className="col-md-6">
                    <div className="d-flex align-items-center">
                      {feature.icon}
                      <span className="ms-3">{feature.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Work with an Agency?</h2>
          <p className="lead mb-4">
            Browse our directory of verified agencies and find the perfect team for your project.
          </p>
          <Link to="/freelancers" className="btn btn-lg px-5" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Browse Agencies
          </Link>
        </div>
      </section>

      <Footer />
      
      <style>{`
        .icon-size {
          width: 40px;
          height: 40px;
        }
      `}</style>
    </>
  );
};

export default HireAnAgency;
