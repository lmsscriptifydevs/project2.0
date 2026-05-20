import { Award, CheckCircle, Clock, FileText, Globe, Search, Star, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const HowToFindWork = () => {
  const steps = [
    {
      step: '1',
      icon: <FileText size={32} style={{ color: '#f16437' }} />,
      title: 'Create Your Profile',
      description: 'Build a compelling profile that showcases your skills, experience, and portfolio. Add a professional photo and detailed description.'
    },
    {
      step: '2',
      icon: <Search size={32} style={{ color: '#f16437' }} />,
      title: 'Browse Opportunities',
      description: 'Search for projects that match your skills. Use filters to find the perfect opportunities for your expertise.'
    },
    {
      step: '3',
      icon: <Star size={32} style={{ color: '#f16437' }} />,
      title: 'Submit Proposals',
      description: 'Write personalized proposals that highlight why you\'re the best fit. Include relevant samples and competitive pricing.'
    },
    {
      step: '4',
      icon: <Award size={32} style={{ color: '#f16437' }} />,
      title: 'Get Hired & Deliver',
      description: 'Once hired, communicate clearly, meet deadlines, and exceed expectations to build your reputation.'
    }
  ];

  const tips = [
    {
      icon: <CheckCircle size={24} style={{ color: '#f16437' }} />,
      text: 'Complete your profile with all relevant skills and certifications'
    },
    {
      icon: <CheckCircle size={24} style={{ color: '#f16437' }} />,
      text: 'Upload a professional portfolio showcasing your best work'
    },
    {
      icon: <CheckCircle size={24} style={{ color: '#f16437' }} />,
      text: 'Write personalized proposals for each project'
    },
    {
      icon: <CheckCircle size={24} style={{ color: '#f16437' }} />,
      text: 'Set competitive but fair pricing based on your experience'
    },
    {
      icon: <CheckCircle size={24} style={{ color: '#f16437' }} />,
      text: 'Respond quickly to client messages and inquiries'
    },
    {
      icon: <CheckCircle size={24} style={{ color: '#f16437' }} />,
      text: 'Deliver high-quality work on time to build your reputation'
    }
  ];

  const successFactors = [
    {
      title: 'Profile Completeness',
      percentage: '95%',
      description: 'Complete profiles get 3x more views'
    },
    {
      title: 'Response Time',
      percentage: '< 2 hours',
      description: 'Fast responses increase hire rate by 50%'
    },
    {
      title: 'Portfolio Quality',
      percentage: 'High',
      description: 'Strong portfolios attract premium clients'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 work-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-left">
              <h1 className="display-4 fw-bold mb-4">Business Developer & Freelancer Collaboration</h1>
              <p className="lead mb-4">
                At GrapeTask, Business Developers act as project managers who connect Clients with skilled Freelancers.
              </p>
              <Link to="/signup" className="btn btn-lg px-4" style={{ background: 'white', color: '#f16437', border: 'none' }}>
                Get Started
              </Link>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 fade-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 icon-float">
                <TrendingUp className="mb-3" size={80} />
                <h3 className="mb-0">Start Your Journey</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BD & Freelancer Collaboration Steps */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">How Business Developers Work with Freelancers</h2>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 step-card">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3 step-number" style={{ width: '60px', height: '60px' }}>
                    <h3 className="mb-0 fw-bold" style={{ color: '#f16437' }}>1</h3>
                  </div>
                  <h5 className="fw-bold mb-3">Project Allocation</h5>
                  <p className="text-muted">Once a Client order is confirmed, the Business Developer searches for the most suitable Freelancer based on skills and budget.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 step-card">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3 step-number" style={{ width: '60px', height: '60px' }}>
                    <h3 className="mb-0 fw-bold" style={{ color: '#f16437' }}>2</h3>
                  </div>
                  <h5 className="fw-bold mb-3">Freelancer Hiring</h5>
                  <p className="text-muted">The BD sends project offers to Freelancers, explaining tasks, deadlines, and payment terms.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 step-card">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3 step-number" style={{ width: '60px', height: '60px' }}>
                    <h3 className="mb-0 fw-bold" style={{ color: '#f16437' }}>3</h3>
                  </div>
                  <h5 className="fw-bold mb-3">Freelancer Acceptance</h5>
                  <p className="text-muted">Freelancers can accept projects that match their expertise and preferred budget.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 step-card">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3 step-number" style={{ width: '60px', height: '60px' }}>
                    <h3 className="mb-0 fw-bold" style={{ color: '#f16437' }}>4</h3>
                  </div>
                  <h5 className="fw-bold mb-3">Project Execution</h5>
                  <p className="text-muted">Freelancers work under the guidance of the Business Developer to ensure requirements are met.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 step-card">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3 step-number" style={{ width: '60px', height: '60px' }}>
                    <h3 className="mb-0 fw-bold" style={{ color: '#f16437' }}>5</h3>
                  </div>
                  <h5 className="fw-bold mb-3">Quality Control</h5>
                  <p className="text-muted">Business Developers review work before submitting it to the Client.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 step-card">
              <div className="card h-100 border-0 shadow-sm text-white" style={{ backgroundColor: '#f16437' }}>
                <div className="card-body p-4 text-center">
                  <h5 className="fw-bold mb-3">Result</h5>
                  <p className="mb-0" style={{opacity: 0.9}}>This system allows Freelancers to focus on work quality, while Business Developers handle clients, communication, and management.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Freelancer Benefits Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Why Freelancers Choose GrapeTask</h2>
          <p className="text-center text-muted lead mb-5" style={{maxWidth: '800px', margin: '0 auto'}}>
            GrapeTask is built to support Freelancers with fair pricing, fast payments, and consistent work opportunities.
          </p>
          
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <TrendingUp size={32} style={{ color: '#f16437' }} />
                  <h5 className="mb-0 fw-bold">Only 10% Service Fee</h5>
                </div>
                <p className="text-muted mb-0">Freelancers are charged a low and transparent platform fee.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Clock size={32} style={{ color: '#f16437' }} />
                  <h5 className="mb-0 fw-bold">Fast Withdrawals (3 Days)</h5>
                </div>
                <p className="text-muted mb-0">Unlike other platforms that take 7–14 days, GrapeTask releases payments in just 3 days.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Users size={32} style={{ color: '#f16437' }} />
                  <h5 className="mb-0 fw-bold">No Client Hassle</h5>
                </div>
                <p className="text-muted mb-0">Business Developers handle clients and negotiations.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Search size={32} style={{ color: '#f16437' }} />
                  <h5 className="mb-0 fw-bold">Skill-Based Projects</h5>
                </div>
                <p className="text-muted mb-0">Freelancers receive projects relevant to their expertise.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Globe size={32} style={{ color: '#f16437' }} />
                  <h5 className="mb-0 fw-bold">Pakistan-Focused Platform</h5>
                </div>
                <p className="text-muted mb-0">Built to support local freelancers with reliable payouts.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4 text-white" style={{ backgroundColor: '#f16437' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Award size={32} />
                  <h5 className="mb-0 fw-bold">Focus on Quality</h5>
                </div>
                <p className="mb-0" style={{opacity: 0.9}}>Freelancers can focus purely on doing great work, not managing clients.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Getting Started in 4 Steps</h2>
          <div className="row g-4">
            {steps.map((item, index) => (
              <div key={index} className="col-lg-3 col-md-6 step-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4 text-center">
                    <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3 step-number" style={{ width: '60px', height: '60px' }}>
                      <h3 className="mb-0 fw-bold" style={{ color: '#f16437' }}>{item.step}</h3>
                    </div>
                    <div className="mb-3 step-icon">
                      {item.icon}
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

      {/* Tips Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Pro Tips for Success</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm tips-animate">
                <div className="card-body p-4">
                  <div className="row g-3">
                    {tips.map((tip, index) => (
                      <div key={index} className="col-md-6 tip-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="d-flex align-items-start">
                          {tip.icon}
                          <span className="ms-3">{tip.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Factors */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Keys to Success</h2>
          <div className="row g-4">
            {successFactors.map((factor, index) => (
              <div key={index} className="col-lg-4 col-md-6 factor-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <h2 className="display-5 fw-bold mb-2 number-pop" style={{ color: '#f16437' }}>{factor.percentage}</h2>
                    <h5 className="fw-bold mb-3">{factor.title}</h5>
                    <p className="text-muted mb-0">{factor.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 cta-pulse" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Start Finding Work?</h2>
          <p className="lead mb-4">
            Join millions of freelancers already finding success on GrapeTask.
          </p>
          <Link to="/signup" className="btn btn-lg px-5 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Create Your Profile
          </Link>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.9; } }
        @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .work-hero { animation: fadeInUp 0.8s ease-out; }
        .fade-in-left { animation: fadeInLeft 0.8s ease-out; }
        .fade-in-right { animation: fadeInRight 0.8s ease-out; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .icon-float { animation: float 3s ease-in-out infinite; }
        .step-card { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .step-card:hover { transform: translateY(-10px); }
        .step-number { transition: transform 0.3s; }
        .step-card:hover .step-number { transform: scale(1.1) rotate(5deg); }
        .step-icon { transition: transform 0.3s; }
        .step-card:hover .step-icon { transform: scale(1.2); }
        .tips-animate { animation: fadeInUp 0.8s ease-out; }
        .tip-item { animation: slideIn 0.6s ease-out forwards; opacity: 0; }
        .factor-card { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .factor-card:hover { transform: translateY(-10px); }
        .number-pop { animation: pop 1s ease-out; }
        .cta-pulse { animation: pulse 3s ease-in-out infinite; }
        .btn-bounce { animation: bounce 2s infinite; }
      `}</style>
    </>
  );
};

export default HowToFindWork;
