import { Globe, Languages, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const HireWorldwide = () => {
  const benefits = [
    {
      icon: <Globe size={32} style={{ color: '#f16437' }} />,
      title: 'Global Talent Pool',
      description: 'Access to millions of freelancers worldwide',
      count: '4M+'
    },
    {
      icon: <Languages size={32} style={{ color: '#f16437' }} />,
      title: 'Multi-Language',
      description: 'Work with professionals speaking multiple languages',
      count: '50+ Languages'
    },
    {
      icon: <Users size={32} style={{ color: '#f16437' }} />,
      title: 'Diverse Skills',
      description: 'Wide range of skills and expertise available',
      count: '200+ Skills'
    },
    {
      icon: <Zap size={32} style={{ color: '#f16437' }} />,
      title: 'Cost Effective',
      description: 'Competitive rates from global talent pool',
      count: 'Best Rates'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5 hero-fade" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Hire Worldwide</h1>
          <p className="lead mb-4">Connect with top freelancers across the globe</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-title">Global Benefits</h2>
          <div className="row g-4">
            {benefits.map((b, i) => (
              <div key={i} className="col-lg-3 col-md-6 global-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3 globe-icon">{b.icon}</div>
                    <h5 className="fw-bold mb-3">{b.title}</h5>
                    <p className="text-muted mb-3">{b.description}</p>
                    <p className="fw-bold mb-0" style={{ color: '#f16437' }}>{b.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <Link to="/freelancers" className="btn btn-lg px-5 btn-glow" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Browse Global Talent
          </Link>
        </div>
      </section>
      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.5); } 50% { box-shadow: 0 0 25px rgba(255,255,255,0.8); } }
        .hero-fade { animation: fadeIn 0.8s ease-out; }
        .fade-in-title { animation: fadeIn 0.8s ease-out; }
        .global-card { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .global-card:hover { transform: translateY(-10px) rotate(2deg); }
        .globe-icon { animation: rotate 20s linear infinite; }
        .global-card:hover .globe-icon { animation: none; transform: scale(1.3); }
        .btn-glow { animation: glow 2s ease-in-out infinite; }
      `}</style>
    </>
  );
};

export default HireWorldwide;
