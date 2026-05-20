import { CheckCircle, CreditCard, DollarSign, Package, Shield, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const PricingPackages = () => {
  const packages = [
    {
      name: 'Starter Package',
      price: 750,
      description: 'Perfect for getting started with basic features',
      features: [
        'Basic project management tools',
        'Up to 5 active projects',
        'Standard support',
        'Basic analytics',
        'Community access'
      ],
      popular: false,
      color: '#6b7280'
    },
    {
      name: 'Professional Package',
      price: 1200,
      description: 'Best for growing businesses and professionals',
      features: [
        'Advanced project management',
        'Unlimited active projects',
        'Priority support 24/7',
        'Advanced analytics & reports',
        'Team collaboration tools',
        'Custom integrations'
      ],
      popular: true,
      color: '#f0591f'
    },
    {
      name: 'Enterprise Package',
      price: 2000,
      description: 'Complete solution for large organizations',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Enterprise security & SSO',
        'Custom development',
        'API access',
        'Bulk hiring capabilities',
        'Compliance & legal support'
      ],
      popular: false,
      color: '#7c3aed'
    }
  ];

  const addOns = [
    {
      name: 'Extra Storage',
      price: 150,
      description: 'Additional 50GB storage space'
    },
    {
      name: 'Team Seats',
      price: 200,
      description: 'Add 5 additional team members'
    },
    {
      name: 'Premium Analytics',
      price: 300,
      description: 'Advanced reporting and insights'
    }
  ];

  const faqs = [
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer: 'Yes, you can change your plan at any time. Changes take effect immediately, and we prorate the billing accordingly.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial on all our packages. No credit card required to get started.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all our packages. No questions asked.'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <div className="mb-3">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                  <Star size={14} className="me-1" />
                  Pricing & Packages
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-4">Choose Your Perfect Package</h1>
              <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Flexible pricing plans designed to grow with your business. 
                From starter to enterprise, find the package that fits your needs.
                Prices range from <strong style={{color: '#f0591f'}}>750</strong> to <strong style={{color: '#f0591f'}}>2,000</strong> baht.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/signup" className="btn btn-lg px-5" style={{ background: '#f0591f', color: 'white', border: 'none' }}>
                  Get Started Free
                </Link>
                <Link to="/contact-us" className="btn btn-lg px-5" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-5" style={{ background: '#020617' }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {packages.map((pkg, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div 
                  className="card h-100 border-0 rounded-4 position-relative overflow-hidden"
                  style={{ 
                    background: pkg.popular 
                      ? 'linear-gradient(135deg, rgba(240,89,31,0.1) 0%, rgba(240,89,31,0.05) 100%)' 
                      : 'rgba(255,255,255,0.03)',
                    border: pkg.popular 
                      ? '1px solid rgba(240,89,31,0.4)' 
                      : '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {pkg.popular && (
                    <div 
                      className="position-absolute top-0 end-0 px-3 py-1 rounded-bl-3"
                      style={{ background: '#f0591f', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Most Popular
                    </div>
                  )}
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <Package size={24} style={{ color: pkg.color }} />
                        <h5 className="ms-2 mb-0 fw-bold" style={{ color: 'white' }}>{pkg.name}</h5>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{pkg.description}</p>
                    </div>
                    
                    <div className="mb-4">
                      <span className="display-5 fw-bold" style={{ color: 'white' }}>{pkg.price.toLocaleString()}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}> baht</span>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>per month</p>
                    </div>

                    <div className="mb-4 flex-grow-1">
                      <p className="fw-semibold mb-3" style={{ color: 'rgba(255,255,255,0.8)' }}>What's included:</p>
                      {pkg.features.map((feature, i) => (
                        <div key={i} className="d-flex align-items-start mb-2">
                          <CheckCircle size={18} className="me-2 mt-1 flex-shrink-0" style={{ color: '#5eead4' }} />
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link 
                      to="/signup" 
                      className="btn w-100 py-2 rounded-pill fw-semibold"
                      style={{ 
                        background: pkg.popular ? '#f0591f' : 'rgba(255,255,255,0.08)',
                        color: 'white',
                        border: pkg.popular ? 'none' : '1px solid rgba(255,255,255,0.14)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-5" style={{ background: '#0f172a' }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-2" style={{ color: 'white' }}>Optional Add-ons</h2>
          <p className="text-center mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Enhance your package with these additional features
          </p>
          <div className="row g-4 justify-content-center">
            {addOns.map((addon, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div 
                  className="card h-100 border-0 rounded-4"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(240,89,31,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <div className="card-body p-4 text-center">
                    <Zap size={32} className="mb-3" style={{ color: '#f0591f' }} />
                    <h5 className="fw-bold mb-2" style={{ color: 'white' }}>{addon.name}</h5>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{addon.description}</p>
                    <p className="fw-bold mb-0" style={{ color: '#f0591f', fontSize: '1.2rem' }}>
                      +{addon.price} baht
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-5" style={{ background: '#020617' }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-2" style={{ color: 'white' }}>Why Choose Our Packages?</h2>
          <p className="text-center mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Everything you need to succeed on GrapeTask
          </p>
          <div className="row g-4">
            {[
              { icon: <Shield size={28} />, title: 'Secure Payments', desc: 'Your transactions are protected with enterprise-grade security' },
              { icon: <CreditCard size={28} />, title: 'Flexible Billing', desc: 'Pay monthly or annually with discounts on annual plans' },
              { icon: <Star size={28} />, title: 'Premium Support', desc: 'Get priority support with faster response times' },
              { icon: <DollarSign size={28} />, title: 'Money Back Guarantee', desc: '30-day money-back guarantee on all packages' }
            ].map((item, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div 
                  className="card h-100 border-0 rounded-4 text-center p-3"
                  style={{ 
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(240,89,31,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <div className="card-body">
                    <div className="mb-3" style={{ color: '#f0591f' }}>{item.icon}</div>
                    <h5 className="fw-bold mb-2" style={{ color: 'white' }}>{item.title}</h5>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5" style={{ background: '#0f172a' }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-2" style={{ color: 'white' }}>Frequently Asked Questions</h2>
          <p className="text-center mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Got questions? We've got answers
          </p>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="card mb-3 border-0 rounded-3 overflow-hidden"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-2" style={{ color: 'white' }}>{faq.question}</h6>
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f0591f 0%, #e04a1a 100%)', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
          <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Choose your package and start growing your business today. 
            All packages include a 14-day free trial!
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/signup" className="btn btn-lg px-5" style={{ background: 'white', color: '#f0591f', border: 'none', fontWeight: 600 }}>
              Start Free Trial
            </Link>
            <Link to="/contact-us" className="btn btn-lg px-5" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.5)', fontWeight: 600 }}>
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      <style>{`
        .rounded-bl-3 {
          border-bottom-left-radius: 0.75rem;
        }
      `}</style>
    </>
  );
};

export default PricingPackages;
