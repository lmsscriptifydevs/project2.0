import { Award, Clock, Search, Star, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const TalentScout = () => {
  const benefits = [
    {
      icon: <Search className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Expert Matching',
      description: 'Our team uses AI and human expertise to find the perfect match for your needs.'
    },
    {
      icon: <Award className="icon-size text-warning" />,
      title: 'Vetted Professionals',
      description: 'Every freelancer is thoroughly vetted for skills, experience, and reliability.'
    },
    {
      icon: <Clock className="icon-size text-success" />,
      title: 'Save Time',
      description: 'Skip the search. We do the legwork and present you with top candidates.'
    },
    {
      icon: <Target className="icon-size text-danger" />,
      title: 'Perfect Fit',
      description: 'Get matched with professionals who understand your specific requirements.'
    }
  ];

  const process = [
    {
      step: '1',
      title: 'Tell Us Your Needs',
      description: 'Share your project requirements, budget, and timeline with our team.'
    },
    {
      step: '2',
      title: 'We Search & Vet',
      description: 'Our experts search our network and vet candidates based on your criteria.'
    },
    {
      step: '3',
      title: 'Get Matched',
      description: 'Receive a curated list of 3-5 top candidates within 24-48 hours.'
    },
    {
      step: '4',
      title: 'Interview & Hire',
      description: 'Interview the candidates and hire the one that fits best.'
    }
  ];

  const stats = [
    { number: '95%', label: 'Match Success Rate' },
    { number: '24-48h', label: 'Average Match Time' },
    { number: '10,000+', label: 'Successful Matches' },
    { number: '4.9/5', label: 'Client Satisfaction' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      text: 'Talent Scout saved us weeks of searching. We found the perfect developer in just 2 days!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Director',
      text: 'The quality of candidates was outstanding. Highly recommend this service.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder, Design Studio',
      text: 'Best investment we made. Found our lead designer through Talent Scout.',
      rating: 5
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Talent Scout</h1>
              <p className="lead mb-4">
                Let our experts find you the perfect talent. We do the searching, vetting, and matching so you can focus on your business.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/contact-us" className="btn btn-lg px-4" style={{ background: 'white', color: '#f16437', border: 'none' }}>
                  Get Started
                </Link>
                <Link to="/how-to-hire" className="btn btn-lg px-4" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-5 bg-white bg-opacity-10 rounded-4">
                <Users className="mb-3" size={80} />
                <h3 className="mb-0">Expert Talent Matching</h3>
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
                  <h2 className="display-4 fw-bold mb-2" style={{ color: '#f16437' }}>{stat.number}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Use Talent Scout?</h2>
          <div className="row g-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="text-center p-4 h-100">
                  <div className="mb-3 d-flex justify-content-center">
                    {benefit.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{benefit.title}</h5>
                  <p className="text-muted">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">How It Works</h2>
          <div className="row g-4">
            {process.map((item, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4 text-center">
                    <div className="rounded-circle text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#f16437' }}>
                      <h3 className="mb-0 fw-bold">{item.step}</h3>
                    </div>
                    <h5 className="fw-bold mb-3">{item.title}</h5>
                    <p className="text-muted">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">What Clients Say</h2>
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="text-warning" size={20} fill="currentColor" />
                      ))}
                    </div>
                    <p className="mb-4">"{testimonial.text}"</p>
                    <div>
                      <h6 className="fw-bold mb-1">{testimonial.name}</h6>
                      <p className="text-muted small mb-0">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="lead mb-4">
            Let our Talent Scout team help you find the right professional for your project.
          </p>
          <Link to="/contact-us" className="btn btn-lg px-5" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Contact Talent Scout
          </Link>
        </div>
      </section>

      <Footer />
      
      <style>{`
        .icon-size {
          width: 40px;
          height: 40px;
        }
      `}</style>
    </>
  );
};

export default TalentScout;
