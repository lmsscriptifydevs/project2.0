import { Award, Briefcase, Globe, Users } from 'lucide-react';
import Footer from "../Footer";
import Navbar from "../Navbar";

const Leadership = () => {
  const leaders = [
    {
      name: 'John Smith',
      role: 'Chief Executive Officer',
      bio: '20+ years of experience in building successful tech companies',
      icon: <Users size={48} style={{ color: '#f16437' }} />
    },
    {
      name: 'Sarah Johnson',
      role: 'Chief Technology Officer',
      bio: 'Led engineering teams at top tech companies for over 15 years',
      icon: <Briefcase size={48} style={{ color: '#f16437' }} />
    },
    {
      name: 'Michael Chen',
      role: 'Chief Operating Officer',
      bio: 'Expert in scaling businesses and operations globally',
      icon: <Globe size={48} style={{ color: '#f16437' }} />
    },
    {
      name: 'Emily Rodriguez',
      role: 'Chief Marketing Officer',
      bio: 'Built brands and marketing strategies for leading platforms',
      icon: <Award size={48} style={{ color: '#f16437' }} />
    }
  ];

  const values = [
    'Innovation',
    'Integrity',
    'Customer Focus',
    'Team Collaboration',
    'Global Vision',
    'Excellence'
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Our Leadership Team</h1>
          <p className="lead mb-4">
            Meet the experienced leaders driving GrapeTask's vision and growth
          </p>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {leaders.map((leader, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {leader.icon}
                    </div>
                    <h5 className="fw-bold mb-2">{leader.name}</h5>
                    <p className="mb-3" style={{ color: '#f16437', fontWeight: '600' }}>{leader.role}</p>
                    <p className="text-muted small mb-0">{leader.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Leadership Values</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="row g-3">
                {values.map((value, index) => (
                  <div key={index} className="col-md-4">
                    <div className="card border-0 shadow-sm text-center">
                      <div className="card-body p-3">
                        <h6 className="fw-bold mb-0" style={{ color: '#f16437' }}>{value}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="fw-bold mb-4">Our Mission</h2>
              <p className="lead text-muted">
                To empower freelancers and businesses worldwide by creating the most trusted and innovative platform for freelance work. 
                We believe in breaking down barriers, connecting talent with opportunity, and building a future where everyone can work on their own terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Leadership;
