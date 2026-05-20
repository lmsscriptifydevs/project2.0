import { CheckCircle, Eye, Headphones, Heart, Keyboard, MessageCircle, Monitor, MousePointer, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const Accessibility = () => {
  const accessibilityFeatures = [
    {
      icon: <Keyboard size={32} style={{ color: '#f16437' }} />,
      title: 'Keyboard Navigation',
      description: 'Navigate our entire platform using only your keyboard. All interactive elements are accessible via Tab, Enter, and arrow keys.',
      tips: ['Use Tab to move between elements', 'Press Enter to activate buttons', 'Use arrow keys in menus']
    },
    {
      icon: <Eye size={32} style={{ color: '#f16437' }} />,
      title: 'Screen Reader Support',
      description: 'Our platform is compatible with popular screen readers including JAWS, NVDA, and VoiceOver.',
      tips: ['All images have alt text', 'Proper heading structure', 'ARIA labels for complex elements']
    },
    {
      icon: <Monitor size={32} style={{ color: '#f16437' }} />,
      title: 'Visual Accessibility',
      description: 'High contrast colors, resizable text, and clear visual hierarchy make our platform easy to see and read.',
      tips: ['Zoom up to 200% without loss', 'High contrast color scheme', 'Clear focus indicators']
    },
    {
      icon: <Volume2 size={32} style={{ color: '#f16437' }} />,
      title: 'Audio & Video',
      description: 'All video content includes captions, and we avoid auto-playing media that could be disruptive.',
      tips: ['Closed captions on videos', 'No auto-play audio', 'Transcripts available']
    }
  ];

  const wcagPrinciples = [
    {
      letter: 'P',
      title: 'Perceivable',
      description: 'Information and user interface components must be presentable in ways users can perceive.',
      color: '#f16437'
    },
    {
      letter: 'O',
      title: 'Operable',
      description: 'User interface components and navigation must be operable by all users.',
      color: '#00ac4f'
    },
    {
      letter: 'U',
      title: 'Understandable',
      description: 'Information and operation of the user interface must be understandable.',
      color: '#3b82f6'
    },
    {
      letter: 'R',
      title: 'Robust',
      description: 'Content must be robust enough to be interpreted by a wide variety of user agents.',
      color: '#8b5cf6'
    }
  ];

  const assistiveTechnologies = [
    { name: 'JAWS', type: 'Screen Reader' },
    { name: 'NVDA', type: 'Screen Reader' },
    { name: 'VoiceOver', type: 'Screen Reader' },
    { name: 'Dragon', type: 'Voice Control' },
    { name: 'ZoomText', type: 'Screen Magnifier' },
    { name: 'Switch Access', type: 'Alternative Input' }
  ];

  const commitments = [
    'Regular accessibility audits and testing',
    'Training our team on accessibility best practices',
    'Working with users with disabilities to improve our platform',
    'Following WCAG 2.1 Level AA guidelines',
    'Continuous improvement based on user feedback',
    'Providing alternative formats upon request'
  ];

  const browserFeatures = [
    {
      feature: 'Text Resizing',
      description: 'Use Ctrl/Cmd + Plus to increase text size, Ctrl/Cmd + Minus to decrease'
    },
    {
      feature: 'High Contrast Mode',
      description: 'Enable high contrast mode in your operating system settings'
    },
    {
      feature: 'Reader Mode',
      description: 'Use browser reader mode for a simplified reading experience'
    },
    {
      feature: 'Motion Reduction',
      description: 'Enable "Reduce Motion" in your system preferences'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 access-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-left">
              <h1 className="display-4 fw-bold mb-4">Accessibility</h1>
              <p className="lead mb-4">
                We are committed to ensuring that GrapeTask is accessible to everyone, including people with disabilities. 
                Our goal is to provide an inclusive experience for all users.
              </p>
              <p className="small opacity-75">WCAG 2.1 Level AA Compliant</p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 fade-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 icon-float">
                <Heart className="mb-3" size={80} />
                <h3 className="mb-0">Inclusive Design</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="fw-bold mb-4 text-center fade-in-up">Our Commitment to Accessibility</h2>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <p className="lead text-muted mb-4">
                    At GrapeTask, we believe that everyone should have equal access to opportunities. 
                    We continuously work to improve the accessibility of our platform to ensure that all users, 
                    regardless of ability, can effectively use our services.
                  </p>
                  <div className="row g-3">
                    {commitments.map((commitment, index) => (
                      <div key={index} className="col-md-6 commitment-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="d-flex align-items-center">
                          <CheckCircle className="me-3 text-success flex-shrink-0" size={24} />
                          <span>{commitment}</span>
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

      {/* WCAG Principles Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">WCAG Principles We Follow</h2>
          <div className="row g-4">
            {wcagPrinciples.map((principle, index) => (
              <div key={index} className="col-lg-3 col-md-6 principle-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 principle-letter"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: principle.color,
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}
                    >
                      {principle.letter}
                    </div>
                    <h5 className="fw-bold mb-3">{principle.title}</h5>
                    <p className="text-muted mb-0 small">{principle.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Accessibility Features</h2>
          <div className="row g-4">
            {accessibilityFeatures.map((feature, index) => (
              <div key={index} className="col-lg-6 feature-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      <div className="feature-icon me-3 flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-3">{feature.title}</h5>
                        <p className="text-muted mb-3">{feature.description}</p>
                        <div>
                          <p className="fw-bold small mb-2">Tips:</p>
                          <ul className="list-unstyled mb-0">
                            {feature.tips.map((tip, i) => (
                              <li key={i} className="d-flex align-items-center mb-1">
                                <MousePointer className="me-2" size={14} style={{ color: '#f16437' }} />
                                <small className="text-muted">{tip}</small>
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

      {/* Assistive Technologies Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Supported Assistive Technologies</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="row g-3">
                {assistiveTechnologies.map((tech, index) => (
                  <div key={index} className="col-md-4 col-6 tech-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="card border-0 shadow-sm text-center">
                      <div className="card-body p-3">
                        <Headphones className="mb-2" size={24} style={{ color: '#f16437' }} />
                        <h6 className="fw-bold mb-1">{tech.name}</h6>
                        <small className="text-muted">{tech.type}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browser Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in-up">Browser Accessibility Features</h2>
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <p className="text-center text-muted mb-4">
                In addition to our built-in features, you can use these browser and system features to customize your experience:
              </p>
              <div className="row g-3">
                {browserFeatures.map((item, index) => (
                  <div key={index} className="col-md-6 browser-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-3">
                        <h6 className="fw-bold mb-2" style={{ color: '#f16437' }}>{item.feature}</h6>
                        <small className="text-muted">{item.description}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="fw-bold mb-4 text-center fade-in-up">Keyboard Shortcuts</h2>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-6">
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <td><kbd>Tab</kbd></td>
                            <td className="text-muted">Move to next element</td>
                          </tr>
                          <tr>
                            <td><kbd>Shift</kbd> + <kbd>Tab</kbd></td>
                            <td className="text-muted">Move to previous element</td>
                          </tr>
                          <tr>
                            <td><kbd>Enter</kbd></td>
                            <td className="text-muted">Activate buttons/links</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-6">
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <td><kbd>Space</kbd></td>
                            <td className="text-muted">Toggle checkboxes</td>
                          </tr>
                          <tr>
                            <td><kbd>Esc</kbd></td>
                            <td className="text-muted">Close modals/dropdowns</td>
                          </tr>
                          <tr>
                            <td><kbd>Arrow keys</kbd></td>
                            <td className="text-muted">Navigate within menus</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <MessageCircle className="mb-4" size={48} style={{ color: '#f16437' }} />
              <h2 className="fw-bold mb-4">Help Us Improve</h2>
              <p className="text-muted mb-4">
                We're always working to improve accessibility on our platform. If you encounter any barriers 
                or have suggestions for how we can make GrapeTask more accessible, please let us know.
              </p>
              <Link to="/contact-us" className="btn btn-lg px-5" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                Send Feedback
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 cta-pulse" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Everyone Deserves Equal Access</h2>
          <p className="lead mb-4">
            Join a platform that's committed to accessibility and inclusion for all users.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/signup" className="btn btn-lg px-5 btn-bounce" style={{ background: 'white', color: '#f16437', border: 'none' }}>
              Get Started
            </Link>
            <Link to="/help-support" className="btn btn-lg px-5" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
              Get Help
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
        @keyframes pop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .access-hero { animation: fadeInUp 0.8s ease-out; }
        .fade-in-left { animation: fadeInLeft 0.8s ease-out; }
        .fade-in-right { animation: fadeInRight 0.8s ease-out; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .icon-float { animation: float 3s ease-in-out infinite; }
        
        .commitment-item { 
          animation: slideIn 0.6s ease-out forwards; 
          opacity: 0; 
        }
        
        .principle-card { 
          animation: fadeInUp 0.6s ease-out forwards; 
          opacity: 0; 
          transition: transform 0.3s; 
        }
        .principle-card:hover { transform: translateY(-10px); }
        .principle-letter { transition: transform 0.3s; }
        .principle-card:hover .principle-letter { transform: scale(1.1) rotate(5deg); }
        
        .feature-card { 
          animation: fadeInUp 0.6s ease-out forwards; 
          opacity: 0; 
          transition: transform 0.3s; 
        }
        .feature-card:hover { transform: translateY(-5px); }
        .feature-icon { transition: transform 0.3s; }
        .feature-card:hover .feature-icon { transform: scale(1.1); }
        
        .tech-item { 
          animation: fadeInUp 0.6s ease-out forwards; 
          opacity: 0; 
          transition: transform 0.3s; 
        }
        .tech-item:hover { transform: translateY(-5px); }
        
        .browser-item { 
          animation: fadeInUp 0.6s ease-out forwards; 
          opacity: 0; 
          transition: transform 0.3s; 
        }
        .browser-item:hover { transform: translateY(-3px); }
        
        .cta-pulse { animation: pulse 3s ease-in-out infinite; }
        .btn-bounce { animation: bounce 2s infinite; }
        .btn-bounce:hover { animation: none; }

        kbd {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.875rem;
        }
      `}</style>
    </>
  );
};

export default Accessibility;
