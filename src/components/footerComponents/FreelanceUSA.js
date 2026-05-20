import { Briefcase, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const FreelanceUSA = () => {
  const opportunities = [
    {
      icon: <Briefcase size={32} style={{ color: '#f16437' }} />,
      title: 'Remote Work',
      description: 'Work from anywhere in the USA',
      count: '100K+'
    },
    {
      icon: <DollarSign size={32} style={{ color: '#f16437' }} />,
      title: 'Competitive Rates',
      description: 'Earn competitive rates for your skills',
      count: '$50-150/hr'
    },
    {
      icon: <MapPin size={32} style={{ color: '#f16437' }} />,
      title: 'US Clients',
      description: 'Work with US-based clients',
      count: '200K+'
    },
    {
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />,
      title: 'Growing Market',
      description: 'Expanding opportunities in the US market',
      count: '25% Growth'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5 usa-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Find Freelance Jobs in USA</h1>
          <p className="lead mb-4">Discover opportunities with US-based clients</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold title-animate">US Opportunities</h2>
          <div className="row g-4">
            {opportunities.map((o, i) => (
              <div key={i} className="col-lg-3 col-md-6 opp-card" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3 opp-icon">{o.icon}</div>
                    <h5 className="fw-bold mb-3">{o.title}</h5>
                    <p className="text-muted mb-3">{o.description}</p>
                    <p className="fw-bold mb-0 count-up" style={{ color: '#f16437' }}>{o.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <Link to="/signup" className="btn btn-lg px-5 btn-pulse" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Start Finding Work
          </Link>
        </div>
      </section>
      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes countUp { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .usa-hero { animation: fadeIn 0.8s ease-out; }
        .title-animate { animation: fadeIn 0.8s ease-out; }
        .opp-card { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .opp-card:hover { transform: translateY(-10px); }
        .opp-icon { animation: bounce 2s ease-in-out infinite; }
        .opp-card:hover .opp-icon { animation: none; transform: scale(1.2); }
        .count-up { animation: countUp 1s ease-out; }
        .btn-pulse { animation: pulse 2s infinite; }
      `}</style>
    </>
  );
};

export default FreelanceUSA;
