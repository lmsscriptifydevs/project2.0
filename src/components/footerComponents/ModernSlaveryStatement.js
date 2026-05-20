import Footer from "../Footer";
import Navbar from "../Navbar";

const ModernSlaveryStatement = () => {
  return (
    <>
      <Navbar FirstNav="none" />
      <section className="py-5" style={{ background: '#f16437', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Modern Slavery Statement</h1>
          <p className="lead mb-4">Our commitment to preventing modern slavery and human trafficking</p>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h2 className="fw-bold mb-4">Statement</h2>
                  <p className="lead text-muted mb-4">
                    GrapeTask is committed to preventing acts of modern slavery and human trafficking in our business operations and supply chains.
                  </p>
                  <p className="text-muted mb-4">
                    We have zero tolerance for modern slavery and human trafficking. We are committed to acting ethically and with integrity 
                    in all our business relationships and to implementing and enforcing effective systems and controls to ensure slavery and 
                    human trafficking is not taking place anywhere in our business or supply chains.
                  </p>
                  <p className="text-muted mb-4">
                    This statement is made pursuant to section 54 of the Modern Slavery Act 2015 and constitutes our slavery and human 
                    trafficking statement for the current financial year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ModernSlaveryStatement;
