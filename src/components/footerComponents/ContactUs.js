import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import Footer from "../Footer";
import Navbar from "../Navbar";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Mail size={32} style={{ color: '#f16437' }} />,
      title: 'Email Us',
      info: 'grapetask786@gmail.com',
      link: 'mailto:grapetask786@gmail.com'
    },
    {
      icon: <Phone size={32} style={{ color: '#f16437' }} />,
      title: 'Call Us',
      info: '+92 341 1228760',
      link: 'tel:+923411228760'
    },
    {
      icon: <MapPin size={32} style={{ color: '#f16437' }} />,
      title: 'Visit Us',
      info: 'City Daharki in Sindh Pakistan',
      link: '#'
    }
  ];

  return (
    <>
      <Navbar FirstNav="none" />
      
      {/* Hero Section */}
      <section className="py-5 contact-hero" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4 fade-in">Contact Us</h1>
          <p className="lead mb-4">
            Have questions? We're here to help. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-lg-4 col-md-6 contact-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body p-4">
                    <div className="mb-3 contact-icon">
                      {info.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{info.title}</h5>
                    <a href={info.link} className="text-decoration-none" style={{ color: '#f16437' }}>
                      {info.info}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm form-animate">
                <div className="card-body p-5">
                  <h2 className="text-center mb-4 fw-bold">Send Us a Message</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold">Subject</label>
                        <input
                          type="text"
                          className="form-control"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold">Message</label>
                        <textarea
                          className="form-control"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}
                        ></textarea>
                      </div>
                      <div className="col-12 text-center">
                        <button
                          type="submit"
                          className="btn btn-lg px-5 btn-submit"
                          style={{ background: '#f16437', color: 'white', border: 'none' }}
                        >
                          <Send className="me-2" size={20} />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Frequently Asked Questions</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item mb-3 border-0 shadow-sm">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How can I get help with my account?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      You can contact our support team via email at grapetask786@gmail.com or use the contact form above.
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-3 border-0 shadow-sm">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      What are your business hours?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Our support team is available 24/7 to assist you with any questions or issues.
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-3 border-0 shadow-sm">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      How quickly will I receive a response?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      We typically respond to all inquiries within 24 hours during business days.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .contact-hero { animation: fadeIn 0.8s ease-out; }
        .fade-in { animation: fadeIn 0.8s ease-out; }
        .contact-card { animation: slideIn 0.6s ease-out forwards; opacity: 0; transition: transform 0.3s; }
        .contact-card:hover { transform: translateY(-10px); }
        .contact-icon { animation: float 2s ease-in-out infinite; }
        .contact-card:hover .contact-icon { animation: none; transform: scale(1.2); }
        .form-animate { animation: fadeIn 0.8s ease-out; }
        .btn-submit { transition: all 0.3s; }
        .btn-submit:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(241, 100, 55, 0.4); }
      `}</style>
    </>
  );
};

export default ContactUs;
