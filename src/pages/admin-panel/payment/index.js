import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Image,
  InputGroup,
  Modal,
  OverlayTrigger,
  Pagination,
  Row,
  Spinner,
  Table,
  Toast,
  ToastContainer,
  Tooltip,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { HOST_API } from '../../../config';
import {
  AllOrders,
  ApproveOrderPayment,
  RejectOrderPayment
} from "../../../redux/slices/allOrderSlice";
import SidebarLayout from "../sidebarLayout";

const ITEMS_PER_PAGE = 10;

export default function PaymentVerification() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [receiptBlobUrl, setReceiptBlobUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState({ approve: null, reject: null });
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(280); // Default fallback rate
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState(null);

  const { orderDetail = [], isLoading = false } = useSelector(
    (state) => state.allOrder || {}
  );

  // PERF STARTUP: Defer exchange rate fetch until after first paint - UI renders first
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setRateLoading(true);
      setRateError(null);

      // Try multiple APIs in sequence
      const apiEndpoints = [
        // Free and reliable APIs
        "https://api.frankfurter.app/latest?from=USD&to=PKR",
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
        "https://open.er-api.com/v6/latest/USD"
      ];

      for (let i = 0; i < apiEndpoints.length; i++) {
        try {
          console.log(`Trying API: ${apiEndpoints[i]}`);
          const response = await fetch(apiEndpoints[i], {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            timeout: 5000
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          let rate = null;

          // Parse different API response formats
          if (apiEndpoints[i].includes('frankfurter')) {
            rate = data.rates?.PKR;
          } else if (apiEndpoints[i].includes('fawazahmed0')) {
            rate = data.usd?.pkr;
          } else if (apiEndpoints[i].includes('er-api')) {
            rate = data.rates?.PKR;
          }

          if (rate && typeof rate === 'number' && rate > 0) {
            console.log(`Successfully got rate: ${rate} from ${apiEndpoints[i]}`);
            setExchangeRate(rate);
            setRateError(null);
            setRateLoading(false);
            return; // Success, exit the loop
          } else {
            throw new Error('Invalid rate data');
          }
        } catch (error) {
          console.warn(`API ${i + 1} failed:`, error.message);
          // Continue to next API
        }
      }

      // If all APIs fail, use fallback
      setRateError('All exchange rate APIs failed, using fallback rate');
      setExchangeRate(280); // Conservative fallback
      setRateLoading(false);
    };

    // PERF: Defer exchange rate fetch until after first paint
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchExchangeRate, { timeout: 500 });
    } else {
      setTimeout(fetchExchangeRate, 0);
    }

    // Optional: Refresh rate every hour
    const interval = setInterval(fetchExchangeRate, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to get display name
  const getDisplayName = (user) => {
    if (!user) return "Unassigned";
    return `${user.fname || ''} ${user.lname || ''}`.trim() || "N/A";
  };

  // Currency conversion function
  const convertToPKR = (usdAmount) => {
    const amount = parseFloat(usdAmount) || 0;
    return (amount * exchangeRate).toFixed(2);
  };

  // Format amount display
  const formatAmountDisplay = (order) => {
    const usdAmount = parseFloat(order.price) || 0;
    
    return (
      <Badge bg="light" text="dark" className="fs-6 border">
        ${usdAmount.toFixed(2)}
      </Badge>
    );
  };

  // Tooltip content for amount
  const getAmountTooltip = (order) => {
    const usdAmount = parseFloat(order.price) || 0;
    const pkrAmount = convertToPKR(order.price);
    
    if (rateLoading) {
      return "Loading exchange rate...";
    }

    return `PKR ${parseFloat(pkrAmount).toLocaleString()} (Rate: 1 USD = ${exchangeRate.toFixed(2)} PKR)`;
  };

  // Filter orders
  const filteredOrders = orderDetail.filter((order) => {
    const clientName = getDisplayName(order.client);
    const expertName = getDisplayName(order.seller);
    const bdName = getDisplayName(order.bd);
    
    const matchesSearch = `${order.id} ${clientName} ${expertName} ${bdName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      order.payment_method === "bank_transfer" &&
      order.payment_verified === 0 &&
      order.transfer_receipt_path !== null
    );
  });

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(AllOrders());
  }, [dispatch]);

  const handleViewReceipt = async (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setReceiptBlobUrl(null);
    setReceiptLoading(true);

    if (!order.transfer_receipt_path) {
      showToast("No receipt available for this order.", "error");
      setReceiptLoading(false);
      return;
    }

    try {
      const fileName = order.transfer_receipt_path.split("/").pop();
      const accessToken = localStorage.getItem("accessToken");
      
      const response = await fetch(
        `${HOST_API}files/bank_receipts/${fileName}`,
        {
          method: "GET",
          credentials: "include",
          headers: { Authorization: "Bearer " + accessToken },
        }
      );

      if (!response.ok) throw new Error("Failed to load receipt.");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setReceiptBlobUrl(url);
    } catch (error) {
      console.error("Error loading receipt:", error);
      showToast("Failed to load receipt image.", "error");
    } finally {
      setReceiptLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (receiptBlobUrl) {
      URL.revokeObjectURL(receiptBlobUrl);
      setReceiptBlobUrl(null);
    }
  };

  const handleApprove = async (orderId) => {
    setActionLoading(prev => ({ ...prev, approve: orderId }));
    try {
      await dispatch(ApproveOrderPayment(orderId)).unwrap();
      showToast("Payment approved successfully.", "success");
      setShowModal(false);
      dispatch(AllOrders());
    } catch (error) {
      showToast(error?.message || "Failed to approve payment.", "error");
    } finally {
      setActionLoading(prev => ({ ...prev, approve: null }));
    }
  };

  const handleReject = async (orderId) => {
    setActionLoading(prev => ({ ...prev, reject: orderId }));
    try {
      await dispatch(RejectOrderPayment(orderId)).unwrap();
      showToast("Payment rejected successfully.", "success");
      setShowModal(false);
      dispatch(AllOrders());
    } catch (error) {
      showToast(error?.message || "Failed to reject payment.", "error");
    } finally {
      setActionLoading(prev => ({ ...prev, reject: null }));
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const downloadReceipt = async () => {
    if (!receiptBlobUrl || !selectedOrder) return;
    
    const link = document.createElement('a');
    link.href = receiptBlobUrl;
    link.download = `receipt-order-${selectedOrder.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination items
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const renderTooltip = (text) => (
    <Tooltip>{text}</Tooltip>
  );

  return (
    <SidebarLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Bank Transfer Payment Verifications</h4>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="primary" className="fs-6">
            {filteredOrders.length} Pending
          </Badge>
          <Badge bg={rateError ? "warning" : "success"} className="fs-6">
            {rateLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-1" />
                Loading Rate...
              </>
            ) : (
              `1 USD = ${exchangeRate.toFixed(2)} PKR`
            )}
          </Badge>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={toast.show} 
          onClose={() => setToast({ ...toast, show: false })}
          delay={5000}
          autohide
          bg={toast.type === "success" ? "success" : "danger"}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.type === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Search Card */}
      <Card className="mb-4">
        <Card.Header className="bg-light">
          <strong>Search Orders</strong>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  🔍
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by ID, client, expert, BD..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm("")}
                className="w-100"
              >
                Clear Search
              </Button>
            </Col>
          </Row>
          {rateError && (
            <div className="mt-2">
              <small className="text-warning">
                ⚠️ {rateError}
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <small className="text-muted">
          Showing {paginatedOrders.length} of {filteredOrders.length} records
        </small>
        {totalPages > 1 && (
          <small className="text-muted">
            Page {currentPage} of {totalPages}
          </small>
        )}
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading payment verifications...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Alert variant="info" className="text-center">
          <strong>No pending bank transfer payments found.</strong>
          <br />
          <small>Try adjusting your search criteria.</small>
        </Alert>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Expert</th>
                  <th>Business Developer</th>
                  <th>Amount (USD)</th>
                  <th>Status</th>
                  <th>Receipt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                      <br />
                      <small className="text-muted">
                        {new Date(order.created_at).toLocaleDateString()}
                      </small>
                    </td>
                    <td>{getDisplayName(order.client)}</td>
                    <td>{getDisplayName(order.seller)}</td>
                    <td>{getDisplayName(order.bd)}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{getAmountTooltip(order)}</Tooltip>}
                      >
                        {formatAmountDisplay(order)}
                      </OverlayTrigger>
                    </td>
                    <td>
                      <Badge bg="warning" text="dark">
                        Pending Verification
                      </Badge>
                    </td>
                    <td>
                      <OverlayTrigger placement="top" overlay={renderTooltip("View Receipt")}>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleViewReceipt(order)}
                          disabled={!order.transfer_receipt_path}
                        >
                          👁️ View
                        </Button>
                      </OverlayTrigger>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <OverlayTrigger placement="top" overlay={renderTooltip("Approve Payment")}>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(order.id)}
                            disabled={actionLoading.approve === order.id}
                          >
                            {actionLoading.approve === order.id ? (
                              <Spinner size="sm" animation="border" />
                            ) : (
                              "✓"
                            )}
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={renderTooltip("Reject Payment")}>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(order.id)}
                            disabled={actionLoading.reject === order.id}
                          >
                            {actionLoading.reject === order.id ? (
                              <Spinner size="sm" animation="border" />
                            ) : (
                              "✕"
                            )}
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                />
                {paginationItems}
                <Pagination.Next 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Receipt Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="xl">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            📄 Payment Receipt - Order #{selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          {receiptLoading ? (
            <div className="py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading receipt image...</p>
            </div>
          ) : receiptBlobUrl ? (
            <div>
              <Image 
                src={receiptBlobUrl} 
                alt="Transfer Receipt" 
                fluid 
                style={{ 
                  maxHeight: '60vh', 
                  objectFit: 'contain',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem'
                }}
              />
              <div className="mt-3">
                <Badge bg="primary" className="me-2 fs-6">
                  USD: ${selectedOrder ? (parseFloat(selectedOrder.price) || 0).toFixed(2) : '0'}
                </Badge>
                <Badge bg="secondary" className="fs-6">
                  PKR: ₨{selectedOrder ? convertToPKR(selectedOrder.price) : '0'}
                </Badge>
              </div>
              <div className="mt-2 text-muted">
                <small>
                  Uploaded: {selectedOrder?.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : 'N/A'}
                </small>
              </div>
            </div>
          ) : (
            <div className="py-5">
              <Alert variant="warning" className="d-inline-block">
                <strong>No receipt available</strong>
                <br />
                <small>The receipt image could not be loaded or doesn't exist.</small>
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {receiptBlobUrl && (
            <Button 
              variant="outline-primary" 
              onClick={downloadReceipt}
            >
              ⬇️ Download Receipt
            </Button>
          )}
          {selectedOrder && (
            <>
              <Button 
                variant="success" 
                onClick={() => handleApprove(selectedOrder.id)}
                disabled={actionLoading.approve === selectedOrder.id}
              >
                {actionLoading.approve === selectedOrder.id ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" />
                    Approving...
                  </>
                ) : (
                  "✓ Approve Payment"
                )}
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleReject(selectedOrder.id)}
                disabled={actionLoading.reject === selectedOrder.id}
              >
                {actionLoading.reject === selectedOrder.id ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" />
                    Rejecting...
                  </>
                ) : (
                  "✕ Reject Payment"
                )}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </SidebarLayout>
  );
}