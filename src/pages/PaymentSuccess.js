import React from 'react'
import { Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// GrapeTask Dark Theme Colors
const GRAPE_TASK_THEME = {
  backgrounds: {
    mainBg: "#020617",
    cardBg: "rgba(255, 255, 255, 0.02)",
    cardBgActive: "rgba(255, 255, 255, 0.04)"
  },
  accents: {
    primaryOrange: "#f0591f",
    secondaryBlueBlur: "rgba(59, 130, 246, 0.05)"
  },
  text: {
    pureWhite: "#ffffff",
    pureBlack: "#000000",
    lightGrayHover: "#d4d4d8",
    mediumGrayTitle: "#a1a1aa",
    bodyGrayText: "#71717a",
    darkGrayNumber: "#52525b"
  },
  borders: {
    lightBorder: "rgba(255, 255, 255, 0.06)",
    mediumBorder: "rgba(255, 255, 255, 0.07)",
    orangeBorderActive: "rgba(240, 89, 31, 0.4)"
  }
};

const PaymentSuccess = () => {
  return (
    <>
      <Navbar FirstNav='none' />
      <div 
        className="container-fluid pt-5 pb-5"
        style={{
          backgroundColor: GRAPE_TASK_THEME.backgrounds.mainBg,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-6 col-md-8 col-12">
              <div style={{ marginBottom: '40px' }}>
                <div 
                  style={{
                    fontSize: '80px',
                    marginBottom: '20px',
                    color: GRAPE_TASK_THEME.accents.primaryOrange,
                    animation: 'pulse 2s infinite'
                  }}
                >
                  ✓
                </div>
                <h2 
                  style={{
                    fontSize: '36px',
                    fontWeight: '600',
                    color: GRAPE_TASK_THEME.text.pureWhite,
                    marginBottom: '16px',
                    fontFamily: 'poppins, sans-serif'
                  }}
                >
                  Order Placed Successfully!
                </h2>
              </div>

              <div
                className='rounded-3 p-lg-5 p-md-4 p-4'
                style={{
                  backgroundColor: GRAPE_TASK_THEME.backgrounds.cardBg,
                  border: `1px solid ${GRAPE_TASK_THEME.borders.lightBorder}`,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <p 
                  className='font-16 font-500'
                  style={{
                    color: GRAPE_TASK_THEME.text.lightGrayHover,
                    marginBottom: '24px',
                    lineHeight: '1.6'
                  }}
                >
                  Thank you for choosing GrapeTask! Your order has been successfully placed. 
                  Please keep checking your order section for updates about your order status.
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <p style={{ color: GRAPE_TASK_THEME.text.bodyGrayText, fontSize: '13px' }}>
                    Order details have been sent to your email address.
                  </p>
                </div>

                <Link to='/order' style={{ textDecoration: 'none' }}>
                  <button 
                    type='button'
                    className='mt-3 rounded-2'
                    style={{
                      backgroundColor: GRAPE_TASK_THEME.accents.primaryOrange,
                      color: GRAPE_TASK_THEME.text.pureWhite,
                      border: 'none',
                      padding: '12px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 8px 16px rgba(240, 89, 31, 0.3)`
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e04a1a';
                      e.target.style.boxShadow = `0 12px 24px rgba(240, 89, 31, 0.4)`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = GRAPE_TASK_THEME.accents.primaryOrange;
                      e.target.style.boxShadow = `0 8px 16px rgba(240, 89, 31, 0.3)`;
                    }}
                  >
                    Go to Orders
                  </button>
                </Link>
              </div>

              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.7; }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentSuccess
