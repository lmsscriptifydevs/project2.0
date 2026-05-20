import { ChevronDown, Percent, Clock, Users, Target, Globe, Zap } from 'lucide-react';
import { useState } from 'react';
import Footer from "../Footer";
import Navbar from "../Navbar";

const FreelancerBenefits = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const benefits = [
    {
      icon: <Percent className="icon-size" style={{ color: '#f97316' }} />,
      title: 'Only 10% Service Fee',
      description: 'Freelancers are charged a low and transparent platform fee.',
      highlighted: false
    },
    {
      icon: <Clock className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Fast Withdrawals (3 Days)',
      description: 'Unlike other platforms that take 7–14 days, GrapeTask releases payments in just 3 days.',
      highlighted: false
    },
    {
      icon: <Users className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'No Client Hassle',
      description: 'Business Developers handle clients and negotiations.',
      highlighted: false
    },
    {
      icon: <Target className="icon-size" style={{ color: '#22c55e' }} />,
      title: 'Skill-Based Projects',
      description: 'Freelancers receive projects relevant to their expertise.',
      highlighted: false
    },
    {
      icon: <Globe className="icon-size" style={{ color: '#3b82f6' }} />,
      title: 'Pakistan-Focused Platform',
      description: 'Built to support local freelancers with reliable payouts.',
      highlighted: false
    },
    {
      icon: <Zap className="icon-size" style={{ color: '#ffffff' }} />,
      title: 'Focus on Great Work',
      description: 'Freelancers can focus purely on doing great work, not managing clients.',
      highlighted: true
    }
  ];

  const faqs = [
    {
      question: 'Why should I choose GrapeTask as a Freelancer?',
      answer: 'GrapeTask is built to support Freelancers with fair pricing, fast payments, and consistent work opportunities. We offer only 10% service fee, fast 3-day withdrawals, no client management hassle, skill-based project matching, and Pakistan-focused support. This allows you to focus purely on doing great work while we handle client relationships.'
    },
    {
      question: 'What is the service fee for Freelancers?',
      answer: 'Freelancers are charged only 10% service fee, which is low and transparent. There are no hidden charges or additional fees. This is significantly lower than many other platforms.'
    },
    {
      question: 'How fast are payment withdrawals?',
      answer: 'GrapeTask releases payments in just 3 days, unlike other platforms that take 7–14 days. This means you get your earnings faster and can manage your finances better.'
    },
    {
      question: 'Do I need to manage clients directly?',
      answer: 'No, you don\'t need to manage clients. Business Developers handle all client communication, negotiations, and project coordination. You can focus solely on delivering quality work.'
    },
    {
      question: 'How are projects matched to my skills?',
      answer: 'Freelancers receive projects relevant to their expertise. Our system matches your skills and experience with appropriate projects, ensuring you work on tasks that align with your capabilities.'
    },
    {
      question: 'Is GrapeTask focused on Pakistan freelancers?',
      answer: 'Yes, GrapeTask is built to support local freelancers in Pakistan with reliable payouts, local payment methods, and understanding of the local market needs. We prioritize supporting the Pakistani freelancing community.'
    },
    {
      question: 'How does GrapeTask help me focus on my work?',
      answer: 'GrapeTask handles all client management, negotiations, and project coordination through Business Developers. This means you can focus purely on doing great work and delivering quality results, without worrying about client communication or project management overhead.'
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
                Freelancer Benefits
              </h1>
              <div className="text-center mb-4">
                <div style={{ width: '60px', height: '3px', backgroundColor: '#ed5623', margin: '0 auto' }}></div>
              </div>
              <h2 className="text-center cocon font-28 mb-3" style={{ color: '#1d2b3c' }}>
                Why Freelancers Choose GrapeTask
              </h2>
              <p className="text-center poppins font-18" style={{ color: '#667085', maxWidth: '800px', margin: '0 auto' }}>
                GrapeTask is built to support Freelancers with fair pricing, fast payments, and consistent work opportunities.
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
                Freelancer Advantages:
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

export default FreelancerBenefits;
