import { Briefcase, Globe, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const Careers = () => {
  const openPositions = [
    {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Customer Success Specialist',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time'
    }
  ];

  const benefits = [
    {
      icon: <Globe size={32} style={{ color: '#f16437' }} />,
      title: 'Remote Work',
      description: 'Work from anywhere in the world'
    },
    {
      icon: <Heart size={32} style={{ color: '#f16437' }} />,
      title: 'Health Benefits',
      description: 'Comprehensive health and wellness programs'
    },
    {
      icon: <Briefcase size={32} style={{ color: '#f16437' }} />,
      title: 'Career Growth',
      description: 'Opportunities for professional development'
    },
    {
      icon: <Users size={32} style={{ color: '#f16437' }} />,
      title: 'Great Team',
      description: 'Collaborate with talented professionals'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Join Our Team</h1>
          <p className="lead mb-4">
            Help us build the future of freelance work. Join a team that's passionate about connecting talent with opportunity.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Work With Us?</h2>
          <div className="row g-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {benefit.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{benefit.title}</h5>
                    <p className="text-muted mb-0">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Open Positions</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              {openPositions.map((position, index) => (
                <div key={index} className="card mb-3 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <h5 className="fw-bold mb-2">{position.title}</h5>
                        <p className="text-muted mb-0">{position.department}</p>
                      </div>
                      <div className="col-md-4 text-md-end">
                        <p className="mb-1">{position.location}</p>
                        <p className="text-muted small mb-0">{position.type}</p>
                      </div>
                      <div className="col-md-2 text-md-end mt-3 mt-md-0">
                        <button className="btn btn-sm" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Don't See a Role That Fits?</h2>
          <p className="lead mb-4">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Link to="/contact-us" className="btn btn-lg px-5" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Send Resume
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Careers;
