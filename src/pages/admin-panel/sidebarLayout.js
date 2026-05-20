import { Col, Container, Nav, Row } from "react-bootstrap";
import {
  FaCog,
  FaFolderOpen,
  FaMoneyCheckAlt,
  FaRocketchat,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SidebarLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/users", label: "Manage Users", icon: <FaUsers /> },
    { path: "/admin/blogs", label: "Blog", icon: <FaFolderOpen /> },
    
    { path: "/admin/projects", label: "Projects", icon: <FaFolderOpen /> },
    { path: "/admin/payments", label: "Order Deposits", icon: <FaMoneyCheckAlt /> },
    { path: "/admin/bids", label: "Bids Deposits", icon: <FaMoneyCheckAlt /> },
    { path: "/admin/withdraw", label: "Freelancer Withdraw Requests", icon: <FaMoneyCheckAlt /> },

    
    { path: "/adminInbox", label: "Inbox", icon: <FaRocketchat /> },
    { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
  ];

   const handleLogout = () => {
     localStorage.clear();
     navigate("/");
     window.location.reload();
   };
 

  return (
    <Container fluid>
      <Row>
        <Col
          md={2}
          className="bg-light min-vh-100 d-flex flex-column justify-content-between p-3 border-end"
        >
          <div>
            <h5 className="mb-4">💼 Admin Panel</h5>
            <Nav className="flex-column">
              {navItems.map((item) => (
                <Nav.Item key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link d-flex align-items-center gap-2 py-2 ${
                      location.pathname === item.path
                        ? "active fw-bold text-primary"
                        : "text-dark"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>

          <div>
            <hr />
            <div className="d-flex align-items-center gap-2 mb-2 text-muted">
              <FaUserCircle size={24} />
              <span>Admin</span>
            </div>
            <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </div>
        </Col>

        <Col md={10} className="p-4">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default SidebarLayout;
