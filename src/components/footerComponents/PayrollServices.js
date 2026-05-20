import { Calculator, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const PayrollServices = () => {
  const features = [
    {
      icon: <Calculator size={32} style={{ color: '#f16437' }} />,
      title: 'Automated Payroll',
      description: 'Automated payroll processing for your freelance team'
    },
    {
      icon: <Clock size={32} style={{ color: '#f16437' }} />,
      title: 'Time Tracking',
      description: 'Accurate time tracking and billing integration'
    },
    {
      icon: <DollarSign size={32} style={{ color: '#f16437' }} />,
      title: 'Tax Compliance',
      description: 'Automatic tax calculations and compliance management'
    },
    {
      icon: <CheckCircle size={32} style={{ color: '#f16437' }} />,
      title: 'Payment Processing',
      description: 'Secure and timely payment processing'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5 fade-in-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Payroll Services</h1>
          <p className="lead mb-4">Simplify payments and compliance with our payroll services</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in">Features</h2>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-lg-3 col-md-6 feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3 icon-animate">{f.icon}</div>
                    <h5 className="fw-bold mb-3">{f.title}</h5>
                    <p className="text-muted mb-0">{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <Link to="/contact-us" className="btn btn-lg px-5 btn-pulse" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Learn More
          </Link>
        </div>
      </section>
      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .fade-in-hero { animation: fadeIn 0.8s ease-out; }
        .fade-in { animation: fadeIn 0.8s ease-out; }
        .feature-card { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .feature-card:hover { transform: translateY(-10px); }
        .icon-animate { transition: transform 0.3s; }
        .feature-card:hover .icon-animate { transform: scale(1.2); }
        .btn-pulse { animation: pulse 2s infinite; }
      `}</style>
    </>
  );
};

export default PayrollServices;
