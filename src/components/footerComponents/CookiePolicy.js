import { CheckCircle, Cookie, FileText, Settings, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const CookiePolicy = () => {
  const cookieTypes = [
    {
      icon: <Shield size={32} style={{ color: '#f16437' }} />,
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions you take.',
      examples: ['Session cookies', 'Authentication cookies', 'Security cookies'],
      required: true
    },
    {
      icon: <Settings size={32} style={{ color: '#f16437' }} />,
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization based on your preferences.',
      examples: ['Language preferences', 'Region settings', 'Remember login details'],
      required: false
    },
    {
      icon: <FileText size={32} style={{ color: '#f16437' }} />,
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: ['Page visit tracking', 'User behavior analysis', 'Performance metrics'],
      required: false
    },
    {
      icon: <Cookie size={32} style={{ color: '#f16437' }} />,
      title: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites to display relevant advertisements based on interests.',
      examples: ['Advertising cookies', 'Social media cookies', 'Retargeting cookies'],
      required: false
    }
  ];

  const howWeUseCookies = [
    'Remember your login information and preferences',
    'Understand how you use our platform',
    'Improve our services and user experience',
    'Provide personalized content and recommendations',
    'Analyze website traffic and performance',
    'Detect and prevent fraud and abuse'
  ];

  const managingCookies = [
    {
      browser: 'Google Chrome',
      instructions: 'Settings → Privacy and Security → Cookies and other site data'
    },
    {
      browser: 'Mozilla Firefox',
      instructions: 'Options → Privacy & Security → Cookies and Site Data'
    },
    {
      browser: 'Safari',
      instructions: 'Preferences → Privacy → Manage Website Data'
    },
    {
      browser: 'Microsoft Edge',
      instructions: 'Settings → Cookies and site permissions → Cookies'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 cookie-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-left">
              <h1 className="display-4 fw-bold mb-4">Cookie Policy</h1>
              <p className="lead mb-4">
                Learn how GrapeTask uses cookies and similar technologies to improve your experience on our platform.
              </p>
              <p className="small opacity-75">Last updated: January 2024</p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 fade-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 icon-float">
                <Cookie className="mb-3" size={80} />
                <h3 className="mb-0">Your Privacy Matters</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Cookies Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="fw-bold mb-4 fade-in-up">What Are Cookies?</h2>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <p className="lead text-muted mb-4">
                    Cookies are small text files that are placed on your device when you visit a website. 
                    They help websites remember information about your visit, like your preferred language 
                    and other settings, making your next visit easier and the site more useful to you.
                  </p>
                  <p className="text-muted mb-0">
                    We also use similar technologies such as pixel tags, web beacons, and local storage 
                    to collect information about your interactions with our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Cookies Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Types of Cookies We Use</h2>
          <div className="row g-4">
            {cookieTypes.map((cookie, index) => (
              <div key={index} className="col-lg-6 cookie-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start mb-3">
                      <div className="cookie-icon me-3">
                        {cookie.icon}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h5 className="fw-bold mb-0">{cookie.title}</h5>
                          {cookie.required && (
                            <span className="badge bg-warning text-dark">Required</span>
                          )}
                        </div>
                        <p className="text-muted mb-3">{cookie.description}</p>
                        <div>
                          <p className="fw-bold small mb-2">Examples:</p>
                          <ul className="list-unstyled mb-0">
                            {cookie.examples.map((example, i) => (
                              <li key={i} className="d-flex align-items-center mb-1">
                                <CheckCircle className="me-2 text-success" size={16} />
                                <small className="text-muted">{example}</small>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Use Cookies Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">How We Use Cookies</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row g-3">
                    {howWeUseCookies.map((use, index) => (
                      <div key={index} className="col-md-6 use-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="d-flex align-items-center">
                          <CheckCircle className="me-3 text-success" size={24} />
                          <span>{use}</span>
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

      {/* Third-Party Cookies Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="fw-bold mb-4 text-center fade-in-up">Third-Party Cookies</h2>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <p className="text-muted mb-4">
                    In addition to our own cookies, we may also use various third-party cookies to report 
                    usage statistics of the service and deliver advertisements on and through our platform.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="text-center p-3 bg-light rounded">
                        <h6 className="fw-bold mb-2">Analytics Partners</h6>
                        <small className="text-muted">Google Analytics, Mixpanel</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 bg-light rounded">
                        <h6 className="fw-bold mb-2">Advertising Partners</h6>
                        <small className="text-muted">Google Ads, Facebook Pixel</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 bg-light rounded">
                        <h6 className="fw-bold mb-2">Social Media</h6>
                        <small className="text-muted">Facebook, Twitter, LinkedIn</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Managing Cookies Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Managing Your Cookie Preferences</h2>
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <p className="text-center text-muted mb-4">
                You can control and manage cookies through your browser settings. Here's how to do it in popular browsers:
              </p>
              <div className="row g-3">
                {managingCookies.map((item, index) => (
                  <div key={index} className="col-md-6 browser-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-3">
                        <h6 className="fw-bold mb-2" style={{ color: '#f16437' }}>{item.browser}</h6>
                        <small className="text-muted">{item.instructions}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="alert mt-4" style={{ backgroundColor: '#fff7ed', border: '1px solid #f16437' }}>
                <p className="mb-0 small">
                  <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website. 
                  Essential cookies cannot be disabled as they are necessary for the website to operate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Retention Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="fw-bold mb-4 text-center">Cookie Retention Period</h2>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Session Cookies</h6>
                      <p className="text-muted">
                        These are temporary cookies that are deleted when you close your browser. 
                        They are used to keep you logged in during your visit.
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Persistent Cookies</h6>
                      <p className="text-muted">
                        These cookies remain on your device for a set period or until you delete them. 
                        They help us remember your preferences for future visits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="fw-bold mb-4">Questions About Cookies?</h2>
              <p className="text-muted mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, 
                please contact our privacy team.
              </p>
              <Link to="/contact-us" className="btn btn-lg px-5" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 cta-pulse" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Your Privacy is Important to Us</h2>
          <p className="lead mb-4">
            Learn more about how we protect your data and respect your privacy choices.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/privacy" className="btn btn-lg px-5 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
              Privacy Policy
            </Link>
            <Link to="/terms" className="btn btn-lg px-5" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .cookie-hero { animation: fadeInUp 0.8s ease-out; }
        .fade-in-left { animation: fadeInLeft 0.8s ease-out; }
        .fade-in-right { animation: fadeInRight 0.8s ease-out; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .icon-float { animation: float 3s ease-in-out infinite; }
        
        .cookie-card { 
          animation: fadeInUp 0.6s ease-out forwards; 
          opacity: 0; 
          transition: transform 0.3s; 
        }
        .cookie-card:hover { transform: translateY(-5px); }
        .cookie-icon { transition: transform 0.3s; }
        .cookie-card:hover .cookie-icon { transform: scale(1.1) rotate(5deg); }
        
        .use-item { 
          animation: slideIn 0.6s ease-out forwards; 
          opacity: 0; 
        }
        
        .browser-item { 
          animation: fadeInUp 0.6s ease-out forwards; 
          opacity: 0; 
          transition: transform 0.3s; 
        }
        .browser-item:hover { transform: translateY(-3px); }
        
        .cta-pulse { animation: pulse 3s ease-in-out infinite; }
        .btn-bounce { animation: bounce 2s infinite; }
        .btn-bounce:hover { animation: none; }
      `}</style>
    </>
  );
};

export default CookiePolicy;
