"use client";
import React, { useState, useEffect, useMemo } from "react";

  const FAQ_DATA = {
    "General": [
      { 
        q: "What is GrapeTask and how does the ecosystem work?", 
        a: "GrapeTask is a managed freelance marketplace. Unlike traditional platforms, we provide a dedicated Business Developer (BD) to act as a bridge between clients and freelancers, ensuring professional project management and guaranteed quality delivery." 
      },
      { 
        q: "How is GrapeTask different from other freelance platforms?", 
        a: "We eliminate the 'bidding war.' Clients don't have to scroll through thousands of unqualified profiles. Instead, our expert BDs hand-pick the best talent for each specific project, saving time and ensuring high-end results." 
      },
      { 
        q: "What is the role of GrapeTask as a 'Collaborator'?", 
        a: "In case of any technical dispute or project bottleneck, GrapeTask steps in as a collaborator. We mediate between the client, the BD, and the freelancer to resolve issues and ensure the project is successfully completed." 
      }
    ],
    "For Clients": [
      { 
        q: "Who will be my point of contact for my project?", 
        a: "You will be assigned a dedicated Business Developer (BD). They handle the communication, requirement gathering, and freelancer management, so you only have to focus on the final result." 
      },
      { 
        q: "How do I know the freelancers are experts?", 
        a: "Our BDs are trained to vet every freelancer's portfolio and 'Gigs' before assigning a project. We only match 'Expert Tier' talent with client requirements to maintain a 95%+ satisfaction rate." 
      },
      { 
        q: "What happens if I encounter an issue with the delivery?", 
        a: "Client satisfaction is our priority. If there is an issue, your BD will coordinate a fix. If the problem persists, GrapeTask support acts as a collaborator to ensure a fair resolution or revision." 
      }
    ],
    "For Freelancers": [
      { 
        q: "How do I get projects without bidding?", 
        a: "On GrapeTask, you don't waste time bidding. Simply create your profile and post your 'Gigs.' Our Business Developers search the marketplace for experts and will reach out to you directly when your skills match a client's project." 
      },
      { 
        q: "What are the requirements to be hired by a BD?", 
        a: "Our BDs look for high-quality Gigs, a professional portfolio, and a history of timely delivery. Maintaining a high rating on your profile increases your chances of being selected for premium projects." 
      },
      { 
        q: "When and how do I receive my payments?", 
        a: "Once you complete the task and the BD delivers it to the client, the payment is processed. After the client’s approval, your earnings are reflected in your GrapeTask wallet for withdrawal." 
      }
    ],
    "For Business Developers": [
      { 
        q: "What are the core responsibilities of a BD?", 
        a: "A Business Developer is the engine of our platform. Your role is to acquire clients, finalize project scopes, select the most qualified freelancer from our marketplace, and ensure a seamless delivery." 
      },
      { 
        q: "How do I select the right freelancer for a client?", 
        a: "You have access to the entire GrapeTask Talent Marketplace. You can evaluate freelancers based on their Gigs, past performance, and specialized skill sets to ensure they are the right fit for your client." 
      },
      { 
        q: "How do I earn as a Business Developer on GrapeTask?", 
        a: "BDs earn a professional commission on every project they successfully manage and deliver. Your earning potential grows as you build a recurring client base and a reliable network of expert freelancers." 
      }
    ]
  };

