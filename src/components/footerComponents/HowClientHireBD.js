import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Footer from "../Footer";
import Navbar from "../Navbar";

const HowClientHireBD = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: 'What is GrapeTask and how does the Client-Business Developer relationship work?',
      answer: 'GrapeTask is a professional freelancing marketplace where Clients, Business Developers (BDs), and Freelancers work together to deliver high-quality results efficiently. On GrapeTask, a Client does not directly hire a Freelancer. Instead, the Client works with a Business Developer, who manages the entire project professionally.'
    },
    {
      question: 'How does a Client post a job on GrapeTask?',
      answer: 'The client creates a job post describing project requirements, budget, and timeline. This job post is then visible to verified Business Developers who can review and accept it.'
    },
    {
      question: 'What happens after a Client posts a job?',
      answer: 'Verified Business Developers analyze the job details and decide whether to accept it. They review the requirements, budget, timeline, and project scope to determine if they can deliver quality results.'
    },
    {
      question: 'How does a Business Developer send an offer to a Client?',
      answer: 'If a Business Developer accepts the project, they send a customized offer to the Client. This offer includes pricing, timeline, deliverables, and any other relevant project details.'
    },
    {
      question: 'How do Clients and Business Developers communicate?',
      answer: 'After acceptance, the Client and Business Developer communicate to finalize scope, pricing, and delivery timeline. This communication ensures both parties are aligned before the project officially starts.'
    },
    {
      question: 'What is the order confirmation process?',
      answer: 'Once everything is agreed upon, the Client confirms the order, and the project officially starts. This confirmation locks in the terms, pricing, and timeline for the project.'
    },
    {
      question: 'How does a Business Developer manage project execution?',
      answer: 'The Business Developer handles project execution by hiring suitable Freelancers and ensuring quality delivery. They act as project managers, coordinating between the Client and Freelancers to ensure smooth execution and timely delivery.'
    },
    {
      question: 'What are the benefits of this structured approach?',
      answer: 'This structured approach ensures better communication, accountability, and professional project management for Clients. Business Developers act as project managers, ensuring smooth execution and quality delivery while Clients focus on their core business needs. This model provides Clients with a single point of contact, reduces management overhead, and ensures professional handling of all project aspects.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <div className="container-fluid" style={{ backgroundColor: '#f5f5f5', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              <h1 className="text-center cocon font-38 mb-3" style={{ color: '#1d2b3c' }}>
                How Client Hire BD
              </h1>
              <div className="text-center mb-4">
                <div style={{ width: '60px', height: '3px', backgroundColor: '#ed5623', margin: '0 auto' }}></div>
              </div>
              <p className="text-center poppins font-18" style={{ color: '#667085', maxWidth: '800px', margin: '0 auto' }}>
                Client & Business Developer Relationship
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container-fluid" style={{ backgroundColor: '#ffffff', paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              
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
          .faq-question {
            font-size: 1rem !important;
            padding: 1rem !important;
          }
          .faq-answer {
            padding: 0 0.75rem 1rem 0.75rem !important;
            margin-left: 0.75rem !important;
            margin-right: 0.75rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default HowClientHireBD;
