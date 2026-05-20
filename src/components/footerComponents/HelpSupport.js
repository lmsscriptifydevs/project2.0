import { Book, HelpCircle, MessageCircle, Search, Shield, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const HelpSupport = () => {
  const helpCategories = [
    {
      icon: <Book size={32} style={{ color: '#f16437' }} />,
      title: 'Getting Started',
      description: 'Learn the basics of using GrapeTask',
      count: '25+',
      link: '/how-to-hire'
    },
    {
      icon: <Search size={32} style={{ color: '#f16437' }} />,
      title: 'Finding Work',
      description: 'Tips for freelancers to find projects',
      count: '30+',
      link: '/how-to-find-work'
    },
    {
      icon: <Shield size={32} style={{ color: '#f16437' }} />,
      title: 'Safety & Security',
      description: 'How we protect your account and payments',
      count: '15+',
      link: '/trust-safety'
    },
    {
      icon: <MessageCircle size={32} style={{ color: '#f16437' }} />,
      title: 'Communication',
      description: 'Best practices for client communication',
      count: '20+',
      link: '/help-support'
    }
  ];

  const quickLinks = [
    { title: 'How to Create an Account', link: '/signup' },
    { title: 'How to Post a Job', link: '/how-to-hire' },
    { title: 'Payment Methods', link: '/payoutMethod' },
    { title: 'Account Settings', link: '/profileSetting' },
    { title: 'Dispute Resolution', link: '/help-support' },
    { title: 'Terms of Service', link: '/terms' }
  ];

  const supportOptions = [
    {
      icon: <MessageCircle size={24} style={{ color: '#f16437' }} />,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      available: 'Available 24/7'
    },
    {
      icon: <HelpCircle size={24} style={{ color: '#f16437' }} />,
      title: 'Help Center',
      description: 'Browse our comprehensive knowledge base',
      available: 'Self-service'
    },
    {
      icon: <Video size={24} style={{ color: '#f16437' }} />,
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      available: '100+ Videos'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 help-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4 fade-in-title">Help & Support</h1>
          <p className="lead mb-4">
            Find answers to your questions and get the help you need
          </p>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for help..."
                  style={{ border: 'none', borderRadius: '8px 0 0 8px', padding: '15px' }}
                />
                <button
                  className="btn"
                  type="button"
                  style={{ background: 'white', color: '#f16437', border: 'none', borderRadius: '0 8px 8px 0' }}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {supportOptions.map((option, index) => (
              <div key={index} className="col-lg-4 col-md-6 support-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4 text-center">
                    <div className="mb-3 support-icon">
                      {option.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{option.title}</h5>
                    <p className="text-muted mb-2">{option.description}</p>
                    <p className="small mb-0" style={{ color: '#f16437' }}>{option.available}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-title">Browse Help Topics</h2>
          <div className="row g-4">
            {helpCategories.map((category, index) => (
              <div key={index} className="col-lg-3 col-md-6 category-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4 text-center">
                    <div className="mb-3 category-icon">
                      {category.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{category.title}</h5>
                    <p className="text-muted mb-3">{category.description}</p>
                    <p className="fw-bold mb-3" style={{ color: '#f16437' }}>{category.count} Articles</p>
                    <Link to={category.link} className="btn btn-sm btn-hover" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Quick Links</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="row g-3">
                {quickLinks.map((link, index) => (
                  <div key={index} className="col-md-6">
                    <Link
                      to={link.link}
                      className="d-block p-3 bg-white rounded shadow-sm text-decoration-none"
                    >
                      <h6 className="fw-bold mb-1" style={{ color: '#333' }}>{link.title}</h6>
                      <small className="text-muted">Click to learn more →</small>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-5 cta-pulse" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Still Need Help?</h2>
          <p className="lead mb-4">
            Our support team is here to assist you 24/7
          </p>
          <Link to="/contact-us" className="btn btn-lg px-5 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Contact Support
          </Link>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.9; } }
        .help-hero { animation: fadeIn 0.8s ease-out; }
        .fade-in-title { animation: fadeIn 0.8s ease-out; }
        .support-card { animation: slideIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .support-card:hover { transform: translateY(-10px); }
        .support-icon { animation: float 2s ease-in-out infinite; }
        .support-card:hover .support-icon { animation: none; transform: scale(1.2); }
        .category-card { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .category-card:hover { transform: translateY(-10px); }
        .category-icon { transition: transform 0.3s; }
        .category-card:hover .category-icon { transform: scale(1.2) rotate(5deg); }
        .btn-hover { transition: all 0.3s; }
        .btn-hover:hover { transform: scale(1.1); }
        .cta-pulse { animation: pulse 3s ease-in-out infinite; }
        .btn-bounce { animation: bounce 2s infinite; }
      `}</style>
    </>
  );
};

export default HelpSupport;
