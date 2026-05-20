import { ChevronDown, DollarSign, Percent, Users, Clock, ShieldCheck, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import Footer from "../Footer";
import Navbar from "../Navbar";

const WithdrawalPolicy = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const platformFees = [
    {
      icon: <DollarSign className="icon-size" style={{ color: '#22c55e' }} />,
      title: 'Clients: 0% Service Fee',
      description: 'Clients pay zero platform fees. No hidden costs or service charges.',
      highlighted: false
    },
    {
      icon: <Percent className="icon-size" style={{ color: '#f97316' }} />,
      title: 'Freelancers: 10% Service Fee',
      description: 'Freelancers are charged a low and transparent 10% platform fee.',
      highlighted: false
    },
    {
      icon: <TrendingUp className="icon-size" style={{ color: '#3b82f6' }} />,
      title: 'Business Developers: Earn from Project Margins',
      description: 'Business Developers earn by managing projects efficiently and delivering value.',
      highlighted: false
    }
  ];

  const withdrawalFeatures = [
    {
      icon: <Clock className="icon-size" style={{ color: '#ed5623' }} />,
      title: 'Payments Released in 3 Days',
      description: 'Payments are released within 3 days, faster than most global freelancing platforms.',
      highlighted: false
    },
    {
      icon: <ShieldCheck className="icon-size" style={{ color: '#22c55e' }} />,
      title: 'Secure Transactions',
      description: 'Funds are held securely until project milestones are completed.',
      highlighted: false
    },
    {
      icon: <Users className="icon-size" style={{ color: '#ffffff' }} />,
      title: 'Transparent Payment Tracking',
      description: 'Transparent payment tracking for all users ensures complete visibility and trust.',
      highlighted: true
    }
  ];

  const faqs = [
    {
      question: 'What are the platform fees on GrapeTask?',
      answer: 'GrapeTask has transparent platform fees: Clients pay 0% service fee (no platform charges), Freelancers pay 10% service fee (low and transparent), and Business Developers earn from project margins by managing projects efficiently.'
    },
    {
      question: 'Do Clients pay any service fees?',
      answer: 'No, Clients pay 0% service fee. There are no platform fees, hidden costs, or service charges for clients. What you agree to pay is exactly what you pay.'
    },
    {
      question: 'What is the service fee for Freelancers?',
      answer: 'Freelancers are charged a low and transparent 10% service fee. This is significantly lower than many other platforms and there are no hidden charges.'
    },
    {
      question: 'How do Business Developers earn on GrapeTask?',
      answer: 'Business Developers earn from project margins by managing projects efficiently and delivering value to both Clients and Freelancers. They receive compensation based on successful project completion.'
    },
    {
      question: 'How long does it take to withdraw payments?',
      answer: 'Payments are released within 3 days, which is faster than most global freelancing platforms that typically take 7–14 days. This ensures you get your earnings quickly.'
    },
    {
      question: 'How are transactions secured?',
      answer: 'Funds are held securely until project milestones are completed. This ensures that payments are only released when work is delivered and approved, protecting both clients and freelancers.'
    },
    {
      question: 'Is payment tracking transparent?',
      answer: 'Yes, GrapeTask provides transparent payment tracking for all users. You can see the status of your payments, when they will be released, and track all transactions in real-time.'
    },
    {
      question: 'What happens if a project is not completed?',
      answer: 'If a project is not completed or milestones are not met, funds remain securely held. Clients can request refunds or work with Business Developers to resolve issues before payments are released.'
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
                Withdrawal Policy
              </h1>
              <div className="text-center mb-4">
                <div style={{ width: '60px', height: '3px', backgroundColor: '#ed5623', margin: '0 auto' }}></div>
              </div>
              <h2 className="text-center cocon font-28 mb-3" style={{ color: '#1d2b3c' }}>
                Payments, Fees & Withdrawals
              </h2>
              <p className="text-center poppins font-18" style={{ color: '#667085', maxWidth: '800px', margin: '0 auto' }}>
                Transparent pricing, fast withdrawals, and secure transactions for all users.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Fees Section */}
      <div className="container-fluid" style={{ backgroundColor: '#f0f9ff', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-12">
              <h3 className="cocon font-24 mb-4 text-start" style={{ color: '#1d2b3c' }}>
                Platform Fees:
              </h3>
              
              <div className="row g-4">
                {platformFees.map((fee, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-12">
                    <div 
                      className="benefit-card h-100 p-4"
                      style={{
                        backgroundColor: fee.highlighted ? '#ed5623' : '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        border: fee.highlighted ? 'none' : '1px solid #e5e5e5',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={(e) => {
                        if (!fee.highlighted) {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(241, 99, 54, 0.2)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!fee.highlighted) {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div className="mb-3" style={{ flexShrink: 0 }}>
                        {fee.icon}
                      </div>
                      <h4 
                        className="cocon font-20 mb-3" 
                        style={{ 
                          color: fee.highlighted ? '#ffffff' : '#1d2b3c',
                          fontWeight: '600'
                        }}
                      >
                        {fee.title}
                      </h4>
                      <p 
                        className="poppins font-14 mb-0" 
                        style={{ 
                          color: fee.highlighted ? '#ffffff' : '#667085',
                          lineHeight: '1.6',
                          flex: 1
                        }}
                      >
                        {fee.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Timeline & Security Section */}
      <div className="container-fluid" style={{ backgroundColor: '#ffffff', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-12">
              <h3 className="cocon font-24 mb-4 text-start" style={{ color: '#1d2b3c' }}>
                Withdrawal Timeline & Security:
              </h3>
              
              <div className="row g-4">
                {withdrawalFeatures.map((feature, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-12">
                    <div 
                      className="benefit-card h-100 p-4"
                      style={{
                        backgroundColor: feature.highlighted ? '#ed5623' : '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        border: feature.highlighted ? 'none' : '1px solid #e5e5e5',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={(e) => {
                        if (!feature.highlighted) {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(241, 99, 54, 0.2)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!feature.highlighted) {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div className="mb-3" style={{ flexShrink: 0 }}>
                        {feature.icon}
                      </div>
                      <h4 
                        className="cocon font-20 mb-3" 
                        style={{ 
                          color: feature.highlighted ? '#ffffff' : '#1d2b3c',
                          fontWeight: '600'
                        }}
                      >
                        {feature.title}
                      </h4>
                      <p 
                        className="poppins font-14 mb-0" 
                        style={{ 
                          color: feature.highlighted ? '#ffffff' : '#667085',
                          lineHeight: '1.6',
                          flex: 1
                        }}
                      >
                        {feature.description}
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
      <div className="container-fluid" style={{ backgroundColor: '#f5f5f5', paddingTop: '3rem', paddingBottom: '4rem' }}>
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

export default WithdrawalPolicy;
