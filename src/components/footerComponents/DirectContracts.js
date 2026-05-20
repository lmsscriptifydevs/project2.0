import { CheckCircle, FileText, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const DirectContracts = () => {
  const features = [
    {
      icon: <Shield size={32} style={{ color: '#f16437' }} />,
      title: 'Secure Agreements',
      description: 'Legally binding contracts that protect both parties with clear terms and conditions.'
    },
    {
      icon: <FileText size={32} style={{ color: '#f16437' }} />,
      title: 'Custom Terms',
      description: 'Create contracts tailored to your specific project needs and requirements.'
    },
    {
      icon: <Zap size={32} style={{ color: '#f16437' }} />,
      title: 'Quick Setup',
      description: 'Set up direct contracts in minutes with our easy-to-use templates.'
    },
    {
      icon: <CheckCircle size={32} style={{ color: '#f16437' }} />,
      title: 'Payment Protection',
      description: 'Secure escrow system ensures payments are protected until work is completed.'
    }
  ];

  const benefits = [
    'Legally binding agreements',
    'Customizable contract terms',
    'Secure payment escrow',
    'Dispute resolution support',
    'Milestone-based payments',
    'Automatic contract renewal options'
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Direct Contracts</h1>
              <p className="lead mb-4">
                Create secure, legally binding contracts directly with freelancers. Protect your projects with our comprehensive contract system.
              </p>
              <Link to="/signup" className="btn btn-lg px-4" style={{ background: 'white', color: '#f16437', border: 'none' }}>
                Get Started
              </Link>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-5 bg-white bg-opacity-10 rounded-4">
                <FileText className="mb-3" size={80} />
                <h3 className="mb-0">Secure Contracts</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Use Direct Contracts?</h2>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm text-center">
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
          <h2 className="text-center mb-5 fw-bold">Contract Features</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row g-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="col-md-6">
                        <div className="d-flex align-items-center">
                          <CheckCircle className="me-3" size={24} style={{ color: '#f16437' }} />
                          <span>{benefit}</span>
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

      {/* CTA Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Create Your First Contract?</h2>
          <p className="lead mb-4">
            Start using direct contracts to protect your projects and build trust with freelancers.
          </p>
          <Link to="/signup" className="btn btn-lg px-5" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Create Contract
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default DirectContracts;