export default function FAQ() {
  const categories = useMemo(() => Object.keys(FAQ_DATA), []);
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [openIndex, setOpenIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const handleTab = (tab) => {
    setActiveTab(tab);
    setOpenIndex(0);
  };

  const handleToggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        .gt-faq-wrap {
          background: #020617; /* mainBg */
          min-height: 100vh;
          padding: 90px 0;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .gt-blob1 {
          position: absolute; top: 0; left: 25%;
          width: 500px; height: 500px;
          background: rgba(240, 89, 31, 0.06); /* primaryOrange glow */
          filter: blur(120px);
          pointer-events: none; border-radius: 50%;
        }
        .gt-blob2 {
          position: absolute; bottom: 0; right: 25%;
          width: 400px; height: 400px;
          background: rgba(59, 130, 246, 0.05); /* secondaryBlueBlur */
          filter: blur(120px);
          pointer-events: none; border-radius: 50%;
        }

        /* Badge */
        .gt-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 16px; border-radius: 100px;
          background: rgba(240, 89, 31, 0.1); 
          border: 1px solid rgba(240, 89, 31, 0.25);
          color: #f0591f; /* primaryOrange */
          font-size: 11px;
          font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 18px;
        }

        /* Title */
        .gt-faq-title {
          font-size: clamp(26px, 5vw, 46px);
          font-weight: 800; color: #ffffff; /* pureWhite */
          letter-spacing: -0.03em; line-height: 1.1;
          margin-bottom: 14px;
        }
        .gt-faq-title span { color: #f0591f; /* primaryOrange */ }
        .gt-faq-sub {
          color: #71717a; /* bodyGrayText */
          font-size: 15px;
          max-width: 520px; margin: 0 auto 44px;
          line-height: 1.7;
        }

        /* Tabs */
        .gt-tabs-wrap {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 5px;
          padding: 6px;
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          border-radius: 28px;
          width: fit-content;
          margin: 0 auto 40px;
        }
        .gt-tab {
          position: relative;
          padding: 9px 20px;
          font-size: 13px; font-weight: 700;
          border-radius: 20px; border: none;
          background: none; cursor: pointer;
          color: #71717a; /* bodyGrayText */
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: color 0.25s, background 0.25s;
          outline: none;
        }
        .gt-tab:hover { color: #d4d4d8; /* lightGrayHover */ }
        .gt-tab.active {
          background: #f0591f; /* primaryOrange */
          color: #ffffff; /* pureWhite */
          box-shadow: 0 6px 18px rgba(240, 89, 31, 0.3);
        }

        /* Accordion Item */
        .gt-acc-item {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07); /* mediumBorder */
          background: transparent;
          margin-bottom: 10px;
          overflow: hidden;
          transition: border-color 0.35s, background 0.35s, box-shadow 0.35s;
        }
        .gt-acc-item.open {
          border-color: rgba(240, 89, 31, 0.4); /* orangeBorderActive */
          background: rgba(255, 255, 255, 0.04); /* cardBgActive */
          box-shadow: 0 10px 30px -10px rgba(240, 89, 31, 0.15);
        }

        .gt-acc-btn {
          width: 100%; display: flex;
          align-items: center; justify-content: space-between;
          padding: 18px 22px;
          background: none; border: none;
          cursor: pointer; outline: none; text-align: left;
        }
        .gt-acc-left { display: flex; align-items: center; gap: 14px; }

        .gt-acc-num {
          font-size: 11px; font-weight: 700;
          font-family: monospace; color: #52525b; /* darkGrayNumber */
          min-width: 20px; transition: color 0.3s;
        }
        .gt-acc-item.open .gt-acc-num { color: #f0591f; /* primaryOrange */ }

        .gt-acc-q {
          font-size: 14px; font-weight: 700;
          color: #a1a1aa; /* mediumGrayTitle */
          letter-spacing: -0.015em;
          transition: color 0.3s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .gt-acc-item.open .gt-acc-q { color: #ffffff; /* pureWhite */ }

        .gt-acc-icon {
          flex-shrink: 0; margin-left: 14px;
          color: #52525b; /* darkGrayNumber */ 
          transition: transform 0.35s, color 0.3s;
        }
        .gt-acc-item.open .gt-acc-icon {
          transform: rotate(180deg); color: #f0591f; /* primaryOrange */
        }

        .gt-acc-body {
          padding: 0 22px 20px;
          font-size: 14px; color: #71717a; /* bodyGrayText */
          line-height: 1.7; font-weight: 500;
        }
        .gt-acc-line {
          height: 2px; width: 32px;
          background: #f0591f; /* primaryOrange */
          margin-bottom: 12px; border-radius: 2px;
        }

        /* Skeleton */
        .gt-sk {
          height: 70px;
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
          border-radius: 18px; margin-bottom: 10px;
          animation: gtPulse 1.4s infinite;
        }
        @keyframes gtPulse {
          0%,100%{opacity:1} 50%{opacity:0.3}
        }

        /* CTA */
        .gt-cta {
          margin-top: 56px; padding: 28px 32px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.02); /* cardBg */
          border: 1px solid rgba(255, 255, 255, 0.06); /* lightBorder */
        }
        .gt-cta h5 {
          color: #ffffff; /* pureWhite */ 
          font-weight: 700;
          font-size: 16px; margin: 0 0 5px;
        }
        .gt-cta p { color: #71717a; /* bodyGrayText */ font-size: 13px; margin: 0; }

        .gt-contact-btn {
          padding: 12px 24px;
          background: #ffffff; /* pureWhite */ 
          color: #000000; /* pureBlack */
          font-weight: 800; border-radius: 14px;
          border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.25s, color 0.25s, transform 0.15s;
          white-space: nowrap;
        }
        .gt-contact-btn:hover { background: #f0591f; /* primaryOrange */ color: #ffffff; /* pureWhite */ }
        .gt-contact-btn:active { transform: scale(0.96); }
      `}</style>

      <div className="gt-faq-wrap">
        <div className="gt-blob1" />
        <div className="gt-blob2" />

        <div className="container" style={{ maxWidth: 820, position: "relative", zIndex: 10 }}>

          {/* Header */}
          <div className="text-center">
            <div className="gt-badge">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Support Center
            </div>
            <h2 className="gt-faq-title">
              Commonly Asked <span>Questions.</span>
            </h2>
            <p className="gt-faq-sub">
              Everything you need to know about GrapeTask and our global learning ecosystem.
            </p>
          </div>

          {/* Tabs */}
          <div className="gt-tabs-wrap">
            {categories.map((tab) => (
              <button
                key={tab}
                className={`gt-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => handleTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div style={{ minHeight: 360 }}>
            {isLoading ? (
              <>
                <div className="gt-sk" />
                <div className="gt-sk" />
                <div className="gt-sk" />
              </>
            ) : (
              FAQ_DATA[activeTab].map((item, i) => (
                <div
                  key={`${activeTab}-${i}`}
                  className={`gt-acc-item${openIndex === i ? " open" : ""}`}
                >
                  <button
                    className="gt-acc-btn"
                    onClick={() => handleToggle(i)}
                  >
                    <div className="gt-acc-left">
                      <span className="gt-acc-num">
                        {i < 9 ? `0${i + 1}` : i + 1}
                      </span>
                      <span className="gt-acc-q">{item.q}</span>
                    </div>
                    <svg
                      className="gt-acc-icon"
                      width="19" height="19"
                      fill="none" stroke="currentColor"
                      strokeWidth="2.5" viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {openIndex === i && (
                    <div className="gt-acc-body">
                      <div className="gt-acc-line" />
                      {item.a}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>


        </div>
      </div>
    </>
  );
}