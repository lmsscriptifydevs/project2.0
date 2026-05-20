import { MapPin, Star, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const HireInUSA = () => {
  const benefits = [
    {
      icon: <MapPin size={32} style={{ color: '#f16437' }} />,
      title: 'US-Based Talent',
      description: 'Access to top freelancers located in the United States',
      count: '500K+'
    },
    {
      icon: <Star size={32} style={{ color: '#f16437' }} />,
      title: 'Time Zone Alignment',
      description: 'Work with professionals in your time zone',
      count: 'All US Timezones'
    },
    {
      icon: <Users size={32} style={{ color: '#f16437' }} />,
      title: 'Cultural Fit',
      description: 'Better communication and cultural understanding',
      count: 'Native Speakers'
    },
    {
      icon: <Zap size={32} style={{ color: '#f16437' }} />,
      title: 'Fast Response',
      description: 'Quick turnaround times with local talent',
      count: '24/7 Available'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5 slide-in-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Hire in the USA</h1>
          <p className="lead mb-4">Find top talent available within the United States</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in">Why Hire US Talent?</h2>
          <div className="row g-4">
            {benefits.map((b, i) => (
              <div key={i} className="col-lg-3 col-md-6 benefit-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3 icon-float">{b.icon}</div>
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
          <Link to="/freelancers" className="btn btn-lg px-5 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Browse US Talent
          </Link>
        </div>
      </section>
      <Footer />
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .slide-in-hero { animation: slideIn 0.8s ease-out; }
        .fade-in { animation: fadeIn 0.8s ease-out; }
        .benefit-card { animation: slideIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .benefit-card:hover { transform: translateY(-10px) scale(1.02); }
        .icon-float { animation: float 2s ease-in-out infinite; }
        .benefit-card:hover .icon-float { animation: none; transform: scale(1.2); }
        .btn-bounce { animation: bounce 2s infinite; }
      `}</style>
    </>
  );
};

export default HireInUSA;
