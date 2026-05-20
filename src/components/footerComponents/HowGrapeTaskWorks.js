import { ChevronDown, FileText, Search, Handshake, CreditCard, Users, MessageSquare, CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';
import Footer from "../Footer";
import Navbar from "../Navbar";

const HowGrapeTaskWorks = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      stepNumber: 'Step 1',
      icon: <FileText className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Client Posts a Job',
      description: 'The process begins when a Client joins GrapeTask and posts a job. The job can be related to App Development, Web Development, Design, Marketing, or any other service. The Client defines project requirements, budget range, and timeline. Once the job is published, it becomes visible to relevant Business Developers.',
      highlighted: false
    },
    {
      stepNumber: 'Step 2',
      icon: <Search className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Business Developers Review & Send Requests',
      description: 'Business Developers carefully review the job details. Only suitable Business Developers send their requests or offers. Each BD analyzes the scope, budget, and feasibility before applying. Business Developers cannot overcharge beyond the defined structure. This ensures the Client only receives relevant and serious offers.',
      highlighted: false
    },
    {
      stepNumber: 'Step 3',
      icon: <Handshake className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Client Selects a Business Developer',
      description: 'The Client reviews all incoming requests and selects the Business Developer they trust most. Once selected, the Client and BD are officially linked, direct communication starts, and project details are finalized.',
      highlighted: false
    },
    {
      stepNumber: 'Step 4',
      icon: <CreditCard className="icon-size" style={{ color: '#22c55e' }} />,
      title: 'Offer Creation & Payment Hold',
      description: 'After agreement, the Business Developer creates a formal offer and the Client confirms the order. Payment is made to GrapeTask, not directly to anyone. Funds are securely held by GrapeTask until work is completed and approved.',
      highlighted: false
    },
    {
      stepNumber: 'Step 5',
      icon: <Users className="icon-size" style={{ color: '#3b82f6' }} />,
      title: 'Business Developer Hires a Freelancer',
      description: 'Based on the project needs, the Business Developer searches for qualified Freelancers. Selection is based on skills, reviews, completed orders, and budget compatibility. The Business Developer has a fixed 20% commission and cannot charge more than 20%. The remaining amount goes to the Freelancer.',
      highlighted: false
    },
    {
      stepNumber: 'Step 6',
      icon: <MessageSquare className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Freelancer Communication & Order Assignment',
      description: 'The Business Developer communicates with shortlisted Freelancers. After discussion, the BD assigns the project to the most suitable Freelancer. A separate order is created between BD and Freelancer. Once confirmed, the Freelancer starts work.',
      highlighted: false
    },
    {
      stepNumber: 'Step 7',
      icon: <CheckCircle className="icon-size" style={{ color: '#22c55e' }} />,
      title: 'Work Delivery & Review Process',
      description: 'Freelancer delivers work to the Business Developer. Business Developer reviews the work. If approved, the BD submits it to the Client. Client reviews and accepts the final delivery. Only after approval does the project move to completion.',
      highlighted: false
    },
    {
      stepNumber: 'Step 8',
      icon: <Star className="icon-size" style={{ color: '#ffffff' }} />,
      title: 'Reviews & Fast Payment',
      description: 'Client leaves a review for the Business Developer. Business Developer reviews the Freelancer. Freelancer receives payment within 3 days. Faster than traditional platforms that take 7–14 days.',
      highlighted: true
    }
  ];

  const faqs = [
    {
      question: 'How does GrapeTask work?',
      answer: 'GrapeTask is a structured freelancing platform designed to ensure clarity, trust, and smooth project execution. Our system connects Clients, Business Developers (BDs), and Freelancers in a professional workflow. The process involves 8 steps: Client posts a job, BDs review and send requests, Client selects a BD, offer creation and payment hold, BD hires a Freelancer, communication and assignment, work delivery and review, and finally reviews and fast payment.'
    },
    {
      question: 'What types of jobs can Clients post?',
      answer: 'Clients can post jobs related to App Development, Web Development, Design, Marketing, or any other service. The Client defines project requirements, budget range, and timeline when posting the job.'
    },
    {
      question: 'How do Business Developers review and send requests?',
      answer: 'Business Developers carefully review job details. Only suitable Business Developers send their requests or offers. Each BD analyzes the scope, budget, and feasibility before applying. Business Developers cannot overcharge beyond the defined structure, ensuring Clients only receive relevant and serious offers.'
    },
    {
      question: 'How does the Client select a Business Developer?',
      answer: 'The Client reviews all incoming requests and selects the Business Developer they trust most. Once selected, the Client and BD are officially linked, direct communication starts, and project details are finalized.'
    },
    {
      question: 'How are payments handled on GrapeTask?',
      answer: 'After agreement, the Business Developer creates a formal offer and the Client confirms the order. Payment is made to GrapeTask, not directly to anyone. Funds are securely held by GrapeTask until work is completed and approved, ensuring protection for all parties.'
    },
    {
      question: 'How does a Business Developer hire a Freelancer?',
      answer: 'Based on project needs, the Business Developer searches for qualified Freelancers. Selection is based on skills, reviews, completed orders, and budget compatibility. The Business Developer has a fixed 20% commission and cannot charge more than 20%. The remaining amount goes to the Freelancer.'
    },
    {
      question: 'How is work delivered and reviewed?',
      answer: 'Freelancer delivers work to the Business Developer. The Business Developer reviews the work. If approved, the BD submits it to the Client. The Client reviews and accepts the final delivery. Only after approval does the project move to completion.'
    },
    {
      question: 'How fast are payments released?',
      answer: 'After project completion and reviews, Freelancers receive payment within 3 days. This is faster than traditional platforms that take 7–14 days, ensuring quick access to earnings.'
    },
    {
      question: 'What is the commission structure for Business Developers?',
      answer: 'Business Developers have a fixed 20% commission and cannot charge more than 20%. This ensures transparency and fair pricing. The remaining amount goes to the Freelancer who completes the work.'
    },
    {
      question: 'Why is GrapeTask structured this way?',
      answer: 'GrapeTask is designed to ensure clarity, trust, and smooth project execution. The structured workflow with Business Developers acting as intermediaries ensures professional project management, quality delivery, and protection for all parties involved.'
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
                How GrapeTask Works
              </h1>
              <div className="text-center mb-4">
                <div style={{ width: '60px', height: '3px', backgroundColor: '#ed5623', margin: '0 auto' }}></div>
              </div>
              <h2 className="text-center cocon font-28 mb-3" style={{ color: '#1d2b3c' }}>
                A Step-by-Step Guide to Our Platform
              </h2>
              <p className="text-center poppins font-18" style={{ color: '#667085', maxWidth: '800px', margin: '0 auto' }}>
                GrapeTask is a structured freelancing platform designed to ensure clarity, trust, and smooth project execution. Our system connects Clients, Business Developers (BDs), and Freelancers in a professional workflow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="container-fluid" style={{ backgroundColor: '#ffffff', paddingTop: '2rem', paddingBottom: '1rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              <p className="poppins font-16 text-center" style={{ color: '#667085', lineHeight: '1.8' }}>
                Here's how everything works:
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Cards Section */}
      <div className="container-fluid" style={{ backgroundColor: '#f0f9ff', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-12">
              
              <div className="row g-4">
                {steps.map((step, index) => (
                  <div key={index} className="col-lg-6 col-md-6 col-12">
                    <div 
                      className="benefit-card h-100 p-4"
                      style={{
                        backgroundColor: step.highlighted ? '#ed5623' : '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        border: step.highlighted ? 'none' : '1px solid #e5e5e5',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!step.highlighted) {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(241, 99, 54, 0.2)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!step.highlighted) {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div className="d-flex align-items-start mb-3">
                        <div className="me-3" style={{ flexShrink: 0 }}>
                          {step.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div 
                            className="cocon font-14 mb-2" 
                            style={{ 
                              color: step.highlighted ? 'rgba(255, 255, 255, 0.9)' : '#ed5623',
                              fontWeight: '600'
                            }}
                          >
                            {step.stepNumber}
                          </div>
                          <h4 
                            className="cocon font-20 mb-3" 
                            style={{ 
                              color: step.highlighted ? '#ffffff' : '#1d2b3c',
                              fontWeight: '600'
                            }}
                          >
                            {step.title}
                          </h4>
                        </div>
                      </div>
                      <p 
                        className="poppins font-14 mb-0" 
                        style={{ 
                          color: step.highlighted ? '#ffffff' : '#667085',
                          lineHeight: '1.6',
                          flex: 1
                        }}
                      >
                        {step.description}
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
          .font-16 {
            font-size: 14px !important;
          }
          .font-14 {
            font-size: 13px !important;
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

export default HowGrapeTaskWorks;
