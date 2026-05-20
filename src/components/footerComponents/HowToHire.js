import { ArrowRight, Award, CheckCircle, Clock, Globe, MessageSquare, Search, ShieldCheck, Star, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

import heroImage from "../../assets/choose.png";
import secureImage from "../../assets/SAFE.png";

import postAJobImage from "../../assets/Post a job.jpeg";
import heroImg2 from "../../assets/how.png";
import heroImg3 from "../../assets/how.png";

const HowToHire = () => {
  const [activeTab, setActiveTab] = useState('post-job');
  const [openFaq, setOpenFaq] = useState(null);

  const workOptions = [
    {
      id: 'post-job',
      icon: <Search className="icon-size" />,
      title: 'Post a job and hire a pro',
      description: 'Post your job and get proposals from top-rated freelancers. Use our AI to match the best candidates.',
      features: ['AI-powered matching', 'Verified freelancers', 'Quick turnaround'],
      aText: 'Find talent',
      image: postAJobImage
    },
    {
      id: 'browse-talent',
      icon: <Users className="icon-size" />,
      title: 'Browse and buy project catalogs',
      description: 'Browse ready-to-buy services and get your project started immediately with fixed pricing.',
      features: ['Fixed pricing', 'Instant delivery', 'Pre-made solutions'],
      aText: 'Browse services',
      image: heroImg2
    },
    {
      id: 'talent-scout',
      icon: <Star className="icon-size" />,
      title: 'Let us find you the right talent',
      description: 'Get matched with hand-picked professionals who have the skills you need for your project.',
      features: ['Curated matches', 'Expert vetting', 'Premium support'],
      aText: 'Get matched',
      image: heroImg3
    }
  ];

  const safetyFeatures = [
    {
      icon: <ShieldCheck className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Secure payments',
      description: 'Your money is protected until you approve the work'
    },
    {
      icon: <MessageSquare className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Real-time collaboration',
      description: 'Chat, share files, and track progress in one place'
    },
    {
      icon: <Clock className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Time tracking',
      description: 'Transparent hourly billing with detailed timesheets'
    },
    {
      icon: <Award className="icon-size text-warning" />,
      title: 'Quality guarantee',
      description: 'Get revisions until you are 100% satisfied'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Freelancer' },
    { number: '300+', label: 'Project Complete' },
    { number: '1', label: 'Pakistan' },
    { number: '95%', label: 'Satisfaction' }
  ];

  const faqs = [
    {
      question: 'What types of projects can I post?',
      answer: 'You can post any type of digital project including web development, mobile apps, design work, writing, marketing, data entry, virtual assistance, and much more. Our platform supports projects of all sizes.'
    },
    {
      question: 'How does pricing work?',
      answer: 'We charge a small service fee only when you successfully complete a project. There are no upfront costs or monthly fees. You only pay when you get results.'
    },
    {
      question: 'How do I know freelancers are qualified?',
      answer: 'All freelancers go through our verification process. You can view their portfolios, read client reviews, see their success rates, and even interview them before hiring.'
    },
    {
      question: 'What if I\'m not satisfied with the work?',
      answer: 'We offer dispute resolution and our money-back guarantee. You can request revisions, and if issues persist, our support team will help resolve any problems.'
    },
    {
      question: 'How long does it take to find freelancers?',
      answer: 'Most jobs receive proposals within hours of posting. For urgent projects, you can mark them as "urgent" to get faster responses from available freelancers.'
    },
    {
      question: 'Can I hire the same freelancer for multiple projects?',
      answer: 'Absolutely! You can build long-term relationships with freelancers and invite them to work on future projects directly, creating your own virtual talent bench.'
    }
  ];

  return (
    <>
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #fff7ed 0%, #fef2f2 50%, #fdf2f8 100%);
          position: relative;
          overflow: hidden;
        }
        
        .hero-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(249, 115, 22, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
        }
        
        .gradient-text {
          background: linear-gradient(90deg, #f97316 0%, #ef4444 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-line {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #f97316 0%, #ef4444 100%);
          border-radius: 2px;
        }
        
        .btn-gradient {
          background: linear-gradient(90deg, #f97316 0%, #ef4444 100%);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .btn-outline-custom {
          border: 2px solid #f97316;
          color: #f97316;
          background: transparent;
        }
        
        .btn-outline-custom:hover {
          background-color: #fff7ed;
          color: #f97316;
        }
        
        .image-glow {
          position: relative;
        }
        
        .image-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(249, 115, 22, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%);
          border-radius: 1rem;
          filter: blur(30px);
          z-index: -1;
        }
        
        .tab-btn {
          transition: all 0.3s ease;
          border-radius: 50px;
          border: none;
          padding: 12px 24px;
          font-weight: 500;
        }
        
        .tab-btn.active {
          background: linear-gradient(90deg, #f97316 0%, #ef4444 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        
        .tab-btn:not(.active) {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .tab-btn:not(.active):hover {
          background-color: #e9ecef;
        }
        
        .feature-card {
          transition: all 0.3s ease;
          border-radius: 12px;
        }
        
        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .safety-bg {
          background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
        }
        
        .cta-gradient {
          background: linear-gradient(90deg, #f97316 0%, #ef4444 100%);
        }
        
        .all-in-one-card {
          background: linear-gradient(90deg, #f97316 0%, #ef4444 100%);
          border-radius: 12px;
        }
        
        .faq-item {
          background-color: #f8f9fa;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .faq-btn {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          padding: 24px;
          transition: background-color 0.3s ease;
        }
        
        .faq-btn:hover {
          background-color: #e9ecef;
        }
        
        .plus-icon {
          width: 24px;
          height: 24px;
          position: relative;
          transition: transform 0.3s ease;
        }
        
        .plus-icon.rotated {
          transform: rotate(45deg);
        }
        
        .plus-icon::before,
        .plus-icon::after {
          content: '';
          position: absolute;
          background-color: #6c757d;
          border-radius: 1px;
        }
        
        .plus-icon::before {
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          transform: translateY(-50%);
        }
        
        .plus-icon::after {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
        }
        
        .icon-size {
          width: 24px;
          height: 24px;
        }
        
        .icon-badge {
          padding: 12px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .icon-badge-gradient {
          background: linear-gradient(90deg, #f97316 0%, #ef4444 100%);
          color: white;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .section-title {
            font-size: 2.25rem;
          }
        }
      `}</style>
       <Navbar SecondNav="none" />
      <div className="bg-white text-dark">
        
        {/* Hero Section */}
        <section className="hero-gradient py-5 position-relative">
          <div className="container position-relative" style={{zIndex: 10}}>
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="py-4">
                  <div className="mb-4">
                  <h1 className=" fw-medium cocon" style={{fontSize: '45px'}}>
                   Client & Business Developer <span className="colororing">Relationship</span>
                    </h1>
                    <div className="gradient-line mb-4"></div>
                    <p className="lead text-muted lh-lg">
                      GrapeTask is a professional freelancing marketplace where Clients, Business Developers (BDs), and Freelancers work together to deliver high-quality results efficiently.
                    </p>
                    <p className="text-muted lh-lg">
                      On GrapeTask, a Client does not directly hire a Freelancer. Instead, the Client works with a Business Developer, who manages the entire project professionally.
                    </p>
                  </div>
                  
                  <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                    <Link to="/signup" className="btn btn-gradient text-white py-3 px-4 fw-semibold fs-5 d-flex align-items-center justify-content-center gap-2">
                      Find talent <ArrowRight size={20} />
                    </Link>
                    <Link to="/signup" className="btn btn-outline-custom py-3 px-4 fw-semibold fs-5">
                      Browse services
                    </Link>
                  </div>
                  
                  <p className="small text-muted">
                    Looking to get hired?{' '}
                    <a href="/signup" className="text-decoration-underline" style={{color: '#f97316'}}>
                      Sign up as a freelancer
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="image-glow">
                  <img 
                    src={heroImage}
                    alt="Freelancers working" 
                    className="img-fluid rounded shadow-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="row g-4 mt-5 pt-5 border-top">
              {stats.map((stat, index) => (
                <div key={index} className="col-6 col-lg-3 text-center">
                  <div className="display-5 fw-bold text-dark">{stat.number}</div>
                  <div className="text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title fw-bold mb-4" style={{fontSize: '3rem'}}>How It Works</h2>
              <div className="gradient-line mx-auto mb-4"></div>
              <p className="lead text-muted mx-auto lh-lg" style={{maxWidth: '800px'}}>
                This structured approach ensures better communication, accountability, and professional project management for Clients.
              </p>
            </div>

            {/* Step by Step Process */}
            <div className="row g-4 mb-5">
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px', backgroundColor: '#f16437'}}>1</div>
                    <h5 className="mb-0 fw-bold">Client Posts a Job</h5>
                  </div>
                  <p className="text-muted">The client creates a job post describing project requirements, budget, and timeline.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px', backgroundColor: '#f16437'}}>2</div>
                    <h5 className="mb-0 fw-bold">BD Reviews the Job</h5>
                  </div>
                  <p className="text-muted">Verified Business Developers analyze the job details and decide whether to accept it.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px', backgroundColor: '#f16437'}}>3</div>
                    <h5 className="mb-0 fw-bold">BD Sends an Offer</h5>
                  </div>
                  <p className="text-muted">If a Business Developer accepts the project, they send a customized offer to the Client.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px', backgroundColor: '#f16437'}}>4</div>
                    <h5 className="mb-0 fw-bold">Client & BD Communicate</h5>
                  </div>
                  <p className="text-muted">After acceptance, the Client and Business Developer communicate to finalize scope, pricing, and delivery timeline.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px', backgroundColor: '#f16437'}}>5</div>
                    <h5 className="mb-0 fw-bold">Order Confirmation</h5>
                  </div>
                  <p className="text-muted">Once everything is agreed upon, the Client confirms the order, and the project officially starts.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px', backgroundColor: '#f16437'}}>6</div>
                    <h5 className="mb-0 fw-bold">BD Manages Execution</h5>
                  </div>
                  <p className="text-muted">The Business Developer handles project execution by hiring suitable Freelancers and ensuring quality delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Benefits Section */}
        <section className="py-5 safety-bg">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title fw-bold mb-4" style={{fontSize: '3rem'}}>Why Clients Love GrapeTask</h2>
              <div className="gradient-line mx-auto mb-4"></div>
              <p className="lead text-muted mx-auto lh-lg" style={{maxWidth: '800px'}}>
                GrapeTask is designed to be client-friendly, transparent, and cost-effective.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Award className="icon-size text-warning" />
                    <h5 className="mb-0 fw-bold">0% Service Charges</h5>
                  </div>
                  <p className="text-muted">Clients pay zero platform fees. No hidden costs.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Users className="icon-size" style={{ color: '#f16437' }} />
                    <h5 className="mb-0 fw-bold">Professional Project Management</h5>
                  </div>
                  <p className="text-muted">Every project is handled by a Business Developer.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <MessageSquare className="icon-size" style={{ color: '#f16437' }} />
                    <h5 className="mb-0 fw-bold">Faster Communication</h5>
                  </div>
                  <p className="text-muted">No confusion or delays—one clear point of contact.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Star className="icon-size text-success" />
                    <h5 className="mb-0 fw-bold">Quality Assurance</h5>
                  </div>
                  <p className="text-muted">Business Developers ensure high-quality results before delivery.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <ShieldCheck className="icon-size text-danger" />
                    <h5 className="mb-0 fw-bold">Secure Payments</h5>
                  </div>
                  <p className="text-muted">Payments are protected until project completion.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 text-white" style={{ backgroundColor: '#f16437' }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Zap className="icon-size" />
                    <h5 className="mb-0 fw-bold">Focus on Business Growth</h5>
                  </div>
                  <p className="mb-0" style={{opacity: 0.9}}>GrapeTask allows Clients to focus on business growth, while we handle execution.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Options */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title fw-bold mb-4" style={{fontSize: '3rem'}}>Let's get to work.</h2>
              <div className="gradient-line mx-auto mb-4"></div>
              <p className="lead text-muted mx-auto lh-lg" style={{maxWidth: '800px'}}>
                Build relationships and create your own Virtual Talent Bench for quick project turnarounds or big transformations.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              {workOptions.map((option) => (
                <a
                  key={option.id}
                  onClick={() => setActiveTab(option.id)}
                  className={`tab-btn d-flex align-items-center gap-2 ${activeTab === option.id ? 'active' : ''}`}
                >
                  {option.icon}
                  <span className="d-none d-sm-inline">{option.title}</span>
                </a>
              ))}
            </div>

            {/* Active Tab Content */}
            <div className="mx-auto" style={{maxWidth: '1200px'}}>
              {workOptions.map((option) => (
                <div
                  key={option.id}
                  className={activeTab === option.id ? 'd-block' : 'd-none'}
                >
                  <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                      <div className="py-3">
                        <div className="d-flex align-items-center gap-3 mb-4">
                          <div className="icon-badge icon-badge-gradient">
                            {option.icon}
                          </div>
                          <h3 className="h2 fw-bold mb-0">{option.title}</h3>
                        </div>
                        
                        <p className="fs-5 text-muted lh-lg mb-4">
                          {option.description}
                        </p>
                        
                        <ul className="list-unstyled mb-4">
                          {option.features.map((feature, index) => (
                            <li key={index} className="d-flex align-items-center gap-3 mb-3">
                              <CheckCircle className="text-success flex-shrink-0" size={20} />
                              <span className="text-muted">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <a className="btn btn-gradient text-white py-3 px-4 fw-semibold d-flex align-items-center gap-2">
                          {option.aText} <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                    
                    <div className="col-lg-6">
                      <div className="image-glow">
                        <img 
                          src={option.image} 
                          alt={option.title}
                          className="img-fluid rounded shadow"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety and Features */}
        <section className="py-5 safety-bg">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="image-glow">
                  <img 
                     src={secureImage} 
                    alt="Safe and secure platform" 
                    className="w-100 rounded shadow-lg"
                  />
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="py-4">
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="icon-badge" style={{background: 'linear-gradient(90deg, #28a745 0%, #f16437 100%)', color: 'white'}}>
                        <ShieldCheck className="icon-size" />
                      </div>
                      <h3 className="h2 fw-bold mb-0">You're safe with us</h3>
                    </div>
                    <p className="fs-5 text-muted lh-lg">
                      We ensure fair work through tracked hourly contracts or milestone-based fixed pricing. 
                      You're always in control with our comprehensive protection system.
                    </p>
                  </div>
                  
                  <div className="row g-4 mb-4">
                    {safetyFeatures.map((feature, index) => (
                      <div key={index} className="col-sm-6">
                        <div className="feature-card bg-white p-4 shadow-sm h-100">
                          <div className="d-flex align-items-start gap-3">
                            <div className="icon-badge bg-light">
                              {feature.icon}
                            </div>
                            <div>
                              <h5 className="fw-semibold text-dark mb-2">{feature.title}</h5>
                              <p className="text-muted small mb-0">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="all-in-one-card text-white p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <Zap className="icon-size" />
                      <h5 className="fs-4 fw-semibold mb-0">All in one place</h5>
                    </div>
                    <p className="mb-0" style={{opacity: 0.9}}>
                      Chat, send files, give feedback, and make payments — all from your secure client dashboard or mobile app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h3 className="display-6 fw-bold mb-4">Frequently asked questions</h3>
              <div className="gradient-line mx-auto"></div>
            </div>
            
            <div className="mx-auto" style={{maxWidth: '1000px'}}>
              <div className="d-flex flex-column gap-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <a
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="faq-btn d-flex align-items-center justify-content-between"
                    >
                      <h5 className="fw-semibold text-dark mb-0">{faq.question}</h5>
                      <div className={`plus-icon ${openFaq === index ? 'rotated' : ''}`}></div>
                    </a>
                    {openFaq === index && (
                      <div className="px-4 pb-4">
                        <p className="text-muted lh-lg mb-0">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5 cta-gradient">
          <div className="container text-center">
            <div className="mx-auto py-4" style={{maxWidth: '800px'}}>
              <h2 className="display-5 fw-bold text-white lh-sm mb-4">
                Ready to get started?
              </h2>
              <p className="fs-4 mb-5" style={{color: 'rgba(255,255,255,0.9)'}}>
                Join millions of businesses that use our platform to get work done efficiently and affordably.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/signup" className="btn btn-outline-light py-3 px-4 fw-semibold fs-5 d-flex align-items-center justify-content-center gap-2">
  <Globe size={20} />
  Post your first job
</Link>

<Link to="/signup" className="btn btn-outline-light py-3 px-4 fw-semibold fs-5">
  Browse freelancers
</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
        <Footer />
    </>
  );
};

export default HowToHire;