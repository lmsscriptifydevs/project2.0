import { BarChart, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const InvestorRelations = () => {
  const reports = [
    {
      icon: <FileText size={32} style={{ color: '#f16437' }} />,
      title: 'Annual Reports',
      description: 'Comprehensive annual financial reports',
      year: '2024'
    },
    {
      icon: <BarChart size={32} style={{ color: '#f16437' }} />,
      title: 'Quarterly Earnings',
      description: 'Quarterly financial performance updates',
      year: 'Q4 2024'
    },
    {
      icon: <TrendingUp size={32} style={{ color: '#f16437' }} />,
      title: 'Investor Presentations',
      description: 'Strategic updates and growth metrics',
      year: 'Latest'
    },
    {
      icon: <DollarSign size={32} style={{ color: '#f16437' }} />,
      title: 'Financial Statements',
      description: 'Detailed financial statements and disclosures',
      year: '2024'
    }
  ];

  const metrics = [
    { label: 'Revenue Growth', value: '45%', trend: 'up' },
    { label: 'Active Users', value: '4M+', trend: 'up' },
    { label: 'Market Share', value: '12%', trend: 'up' },
    { label: 'Revenue', value: '$500M+', trend: 'up' }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 hero-slide-in" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 slide-in-left">
              <h1 className="display-4 fw-bold mb-4">Investor Relations</h1>
              <p className="lead mb-4">
                Stay informed about GrapeTask's financial performance, strategic initiatives, and growth metrics.
              </p>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0 slide-in-right">
              <div className="p-5 bg-white bg-opacity-10 rounded-4 chart-animate">
                <BarChart className="mb-3" size={80} />
                <h3 className="mb-0">Financial Reports</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section with Counter Animation */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in">Key Metrics</h2>
          <div className="row g-4">
            {metrics.map((metric, index) => (
              <div key={index} className="col-lg-3 col-md-6 metric-card" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="metric-value">
                      <h2 className="display-4 fw-bold mb-2" style={{ color: '#f16437' }}>{metric.value}</h2>
                    </div>
                    <p className="text-muted mb-0">{metric.label}</p>
                    <TrendingUp className="mt-2" size={20} style={{ color: '#00ac4f' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold fade-in">Financial Reports</h2>
          <div className="row g-4">
            {reports.map((report, index) => (
              <div key={index} className="col-lg-3 col-md-6 report-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4 text-center">
                    <div className="mb-3 icon-bounce">
                      {report.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{report.title}</h5>
                    <p className="text-muted mb-3">{report.description}</p>
                    <p className="fw-bold mb-3" style={{ color: '#f16437' }}>{report.year}</p>
                    <button className="btn btn-sm" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4 fade-in">Investor Inquiries</h2>
          <p className="lead text-muted mb-4">
            For investor relations inquiries, please contact our investor relations team.
          </p>
          <Link to="/contact-us" className="btn btn-lg px-5 btn-pulse" style={{ background: '#f16437', color: 'white', border: 'none' }}>
            Contact IR Team
          </Link>
        </div>
      </section>

      <Footer />
      
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-slide-in {
          animation: fadeIn 0.8s ease-out;
        }

        .slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }

        .slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }

        .fade-in {
          animation: fadeIn 1s ease-out;
        }

        .chart-animate {
          animation: pulse 3s ease-in-out infinite;
        }

        .metric-card {
          animation: countUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .metric-value {
          animation: countUp 1s ease-out;
        }

        .report-card {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
          transition: transform 0.3s ease;
        }

        .report-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }

        .icon-bounce {
          animation: bounce 2s infinite;
        }

        .report-card:hover .icon-bounce {
          animation: none;
        }

        .btn-pulse {
          animation: pulse 2s infinite;
        }

        .btn-pulse:hover {
          animation: none;
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};

export default InvestorRelations;
