import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AllOrders } from "../../../redux/slices/allOrderSlice";
import SidebarLayout from "../sidebarLayout";

export default function ProjectList() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Fetch all orders for admin
  const { orderDetail = [], isLoading = false } = useSelector(
    (state) => state.allOrder || {}
  );

  // PERF STARTUP: Defer AllOrders until after first paint - UI renders first
  useEffect(() => {
    const fetchOrders = () => {
      dispatch(AllOrders());
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchOrders, { timeout: 500 });
    } else {
      setTimeout(fetchOrders, 0);
    }
  }, [dispatch]);

  // ✅ Filter & Search
  const filteredOrders = orderDetail.filter((order) => {
    const searchString = (
      `${order.id} ${order.title} ${order.client?.name} ${order.expert?.name}`
    ).toLowerCase();

    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarLayout>
      <h4 className="mt-3">Admin Order Management</h4>

      {/* Filters */}
      <Row className="my-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by ID, title, client, expert..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>

      {/* Table */}
      {isLoading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <Alert variant="info">No orders found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Client</th>
              <th>Expert</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.title}</td>
                <td>{order.client?.name || "N/A"}</td>
                <td>{order.expert?.name || "Unassigned"}</td>
                <td>
                  <Badge
                    bg={
                      order.status === "completed"
                        ? "success"
                        : order.status === "pending"
                        ? "warning"
                        : order.status === "cancelled"
                        ? "danger"
                        : "primary"
                    }
                  >
                    {order.status}
                  </Badge>
                </td>
                <td>
                  {/* Replace with actual modals/actions as needed */}
                  <Button variant="outline-primary" size="sm" className="me-1">
                    View
                  </Button>
                  <Button variant="outline-success" size="sm" className="me-1">
                    Assign
                  </Button>
                  <Button variant="outline-warning" size="sm">
                    Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </SidebarLayout>
  );
}
