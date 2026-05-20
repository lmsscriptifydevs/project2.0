import { CheckCircle, Clock, DollarSign, Rocket, Search, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from "../Footer";
import Navbar from "../Navbar";

const ProjectCatalog = () => {
  const categories = [
    {
      icon: <Zap className="icon-size text-warning" />,
      title: 'Web Development',
      count: '2,500+',
      description: 'Custom websites, e-commerce, web apps',
      popular: true
    },
    {
      icon: <Star className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Graphic Design',
      count: '1,800+',
      description: 'Logos, branding, social media graphics',
      popular: true
    },
    {
      icon: <Rocket className="icon-size text-success" />,
      title: 'Digital Marketing',
      count: '1,200+',
      description: 'SEO, social media, content marketing',
      popular: false
    },
    {
      icon: <Search className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Writing & Translation',
      count: '3,000+',
      description: 'Content writing, copywriting, translation',
      popular: false
    },
    {
      icon: <Clock className="icon-size text-danger" />,
      title: 'Video & Animation',
      count: '900+',
      description: 'Video editing, animation, motion graphics',
      popular: false
    },
    {
      icon: <DollarSign className="icon-size text-secondary" />,
      title: 'Business Services',
      count: '1,500+',
      description: 'Virtual assistance, data entry, consulting',
      popular: false
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="icon-size text-success" />,
      title: 'Fixed Pricing',
      description: 'No surprises. Know exactly what you\'ll pay upfront.'
    },
    {
      icon: <Clock className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Fast Delivery',
      description: 'Get started immediately with pre-scoped projects.'
    },
    {
      icon: <Star className="icon-size text-warning" />,
      title: 'Quality Guaranteed',
      description: 'All projects are vetted and quality-checked.'
    },
    {
      icon: <Rocket className="icon-size" style={{ color: '#f16437' }} />,
      title: 'Instant Access',
      description: 'Browse and purchase projects in minutes.'
    }
  ];

  const popularProjects = [
    {
      title: 'Professional Logo Design',
      price: '$99',
      delivery: '3 days',
      rating: 4.9,
      reviews: 1250
    },
    {
      title: 'WordPress Website Setup',
      price: '$299',
      delivery: '5 days',
      rating: 4.8,
      reviews: 890
    },
    {
      title: 'Social Media Package',
      price: '$149',
      delivery: '2 days',
      rating: 4.9,
      reviews: 2100
    },
    {
      title: 'SEO Audit & Report',
      price: '$199',
      delivery: '4 days',
      rating: 4.7,
      reviews: 650
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
              <h1 className="display-4 fw-bold mb-4">Project Catalog</h1>
              <p className="lead mb-4">
                Browse ready-to-buy projects with fixed pricing. Get started instantly with pre-scoped services from verified professionals.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/freelancers" className="btn btn-lg px-4" style={{ background: 'white', color: '#f16437', border: 'none' }}>
                  Browse Projects
                </Link>
                <Link to="/signup" className="btn btn-lg px-4" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
                  Get Started
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-5 bg-white bg-opacity-10 rounded-4">
                <h3 className="mb-3">2,500+</h3>
                <p className="mb-0">Ready-to-buy Projects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Browse by Category</h2>
          <div className="row g-4">
            {categories.map((category, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 shadow-sm border-0 hover-shadow">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      {category.icon}
                      <h5 className="mb-0 ms-3">{category.title}</h5>
                      {category.popular && (
                        <span className="badge bg-warning text-dark ms-auto">Popular</span>
                      )}
                    </div>
                    <p className="text-muted mb-2">{category.description}</p>
                    <p className="fw-bold mb-0" style={{ color: '#f16437' }}>{category.count} Projects</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Choose Project Catalog?</h2>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="text-center p-4">
                  <div className="mb-3 d-flex justify-content-center">
                    {feature.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Projects Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Popular Projects</h2>
          <div className="row g-4">
            {popularProjects.map((project, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">{project.title}</h5>
                    <div className="d-flex align-items-center mb-3">
                      <Star className="text-warning me-1" size={18} fill="currentColor" />
                      <span className="fw-bold me-2">{project.rating}</span>
                      <span className="text-muted">({project.reviews} reviews)</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h4 mb-0" style={{ color: '#f16437' }}>{project.price}</span>
                      <span className="text-muted">
                        <Clock size={16} className="me-1" />
                        {project.delivery}
                      </span>
                    </div>
                    <Link to="/freelancers" className="btn w-100" style={{ background: '#f16437', color: 'white', border: 'none' }}>
                      View Project
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
          <p className="lead mb-4">
            Browse thousands of ready-to-buy projects and get your work done faster.
          </p>
          <Link to="/freelancers" className="btn btn-lg px-5" style={{ background: 'white', color: '#f16437', border: 'none' }}>
            Explore Project Catalog
          </Link>
  </div>
      </section>

      <Footer />
      
      <style>{`
        .hover-shadow {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        .icon-size {
          width: 40px;
          height: 40px;
        }
      `}</style>
    </>
  );
};

export default ProjectCatalog;
