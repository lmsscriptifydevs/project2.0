import { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import SidebarLayout from "./sidebarLayout";

export default function AdminPanel() {
  const [selectedSection, setSelectedSection] = useState("dashboard");

  const renderContent = () => {
    switch (selectedSection) {
      case "dashboard":
        return (
          <>
            <h2 className="mb-4">📊 Dashboard Overview</h2>
            <Row className="mb-4">
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Total Users</Card.Title>
                    <Card.Text className="fs-3 fw-bold">1,204</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Total Freelancers</Card.Title>
                    <Card.Text className="fs-3 fw-bold">678</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Total Projects</Card.Title>
                    <Card.Text className="fs-3 fw-bold">312</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Revenue</Card.Title>
                    <Card.Text className="fs-3 fw-bold">$12,430</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card>
              <Card.Header>📌 Recent Activity</Card.Header>
              <Card.Body>
                <ul className="mb-0">
                  <li>✅ Project #452 completed by <strong>Jane Freelancer</strong></li>
                  <li>👥 New user registered: <strong>Alex Dev</strong></li>
                  <li>💼 New project posted: <strong>"Build Landing Page"</strong></li>
                  <li>💸 Payment of <strong>$250</strong> processed</li>
                </ul>
              </Card.Body>
            </Card>
          </>
        );

      case "users":
        return <h2>👥 Manage Users</h2>;
      case "projects":
        return <h2>📁 Project Listings</h2>;
      case "payments":
        return <h2>💳 Payment Transactions</h2>;
      case "settings":
        return <h2>⚙️ Platform Settings</h2>;
      default:
        return <h2>Welcome to Admin Panel</h2>;
    }
  };

  return (
    <SidebarLayout>
      <Container fluid className="mt-4">
        <Row>
          <Col>{renderContent()}</Col>
        </Row>
      </Container>
    </SidebarLayout>
  );
}
