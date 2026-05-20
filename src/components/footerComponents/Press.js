import { Calendar, FileText, Globe, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const Press = () => {
  const pressReleases = [
    {
      date: 'January 15, 2024',
      title: 'GrapeTask Reaches 10K+ Active Freelancers',
      category: 'Company News',
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />
    },
    {
      date: 'December 10, 2023',
      title: 'New Enterprise Solutions Launched',
      category: 'Product Update',
      icon: <FileText size={32} style={{ color: '#f16437' }} />
    },
    {
      date: 'November 5, 2023',
      title: 'GrapeTask Operating in Pakistan',
      category: 'Company News',
      icon: <Globe size={32} style={{ color: '#f16437' }} />
    },
    {
      date: 'October 20, 2023',
      title: 'Partnership with Leading Tech Companies',
      category: 'Partnership',
      icon: <FileText size={32} style={{ color: '#f16437' }} />
    }
  ];

  const mediaKit = [
    {
      title: 'Company Logo',
      description: 'High-resolution logos in various formats',
      icon: <FileText size={24} style={{ color: '#f16437' }} />
    },
    {
      title: 'Brand Guidelines',
      description: 'Complete brand identity and usage guidelines',
      icon: <FileText size={24} style={{ color: '#f16437' }} />
    },
    {
      title: 'Press Photos',
      description: 'Official company and team photos',
      icon: <FileText size={24} style={{ color: '#f16437' }} />
    },
    {
      title: 'Company Fact Sheet',
      description: 'Key statistics and company information',
      icon: <FileText size={24} style={{ color: '#f16437' }} />
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Press & Media</h1>
          <p className="lead mb-4">
            Latest news, press releases, and media resources from GrapeTask
          </p>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Latest Press Releases</h2>
          <div className="row g-4">
            {pressReleases.map((release, index) => (
              <div key={index} className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        {release.icon}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <Calendar size={16} className="me-2" style={{ color: '#f16437' }} />
                          <small className="text-muted">{release.date}</small>
                          <span className="badge bg-light text-dark ms-2">{release.category}</span>
                        </div>
                        <h5 className="fw-bold mb-2">{release.title}</h5>
                        <Link to="/blog" className="text-decoration-none" style={{ color: '#f16437' }}>
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Media Kit</h2>
          <div className="row g-4">
            {mediaKit.map((item, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      {item.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{item.title}</h5>
                    <p className="text-muted small mb-3">{item.description}</p>
                    <button className="btn btn-sm" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Press */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="fw-bold mb-4">Press Inquiries</h2>
              <p className="lead text-muted mb-4">
                For media inquiries, interview requests, or press information, please contact our press team.
              </p>
              <Link to="/contact-us" className="btn btn-lg px-5" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                Contact Press Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Press;
