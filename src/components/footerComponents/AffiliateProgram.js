import { DollarSign, Gift, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const AffiliateProgram = () => {
  const bidRate = '1 Bid = Rs 15';

  const benefits = [
    {
      icon: <Gift size={32} style={{ color: '#f16437' }} />,
      title: 'Level 1 – Direct Referral',
      description: 'When someone joins using your link',
      amount: '50 Bids'
    },
    {
      icon: <Users size={32} style={{ color: '#f16437' }} />,
      title: 'Level 2 – Second Level',
      description: 'When your referral brings a new user',
      amount: '25 Bids'
    },
    {
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />,
      title: 'Level 3 – Third Level',
      description: 'When that user brings another',
      amount: '12 Bids'
    },
    {
      icon: <DollarSign size={32} style={{ color: '#f16437' }} />,
      title: 'Bid Value',
      description: 'Use bids to place proposals on jobs',
      amount: bidRate
    }
  ];

  const referralLevels = [
    { level: 'Level 1', bids: '50 Bids', when: 'Your direct referral (B) joins' },
    { level: 'Level 2', bids: '25 Bids', when: 'B’s referral (C) joins' },
    { level: 'Level 3', bids: '12 Bids', when: 'C’s referral (D) joins' }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Affiliate Program</h1>
              <p className="lead mb-4">
                Refer friends and earn bids. <strong>1 Bid = Rs 15.</strong> The more people in your referral chain (A → B → C → D…), the more bids you earn at every level. This loop keeps running.
              </p>
              <Link to="/signup" className="btn btn-lg px-4" style={{ background: 'white', color: '#f16437', border: 'none' }}>
                Join Program
              </Link>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-5 bg-white bg-opacity-10 rounded-4">
                <DollarSign className="mb-3" size={80} style={{ color: 'white' }} />
                <h3 className="mb-0">1 Bid = Rs 15</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Earn Bids at Every Level</h2>
          <div className="row g-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {benefit.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{benefit.title}</h5>
                    <p className="text-muted mb-3">{benefit.description}</p>
                    <p className="fw-bold mb-0" style={{ color: '#f16437' }}>{benefit.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Levels – A → B → C → D loop */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Referral Rewards (Bids)</h2>
          <p className="text-center text-muted mb-4">1 Bid = Rs 15. When new users join through your chain, you earn bids at each level. The loop continues for every new user (A, B, C, D…).</p>
          <div className="row g-4">
            {referralLevels.map((item, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4 text-center">
                    <h3 className="fw-bold mb-3" style={{ color: '#f16437' }}>{item.level}</h3>
                    <h2 className="display-5 fw-bold mb-3" style={{ color: '#f16437' }}>{item.bids}</h2>
                    <p className="text-muted mb-0">{item.when}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works – A, B, C, D loop */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">How the Referral Loop Works</h2>
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                  <p className="mb-4"><strong>1 Bid = Rs 15.</strong> A, B, C, D are users in the referral chain. The loop runs for every new join.</p>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3 d-flex align-items-start">
                      <span className="badge rounded-pill me-3" style={{ background: '#f16437', minWidth: '28px' }}>1</span>
                      <div>
                        <strong>B joins using A’s link</strong> → A gets <strong>50 Bids</strong>.
                      </div>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <span className="badge rounded-pill me-3" style={{ background: '#f16437', minWidth: '28px' }}>2</span>
                      <div>
                        <strong>C joins using B’s link</strong> → B gets <strong>50 Bids</strong>, A gets <strong>25 Bids</strong> (second time).
                      </div>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <span className="badge rounded-pill me-3" style={{ background: '#f16437', minWidth: '28px' }}>3</span>
                      <div>
                        <strong>D joins using C’s link</strong> → C gets <strong>50 Bids</strong>, B gets <strong>25 Bids</strong>, A gets <strong>12 Bids</strong>.
                      </div>
                    </li>
                    <li className="d-flex align-items-start">
                      <span className="badge rounded-pill me-3" style={{ background: '#f16437', minWidth: '28px' }}>∞</span>
                      <div>
                        <strong>Loop continues:</strong> Every new user (E, F, G…) in the chain earns bids for the users above them at Level 1 (50), Level 2 (25), Level 3 (12).
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Earn Bids?</h2>
          <p className="lead mb-4">
            1 Bid = Rs 15. Share your link, grow your chain (A → B → C → D…), and earn 50, 25, and 12 bids at each level. The loop keeps running.
          </p>
          <Link to="/signup" className="btn btn-lg px-5" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Join Affiliate Program
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AffiliateProgram;
