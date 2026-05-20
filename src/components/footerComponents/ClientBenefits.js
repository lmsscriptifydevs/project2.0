import { ChevronDown, Award, Users, MessageSquare, ShieldCheck, Zap, DollarSign } from 'lucide-react';
import { useState } from 'react';
import Footer from "../Footer";
import Navbar from "../Navbar";

const ClientBenefits = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const benefits = [
    {
      icon: <DollarSign className="icon-size" style={{ color: '#f97316' }} />,
      title: '0% Service Charges',
      description: 'Clients pay zero platform fees. No hidden costs.',
      highlighted: false
    },
    {
      icon: <Users className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Professional Project Management',
      description: 'Every project is handled by a Business Developer.',
      highlighted: false
    },
    {
      icon: <MessageSquare className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Faster Communication',
      description: 'No confusion or delays—one clear point of contact.',
      highlighted: false
    },
    {
      icon: <Award className="icon-size" style={{ color: '#22c55e' }} />,
      title: 'Quality Assurance',
      description: 'Business Developers ensure high-quality results before delivery.',
      highlighted: false
    },
    {
      icon: <ShieldCheck className="icon-size" style={{ color: '#ef4444' }} />,
      title: 'Secure Payments',
      description: 'Payments are protected until project completion.',
      highlighted: false
    },
    {
      icon: <Zap className="icon-size" style={{ color: '#ffffff' }} />,
      title: 'Focus on Business Growth',
      description: 'GrapeTask allows Clients to focus on business growth, while we handle execution.',
      highlighted: true
    }
  ];

  const faqs = [
    {
      question: 'Why should I choose GrapeTask as a Client?',
      answer: 'GrapeTask is designed to be client-friendly, transparent, and cost-effective. We offer 0% service charges, professional project management through Business Developers, faster communication, quality assurance, and secure payments. This allows you to focus on your business growth while we handle project execution.'
    },
    {
      question: 'Are there any hidden fees or service charges?',
      answer: 'No, there are absolutely no hidden fees. Clients pay zero platform fees—0% service charges. What you agree to pay is exactly what you pay, with complete transparency.'
    },
    {
      question: 'How does professional project management work?',
      answer: 'Every project on GrapeTask is handled by a verified Business Developer who acts as your project manager. They coordinate with freelancers, ensure quality delivery, and manage all project aspects, so you don\'t have to.'
    },
    {
      question: 'How does communication work with Business Developers?',
      answer: 'You have one clear point of contact—your Business Developer. This eliminates confusion and delays. All communication goes through a single channel, making project coordination smooth and efficient.'
    },
    {
      question: 'How is quality assured on GrapeTask?',
      answer: 'Business Developers ensure high-quality results before delivery. They review all work, coordinate with freelancers, and make sure everything meets your requirements before the project is marked as complete.'
    },
    {
      question: 'How are payments secured?',
      answer: 'Payments are protected until project completion. Your funds are held securely and only released when you confirm that the work meets your expectations. This ensures you get what you pay for.'
    },
    {
      question: 'How does GrapeTask help me focus on business growth?',
      answer: 'GrapeTask handles all project execution details—from finding the right talent to managing delivery. This frees up your time to focus on strategic business decisions and growth initiatives, while we ensure professional project completion.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <div className="container-fluid" style={{ backgroundColor: '#f0f9ff', paddingTop: '3rem', paddingBottom: '2rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              <h1 className="text-center cocon font-38 mb-3" style={{ color: '#1d2b3c' }}>
                Client Benefits
              </h1>
              <div className="text-center mb-4">
                <div style={{ width: '60px', height: '3px', backgroundColor: '#ed5623', margin: '0 auto' }}></div>
              </div>
              <h2 className="text-center cocon font-28 mb-3" style={{ color: '#1d2b3c' }}>
                Why Clients Love GrapeTask
              </h2>
              <p className="text-center poppins font-18" style={{ color: '#667085', maxWidth: '800px', margin: '0 auto' }}>
                GrapeTask is designed to be client-friendly, transparent, and cost-effective.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Cards Section */}
      <div className="container-fluid" style={{ backgroundColor: '#f0f9ff', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-12">
              <h3 className="cocon font-24 mb-4 text-start" style={{ color: '#1d2b3c' }}>
                Key Benefits for Clients:
              </h3>
              
              <div className="row g-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-12">
                    <div 
                      className="benefit-card h-100 p-4"
                      style={{
                        backgroundColor: benefit.highlighted ? '#ed5623' : '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        border: benefit.highlighted ? 'none' : '1px solid #e5e5e5',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={(e) => {
                        if (!benefit.highlighted) {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(241, 99, 54, 0.2)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!benefit.highlighted) {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div className="mb-3" style={{ flexShrink: 0 }}>
                        {benefit.icon}
                      </div>
                      <h4 
                        className="cocon font-20 mb-3" 
                        style={{ 
                          color: benefit.highlighted ? '#ffffff' : '#1d2b3c',
                          fontWeight: '600'
                        }}
                      >
                        {benefit.title}
                      </h4>
                      <p 
                        className="poppins font-14 mb-0" 
                        style={{ 
                          color: benefit.highlighted ? '#ffffff' : '#667085',
                          lineHeight: '1.6',
                          flex: 1
                        }}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container-fluid" style={{ backgroundColor: '#ffffff', paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              
              <h2 className="cocon font-30 mb-4 text-center" style={{ color: '#1d2b3c' }}>
                Frequently Asked Questions
              </h2>
              
              {/* FAQ List */}
              <div className="faq-container">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="faq-item mb-3"
                    style={{
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      backgroundColor: openFaq === index ? '#fff5f0' : '#ffffff'
                    }}
                  >
                    <button
                      className="faq-question w-100 text-start p-4 d-flex justify-content-between align-items-center"
                      onClick={() => toggleFaq(index)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#1d2b3c',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        fontFamily: 'CoconRegularFont, sans-serif'
                      }}
                    >
                      <span style={{ flex: 1, paddingRight: '1rem' }}>{faq.question}</span>
                      <span style={{ 
                        color: '#ed5623',
                        transition: 'transform 0.3s ease',
                        transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}>
                        <ChevronDown size={24} />
                      </span>
                    </button>
                    <div
                      className="faq-answer"
                      style={{
                        maxHeight: openFaq === index ? '500px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s ease, padding 0.3s ease',
                        padding: openFaq === index ? '0 1rem 1.5rem 1rem' : '0 1rem',
                        marginLeft: '1rem',
                        marginRight: '1rem'
                      }}
                    >
                      <p 
                        className="poppins"
                        style={{ 
                          color: '#667085', 
                          lineHeight: '1.8',
                          fontSize: '1rem',
                          margin: 0
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      <style>{`
        .icon-size {
          width: 40px;
          height: 40px;
        }
        
        .faq-item:hover {
          box-shadow: 0 4px 12px rgba(241, 99, 54, 0.1);
          border-color: #ed5623;
        }
        
        .faq-question:hover {
          color: #ed5623;
        }
        
        .faq-question:focus {
          outline: 2px solid #ed5623;
          outline-offset: 2px;
        }
        
        @media (max-width: 768px) {
          .font-38 {
            font-size: 28px !important;
          }
          .font-30 {
            font-size: 24px !important;
          }
          .font-28 {
            font-size: 22px !important;
          }
          .font-24 {
            font-size: 20px !important;
          }
          .font-20 {
            font-size: 18px !important;
          }
          .font-18 {
            font-size: 16px !important;
          }
          .faq-question {
            font-size: 1rem !important;
            padding: 1rem !important;
          }
          .faq-answer {
            padding: 0 0.75rem 1rem 0.75rem !important;
            margin-left: 0.75rem !important;
            margin-right: 0.75rem !important;
          }
          .benefit-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default ClientBenefits;
