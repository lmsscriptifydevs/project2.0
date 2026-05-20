import { Award, Building2, CheckCircle, Globe, Lock, Shield, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const Enterprise = () => {
  const features = [
    {
      icon: <Users className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Dedicated Account Manager',
      description: 'Get a dedicated account manager to help you find and manage talent.'
    },
    {
      icon: <Shield className="icon-size text-success" />,
      title: 'Enterprise Security',
      description: 'Advanced security features including SSO, compliance, and data protection.'
    },
    {
      icon: <Zap className="icon-size text-warning" />,
      title: 'Priority Support',
      description: '24/7 priority support with faster response times and dedicated channels.'
    },
    {
      icon: <Award className="icon-size text-danger" />,
      title: 'Custom Solutions',
      description: 'Tailored solutions that fit your company\'s unique workflow and needs.'
    },
    {
      icon: <Globe className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Global Talent Pool',
      description: 'Access to our entire global network of verified professionals.'
    },
    {
      icon: <Lock className="icon-size text-secondary" />,
      title: 'Advanced Analytics',
      description: 'Detailed reporting and analytics to track your team\'s performance.'
    }
  ];

  const benefits = [
    'Unlimited talent access',
    'Custom pricing and contracts',
    'Team collaboration tools',
    'Bulk hiring capabilities',
    'Compliance and legal support',
    'Training and onboarding support'
  ];

  const useCases = [
    {
      title: 'Software Development',
      description: 'Build and scale your development teams with top-tier engineers.',
      icon: <Zap style={{ color: '#f16437' }} size={32} />
    },
    {
      title: 'Design & Creative',
      description: 'Access global creative talent for your marketing and design needs.',
      icon: <Award className="text-warning" size={32} />
    },
    {
      title: 'Marketing & Growth',
      description: 'Scale your marketing efforts with expert teams and agencies.',
      icon: <Globe className="text-success" size={32} />
    },
    {
      title: 'Operations & Support',
      description: 'Build remote teams for customer support, data entry, and more.',
      icon: <Users style={{ color: '#f16437' }} size={32} />
    }
  ];

  const stats = [
    { number: '500+', label: 'Enterprise Clients' },
    { number: '50,000+', label: 'Team Members Hired' },
    { number: '99.9%', label: 'Uptime SLA' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Enterprise Solutions</h1>
              <p className="lead mb-4">
                Scale your business with our enterprise-grade platform. Get dedicated support, advanced features, and access to the world's best talent.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/contact-us" className="btn btn-lg px-4" style={{ background: 'white', color: '#f16437', border: 'none' }}>
                  Contact Sales
                </Link>
                <Link to="/signup" className="btn btn-lg px-4" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
                  Schedule Demo
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-5 bg-white bg-opacity-10 rounded-4">
                <Building2 className="mb-3" size={80} />
                <h3 className="mb-0">Enterprise Grade</h3>
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

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Enterprise Features</h2>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="mb-3">
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

      {/* Benefits Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Enterprise Benefits</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="row g-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="col-md-6">
                    <div className="d-flex align-items-center">
                      <CheckCircle className="text-success me-3" size={24} />
                      <span>{benefit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Enterprise Use Cases</h2>
          <div className="row g-4">
            {useCases.map((useCase, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {useCase.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{useCase.title}</h5>
                    <p className="text-muted mb-0">{useCase.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Scale Your Business?</h2>
          <p className="lead mb-4">
            Talk to our enterprise team about custom solutions for your organization.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/contact-us" className="btn btn-lg px-5" style={{ background: 'white', color: '#f16437', border: 'none' }}>
              Contact Sales
            </Link>
            <Link to="/signup" className="btn btn-lg px-5" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
              Schedule Demo
            </Link>
          </div>
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

export default Enterprise;
