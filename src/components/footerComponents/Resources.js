import { Book, Download, FileText, HelpCircle, PlayCircle, TrendingUp, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const Resources = () => {
  const resourceCategories = [
    {
      icon: <Book className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Guides & Tutorials',
      description: 'Step-by-step guides to help you succeed',
      count: '50+',
      items: [
        'How to Hire Your First Freelancer',
        'Building a Remote Team Guide',
        'Freelancer Pricing Guide',
        'Project Management Best Practices'
      ]
    },
    {
      icon: <Video className="icon-size text-danger" />,
      title: 'Video Tutorials',
      description: 'Watch and learn from expert tutorials',
      count: '100+',
      items: [
        'Getting Started Video Series',
        'Advanced Hiring Strategies',
        'Freelancer Success Tips',
        'Platform Features Walkthrough'
      ]
    },
    {
      icon: <FileText className="icon-size text-success" />,
      title: 'Templates & Tools',
      description: 'Download ready-to-use templates',
      count: '75+',
      items: [
        'Job Posting Templates',
        'Contract Templates',
        'Project Brief Templates',
        'Invoice Templates'
      ]
    },
    {
      icon: <TrendingUp className="icon-size text-warning" />,
      title: 'Industry Reports',
      description: 'Insights and trends in freelancing',
      count: '20+',
      items: [
        'Freelancing Market Trends 2024',
        'Remote Work Statistics',
        'Top Skills in Demand',
        'Salary Benchmark Reports'
      ]
    }
  ];

  const popularResources = [
    {
      title: 'Complete Guide to Hiring Freelancers',
      type: 'Guide',
      icon: <Book style={{ color: '#f16437' }} />,
      description: 'Everything you need to know about finding and hiring the right talent.',
      readTime: '15 min read'
    },
    {
      title: 'Freelancer Success Playbook',
      type: 'Guide',
      icon: <TrendingUp className="text-success" />,
      description: 'Proven strategies to build a successful freelancing career.',
      readTime: '20 min read'
    },
    {
      title: 'Remote Team Management Guide',
      type: 'Guide',
      icon: <HelpCircle style={{ color: '#f16437' }} />,
      description: 'Best practices for managing distributed teams effectively.',
      readTime: '12 min read'
    },
    {
      title: 'Pricing Your Services Right',
      type: 'Guide',
      icon: <FileText className="text-warning" />,
      description: 'Learn how to price your services competitively and fairly.',
      readTime: '10 min read'
    }
  ];

  const tools = [
    {
      title: 'Job Posting Builder',
      description: 'Create effective job postings that attract top talent',
      icon: <FileText style={{ color: '#f16437' }} size={32} />
    },
    {
      title: 'Rate Calculator',
      description: 'Calculate fair rates for your services or projects',
      icon: <TrendingUp className="text-success" size={32} />
    },
    {
      title: 'Contract Generator',
      description: 'Generate professional contracts in minutes',
      icon: <Download className="text-warning" size={32} />
    },
    {
      title: 'Project Timeline Planner',
      description: 'Plan and track your project timelines effectively',
      icon: <PlayCircle style={{ color: '#f16437' }} size={32} />
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Resources</h1>
              <p className="lead mb-4">
                Everything you need to succeed on GrapeTask. Guides, tutorials, templates, and tools to help you achieve your goals.
              </p>
              <Link to="/blog" className="btn btn-lg px-4" style={{ background: 'white', color: '#f16437', border: 'none' }}>
                Explore Resources
              </Link>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-5 bg-white bg-opacity-10 rounded-4">
                <Book className="mb-3" size={80} />
                <h3 className="mb-0">Knowledge Hub</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Browse Resources</h2>
          <div className="row g-4">
            {resourceCategories.map((category, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {category.icon}
                    </div>
                    <h5 className="fw-bold mb-2">{category.title}</h5>
                    <p className="text-muted small mb-3">{category.description}</p>
                    <p className="fw-bold mb-3" style={{ color: '#f16437' }}>{category.count} Resources</p>
                    <ul className="list-unstyled mb-0">
                      {category.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="mb-2">
                          <small className="text-muted">• {item}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Resources Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Popular Resources</h2>
          <div className="row g-4">
            {popularResources.map((resource, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {resource.icon}
                    </div>
                    <span className="badge mb-2" style={{ backgroundColor: '#f16437', color: 'white' }}>{resource.type}</span>
                    <h5 className="fw-bold mb-3">{resource.title}</h5>
                    <p className="text-muted small mb-3">{resource.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">{resource.readTime}</small>
                      <Link to="/blog" className="btn btn-sm" style={{ border: '1px solid #f16437', color: '#f16437', backgroundColor: 'transparent' }}>
                        Read
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Free Tools</h2>
          <div className="row g-4">
            {tools.map((tool, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      {tool.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{tool.title}</h5>
                    <p className="text-muted mb-3">{tool.description}</p>
                    <Link to="/business-tools" className="btn" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                      Use Tool
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Quick Links</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="row g-3">
                <div className="col-md-6">
                  <Link to="/how-to-hire" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none" style={{ color: '#333' }}>
                    <h6 className="fw-bold mb-1" style={{ color: '#f16437' }}>How to Hire</h6>
                    <small className="text-muted">Learn the best practices for hiring freelancers</small>
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link to="/how-to-find-work" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none" style={{ color: '#333' }}>
                    <h6 className="fw-bold mb-1" style={{ color: '#f16437' }}>How to Find Work</h6>
                    <small className="text-muted">Tips for freelancers to find and win projects</small>
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link to="/help-support" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none" style={{ color: '#333' }}>
                    <h6 className="fw-bold mb-1" style={{ color: '#f16437' }}>Help & Support</h6>
                    <small className="text-muted">Get help with your questions and issues</small>
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link to="/blog" className="d-block p-3 bg-white rounded shadow-sm text-decoration-none" style={{ color: '#333' }}>
                    <h6 className="fw-bold mb-1" style={{ color: '#f16437' }}>Blog</h6>
                    <small className="text-muted">Read the latest articles and insights</small>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Need More Help?</h2>
          <p className="lead mb-4">
            Our support team is here to help you succeed.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/help-support" className="btn btn-lg px-5" style={{ background: 'white', color: '#f16437', border: 'none' }}>
              Contact Support
            </Link>
            <Link to="/blog" className="btn btn-lg px-5" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
              Visit Blog
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      <style>{`
        .icon-size {
          width: 40px;
          height: 40px;
        }
      `}</style>
    </>
  );
};

export default Resources;
