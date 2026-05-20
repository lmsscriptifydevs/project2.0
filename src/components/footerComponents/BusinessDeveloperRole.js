import { ChevronDown, Search, Handshake, MessageSquare, Users, CheckCircle, DollarSign } from 'lucide-react';
import { useState } from 'react';
import Footer from "../Footer";
import Navbar from "../Navbar";

const BusinessDeveloperRole = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const responsibilities = [
    {
      icon: <Search className="icon-size" style={{ color: '#f97316' }} />,
      title: 'Review and Accept Client Job Posts',
      description: 'Business Developers analyze client requirements and decide whether to accept projects based on their expertise and capacity.',
      highlighted: false
    },
    {
      icon: <Handshake className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Send Offers and Negotiate Pricing',
      description: 'BDs create customized offers for clients and negotiate pricing, scope, and timelines to ensure fair agreements.',
      highlighted: false
    },
    {
      icon: <MessageSquare className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Manage Communication',
      description: 'Business Developers handle all communication between Clients and Freelancers, ensuring clear and efficient coordination.',
      highlighted: false
    },
    {
      icon: <Users className="icon-size" style={{ color: '#22c55e' }} />,
      title: 'Hire Freelancers for Project Execution',
      description: 'BDs identify and hire suitable Freelancers based on project requirements and ensure they have the right skills.',
      highlighted: false
    },
    {
      icon: <CheckCircle className="icon-size" style={{ color: '#3b82f6' }} />,
      title: 'Ensure Quality and Timely Delivery',
      description: 'Business Developers monitor project progress, ensure quality standards are met, and deliver work on time.',
      highlighted: false
    },
    {
      icon: <DollarSign className="icon-size" style={{ color: '#ffffff' }} />,
      title: 'Earn by Managing Projects',
      description: 'Business Developers earn by managing projects efficiently and delivering value to both Clients and Freelancers.',
      highlighted: true
    }
  ];

  const faqs = [
    {
      question: 'What is the role of a Business Developer on GrapeTask?',
      answer: 'Business Developers are the backbone of GrapeTask. They act as intermediaries between Clients and Freelancers, managing the entire project lifecycle from job acceptance to final delivery. BDs review client job posts, send offers, negotiate pricing, manage communication, hire freelancers, ensure quality delivery, and submit final work to clients.'
    },
    {
      question: 'How do Business Developers review and accept job posts?',
      answer: 'Business Developers analyze client job posts, reviewing requirements, budget, timeline, and project scope. Based on their expertise, capacity, and ability to deliver quality results, they decide whether to accept the project and proceed with sending an offer.'
    },
    {
      question: 'How do Business Developers handle pricing and negotiations?',
      answer: 'Business Developers create customized offers for clients that include pricing, project scope, deliverables, and timelines. They negotiate terms to ensure fair agreements that benefit both the client and the freelancers who will execute the work.'
    },
    {
      question: 'How do Business Developers manage communication?',
      answer: 'Business Developers serve as the single point of contact, handling all communication between Clients and Freelancers. This ensures clear coordination, eliminates confusion, and streamlines project management without clients needing to directly communicate with multiple freelancers.'
    },
    {
      question: 'How do Business Developers hire Freelancers?',
      answer: 'Business Developers identify and hire suitable Freelancers based on project requirements. They match freelancer skills and expertise with project needs, ensuring the right talent is assigned to deliver quality results.'
    },
    {
      question: 'How do Business Developers ensure quality and timely delivery?',
      answer: 'Business Developers monitor project progress throughout the execution phase. They review work quality, ensure standards are met, coordinate with freelancers, and make sure all deliverables are completed on time before submitting final work to clients.'
    },
    {
      question: 'How do Business Developers earn on GrapeTask?',
      answer: 'Business Developers earn by managing projects efficiently and delivering value to both Clients and Freelancers. They receive compensation based on successful project completion, ensuring they are incentivized to provide excellent project management and quality results.'
    },
    {
      question: 'Why are Business Developers important on GrapeTask?',
      answer: 'Business Developers are the backbone of GrapeTask because they ensure professional project management, quality delivery, and smooth coordination between all parties. They allow clients to focus on their business while handling execution, and they provide freelancers with managed projects so they can focus on their work.'
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
                Business Developer Role
              </h1>
              <div className="text-center mb-4">
                <div style={{ width: '60px', height: '3px', backgroundColor: '#ed5623', margin: '0 auto' }}></div>
              </div>
              <h2 className="text-center cocon font-28 mb-3" style={{ color: '#1d2b3c' }}>
                Role of a Business Developer on GrapeTask
              </h2>
              <p className="text-center poppins font-18" style={{ color: '#667085', maxWidth: '800px', margin: '0 auto' }}>
                Business Developers are the backbone of GrapeTask.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsibilities Cards Section */}
      <div className="container-fluid" style={{ backgroundColor: '#f0f9ff', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-12">
              <h3 className="cocon font-24 mb-4 text-start" style={{ color: '#1d2b3c' }}>
                Responsibilities of a Business Developer:
              </h3>
              
              <div className="row g-4">
                {responsibilities.map((responsibility, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-12">
                    <div 
                      className="benefit-card h-100 p-4"
                      style={{
                        backgroundColor: responsibility.highlighted ? '#ed5623' : '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        border: responsibility.highlighted ? 'none' : '1px solid #e5e5e5',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={(e) => {
                        if (!responsibility.highlighted) {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(241, 99, 54, 0.2)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!responsibility.highlighted) {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div className="mb-3" style={{ flexShrink: 0 }}>
                        {responsibility.icon}
                      </div>
                      <h4 
                        className="cocon font-20 mb-3" 
                        style={{ 
                          color: responsibility.highlighted ? '#ffffff' : '#1d2b3c',
                          fontWeight: '600'
                        }}
                      >
                        {responsibility.title}
                      </h4>
                      <p 
                        className="poppins font-14 mb-0" 
                        style={{ 
                          color: responsibility.highlighted ? '#ffffff' : '#667085',
                          lineHeight: '1.6',
                          flex: 1
                        }}
                      >
                        {responsibility.description}
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

export default BusinessDeveloperRole;
