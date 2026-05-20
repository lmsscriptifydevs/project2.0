import { Award, CheckCircle, Search, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const TalentMarketPlace = () => {
  const categories = [
    {
      title: 'Web & App Developers',
      description: 'Frontend, Backend, Full-stack Experts',
      count: '400+',
      skills: ['React', 'Node.js', 'Python', 'PHP'],
      icon: <Zap style={{ color: '#f16437' }} size={32} />
    },
    {
      title: 'Creative Designers',
      description: 'UI/UX, Graphic, and Motion Designers',
      count: '350+',
      skills: ['Figma', 'Adobe', 'Sketch', 'After Effects'],
      icon: <Award style={{ color: '#f16437' }} size={32} />
    },
    {
      title: 'Professional Writers',
      description: 'Content, Copywriting & SEO Experts',
      count: '380+',
      skills: ['SEO', 'Copywriting', 'Content Strategy', 'Blogging'],
      icon: <Star style={{ color: '#f16437' }} size={32} />
    },
    {
      title: 'Digital Marketers',
      description: 'SEO, Social Media, PPC Specialists',
      count: '320+',
      skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics'],
      icon: <TrendingUp style={{ color: '#f16437' }} size={32} />
    },
    {
      title: 'Video & Animation',
      description: 'Video Editors, Animators, Motion Graphics',
      count: '300+',
      skills: ['Premiere Pro', 'After Effects', 'Final Cut', 'Animation'],
      icon: <Star style={{ color: '#f16437' }} size={32} />
    },
    {
      title: 'Business Services',
      description: 'Virtual Assistants, Data Entry, Consulting',
      count: '340+',
      skills: ['VA', 'Data Entry', 'Consulting', 'Project Management'],
      icon: <Users style={{ color: '#f16437' }} size={32} />
    }
  ];

  const features = [
    {
      icon: <CheckCircle style={{ color: '#f16437' }} size={24} />,
      text: 'Verified professionals'
    },
    {
      icon: <CheckCircle style={{ color: '#f16437' }} size={24} />,
      text: 'Portfolio reviews'
    },
    {
      icon: <CheckCircle style={{ color: '#f16437' }} size={24} />,
      text: 'Client ratings & reviews'
    },
    {
      icon: <CheckCircle style={{ color: '#f16437' }} size={24} />,
      text: 'Skills assessments'
    },
    {
      icon: <CheckCircle style={{ color: '#f16437' }} size={24} />,
      text: 'Background checks'
    },
    {
      icon: <CheckCircle style={{ color: '#f16437' }} size={24} />,
      text: 'Secure payments'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Freelancer' },
    { number: '300+', label: 'Project Complete' },
    { number: '1', label: 'Pakistan' },
    { number: '95%', label: 'Satisfaction' }
  ];

  const topSkills = [
    'Web Development', 'Graphic Design', 'Content Writing',
    'Digital Marketing', 'UI/UX Design', 'Data Entry',
    'Video Editing', 'SEO', 'Social Media Management', 'Translation'
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#ed5623', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Talent Marketplace</h1>
              <p className="lead mb-4">
                Explore our global marketplace of verified professionals. Find the perfect talent for your project from 400+ freelancers.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/freelancers" className="btn btn-lg px-4" style={{ background: 'white', color: '#ed5623', border: 'none' }}>
                  Browse Talent
                </Link>
                <Link to="/signup" className="btn btn-lg px-4" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
                  Get Started
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-5 bg-white bg-opacity-10 rounded-4">
                <Users className="mb-3" size={80} style={{ color: '#f16437' }} />
                <h3 className="mb-0">400+ Professionals</h3>
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
                  <h2 className="display-4 fw-bold mb-2" style={{ color: '#ed5623' }}>{stat.number}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Explore by Category</h2>
          <div className="row g-4">
            {categories.map((category, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm hover-shadow">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      {category.icon}
                      <div className="ms-3">
                        <h5 className="fw-bold mb-0">{category.title}</h5>
                        <p className="text-muted small mb-0">{category.description}</p>
                      </div>
                    </div>
                    <p className="fw-bold mb-3" style={{ color: '#f16437' }}>{category.count} Professionals</p>
                    <div className="d-flex flex-wrap gap-2">
                      {category.skills.map((skill, i) => (
                        <span key={i} className="badge bg-light text-dark">{skill}</span>
                      ))}
                    </div>
                    <Link to="/freelancers" className="btn btn-sm mt-3 w-100" style={{ background: 'transparent', color: '#f16437', border: '1px solid #f16437' }}>
                      Browse {category.title}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Choose Our Marketplace?</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="row g-3">
                {features.map((feature, index) => (
                  <div key={index} className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-white rounded shadow-sm">
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

      {/* Top Skills Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Top Skills in Demand</h2>
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                {topSkills.map((skill, index) => (
                  <Link 
                    key={index} 
                    to="/freelancers" 
                    style={{ background: 'transparent', color: '#ed5623', border: '1px solid #ed5623', padding: '8px 16px' }}
                    className="btn px-4 py-2"
                  >
                    {skill}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search CTA Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <Search className="mb-4" size={64} style={{ color: '#f16437' }} />
              <h2 className="fw-bold mb-4">Find the Perfect Talent</h2>
              <p className="lead mb-4">
                Use our advanced search to find professionals with the exact skills you need.
              </p>
              <Link to="/freelancers" className="btn btn-lg px-5" style={{ background: '#ed5623', color: 'white', border: 'none' }}>
                Start Searching
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: '#ed5623', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="lead mb-4">
            Join thousands of businesses finding top talent on GrapeTask.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/freelancers" className="btn btn-lg px-5" style={{ background: 'white', color: '#ed5623', border: 'none' }}>
              Browse Marketplace
            </Link>
            <Link to="/signup" className="btn btn-lg px-5" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      <style>{`
        .hover-shadow {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </>
  );
};

export default TalentMarketPlace;
