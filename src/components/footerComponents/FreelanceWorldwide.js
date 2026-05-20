import { Globe, Languages, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const FreelanceWorldwide = () => {
  const opportunities = [
    {
      icon: <Globe size={32} style={{ color: '#f16437' }} />,
      title: 'Global Opportunities',
      description: 'Access projects from clients worldwide',
      count: '180+ Countries'
    },
    {
      icon: <Languages size={32} style={{ color: '#f16437' }} />,
      title: 'Language Diversity',
      description: 'Work in multiple languages and cultures',
      count: '50+ Languages'
    },
    {
      icon: <Users size={32} style={{ color: '#f16437' }} />,
      title: 'Large Market',
      description: 'Millions of clients looking for talent',
      count: '500K+ Clients'
    },
    {
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />,
      title: 'Growing Demand',
      description: 'Increasing demand for freelance services',
      count: '30% Growth'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5 world-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Find Freelance Jobs Worldwide</h1>
          <p className="lead mb-4">Connect with clients from around the globe</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold section-fade">Global Opportunities</h2>
          <div className="row g-4">
            {opportunities.map((o, i) => (
              <div key={i} className="col-lg-3 col-md-6 world-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3 world-icon">{o.icon}</div>
                    <h5 className="fw-bold mb-3">{o.title}</h5>
                    <p className="text-muted mb-3">{o.description}</p>
                    <p className="fw-bold mb-0 number-pop" style={{ color: '#f16437' }}>{o.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <Link to="/signup" className="btn btn-lg px-5 btn-shine" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Start Your Journey
          </Link>
        </div>
      </section>
      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shine { 0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.5); } 50% { box-shadow: 0 0 25px rgba(255,255,255,0.9); } }
        .world-hero { animation: fadeIn 0.8s ease-out; }
        .section-fade { animation: fadeIn 0.8s ease-out; }
        .world-card { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .world-card:hover { transform: translateY(-10px) scale(1.02); }
        .world-icon { animation: float 2s ease-in-out infinite; }
        .world-card:hover .world-icon { animation: none; transform: scale(1.3) rotate(5deg); }
        .number-pop { animation: pop 1s ease-out; }
        .btn-shine { animation: shine 2s ease-in-out infinite; }
      `}</style>
    </>
  );
};

export default FreelanceWorldwide;
