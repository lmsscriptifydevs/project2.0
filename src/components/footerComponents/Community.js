import { MessageSquare, Users, Award, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const Community = () => {
  const communityFeatures = [
    {
      icon: <MessageSquare size={32} style={{ color: '#f16437' }} />,
      title: 'Discussion Forums',
      description: 'Join conversations with fellow freelancers and clients. Share experiences, ask questions, and learn from the community.',
      count: '50K+'
    },
    {
      icon: <Users size={32} style={{ color: '#f16437' }} />,
      title: 'Networking Events',
      description: 'Attend virtual and in-person events to connect with professionals in your field and expand your network.',
      count: 'Monthly'
    },
    {
      icon: <Award size={32} style={{ color: '#f16437' }} />,
      title: 'Success Stories',
      description: 'Read inspiring stories from freelancers who have built successful careers on GrapeTask.',
      count: '1000+'
    },
    {
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />,
      title: 'Learning Resources',
      description: 'Access workshops, webinars, and courses to improve your skills and grow your business.',
      count: '200+'
    }
  ];

  const topics = [
    'Getting Started',
    'Pricing Strategies',
    'Client Communication',
    'Portfolio Building',
    'Time Management',
    'Skill Development'
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
      <section className="py-5 community-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4 fade-in">GrapeTask Community</h1>
          <p className="lead mb-4">
            Connect, learn, and grow with freelancers and clients from around the world
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 community-stat" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="text-center p-4 bg-white rounded shadow-sm">
                  <h2 className="display-4 fw-bold mb-2 number-animate" style={{ color: '#f16437' }}>{stat.number}</h2>
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
          <h2 className="text-center mb-5 fw-bold fade-in-up">Community Features</h2>
          <div className="row g-4">
            {communityFeatures.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6 feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4 text-center">
                    <div className="mb-3 feature-icon">
                      {feature.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted mb-3">{feature.description}</p>
                    <p className="fw-bold mb-0" style={{ color: '#f16437' }}>{feature.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Popular Discussion Topics</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="row g-3">
                {topics.map((topic, index) => (
                  <div key={index} className="col-md-4">
                    <div className="card border-0 shadow-sm text-center">
                      <div className="card-body p-4">
                        <h6 className="fw-bold mb-0">{topic}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Join Our Community?</h2>
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                      <span style={{ color: '#f16437', fontSize: '24px' }}>✓</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2">Learn from Experts</h5>
                      <p className="text-muted mb-0">Get advice from successful freelancers and industry experts.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                      <span style={{ color: '#f16437', fontSize: '24px' }}>✓</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2">Share Knowledge</h5>
                      <p className="text-muted mb-0">Help others by sharing your experiences and insights.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                      <span style={{ color: '#f16437', fontSize: '24px' }}>✓</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2">Build Your Network</h5>
                      <p className="text-muted mb-0">Connect with potential clients and collaborators.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                      <span style={{ color: '#f16437', fontSize: '24px' }}>✓</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2">Stay Updated</h5>
                      <p className="text-muted mb-0">Keep up with the latest trends and opportunities.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 cta-pulse" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Join the Community Today</h2>
          <p className="lead mb-4">
            Start connecting with freelancers and clients from around the world.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/signup" className="btn btn-lg px-5 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
              Join Now
            </Link>
            <Link to="/blog" className="btn btn-lg px-5" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
              Visit Blog
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.9; } }
        @keyframes countUp { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .community-hero { animation: fadeIn 0.8s ease-out; }
        .fade-in { animation: fadeIn 0.8s ease-out; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .community-stat { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .number-animate { animation: countUp 1s ease-out; }
        .feature-card { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .feature-card:hover { transform: translateY(-10px); }
        .feature-icon { animation: float 2s ease-in-out infinite; }
        .feature-card:hover .feature-icon { animation: none; transform: scale(1.2); }
        .cta-pulse { animation: pulse 3s ease-in-out infinite; }
        .btn-bounce { animation: bounce 2s infinite; }
      `}</style>
    </>
  );
};

export default Community;
