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
  approveBidPayment,
  fetchBidPayments,
  rejectBidPayment
} from "../../../redux/slices/bidsSlice";
import SidebarLayout from "../sidebarLayout";

const ITEMS_PER_PAGE = 10;

export default function BidsPaymentManagement() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBid, setSelectedBid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [receiptBlobUrl, setReceiptBlobUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState({ approve: null, reject: null });
  const [receiptLoading, setReceiptLoading] = useState(false);

 const { bidPayments = [], isLoading = false, error = null } = useSelector(
  (state) => state.bids || {}
);

  // Helper function to get display name
  const getDisplayName = (user) => {
    if (!user) return "Unassigned";
    return `${user.fname || ''} ${user.lname || ''}`.trim() || user.email || "N/A";
  };

  // Filter bid payments
  const filteredBidPayments = bidPayments.filter((bidPayment) => {
    const userName = getDisplayName(bidPayment.user);
    
    const matchesSearch = `${bidPayment.id} ${userName} ${bidPayment.payment_method} ${bidPayment.reason}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      bidPayment.status === 'pending_verification' &&
      bidPayment.receipt_path !== null
    );
  });

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBidPayments = filteredBidPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredBidPayments.length / ITEMS_PER_PAGE);

  // PERF STARTUP: Defer fetchBidPayments until after first paint - UI renders first
  useEffect(() => {
    const fetchBids = () => {
      dispatch(fetchBidPayments());
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchBids, { timeout: 500 });
    } else {
      setTimeout(fetchBids, 0);
    }
  }, [dispatch]);

  const handleViewReceipt = async (bidPayment) => {
    setSelectedBid(bidPayment);
    setShowModal(true);
    setReceiptBlobUrl(null);
    setReceiptLoading(true);

    if (!bidPayment.receipt_path) {
      showToast("No receipt available for this bid payment.", "error");
      setReceiptLoading(false);
      return;
    }

    try {
      const fileName = bidPayment.receipt_path.split("/").pop();
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

  const handleApprove = async (bidId) => {
    setActionLoading(prev => ({ ...prev, approve: bidId }));
    try {
      await dispatch(approveBidPayment(bidId)).unwrap();
      showToast("Bid payment approved successfully.", "success");
      setShowModal(false);
      dispatch(fetchBidPayments());
    } catch (error) {
      showToast(error?.message || "Failed to approve bid payment.", "error");
    } finally {
      setActionLoading(prev => ({ ...prev, approve: null }));
    }
  };

  const handleReject = async (bidId) => {
    setActionLoading(prev => ({ ...prev, reject: bidId }));
    try {
      await dispatch(rejectBidPayment(bidId)).unwrap();
      showToast("Bid payment rejected successfully.", "success");
      setShowModal(false);
      dispatch(fetchBidPayments());
    } catch (error) {
      showToast(error?.message || "Failed to reject bid payment.", "error");
    } finally {
      setActionLoading(prev => ({ ...prev, reject: null }));
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const downloadReceipt = async () => {
    if (!receiptBlobUrl || !selectedBid) return;
    
    const link = document.createElement('a');
    link.href = receiptBlobUrl;
    link.download = `bid-receipt-${selectedBid.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Format amount display
  const formatAmountDisplay = (bidPayment) => {
    return (
      <Badge bg="light" text="dark" className="fs-6 border">
        {bidPayment.amount} Bids
      </Badge>
    );
  };

  // Format paid amount
  const formatPaidAmount = (bidPayment) => {
    const amount = parseFloat(bidPayment.paid_amount) || 0;
    return (
      <Badge bg="info" text="dark" className="fs-6">
        ${amount.toFixed(2)}
      </Badge>
    );
  };

  // Get reason display text
  const getReasonDisplay = (reason) => {
    const reasonMap = {
      'bid_purchase': 'Bid Purchase',
      'signup_bonus': 'Signup Bonus',
      'offer_submission': 'Offer Submission',
      'refund': 'Refund',
      'other': 'Other'
    };
    return reasonMap[reason] || reason;
  };

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
        <h4 className="mb-0">Bids Payment Management</h4>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="primary" className="fs-6">
            {filteredBidPayments.length} Pending
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
          <strong>Search Bid Payments</strong>
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
                  placeholder="Search by ID, user, reason, payment method..."
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
        </Card.Body>
      </Card>

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <small className="text-muted">
          Showing {paginatedBidPayments.length} of {filteredBidPayments.length} records
        </small>
        {totalPages > 1 && (
          <small className="text-muted">
            Page {currentPage} of {totalPages}
          </small>
        )}
      </div>

      {/* Bid Payments Table */}
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading bid payments...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          <strong>Error loading bid payments:</strong> {error}
        </Alert>
      ) : filteredBidPayments.length === 0 ? (
        <Alert variant="info" className="text-center">
          <strong>No pending bid payments found.</strong>
          <br />
          <small>Try adjusting your search criteria.</small>
        </Alert>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Bid ID</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Bid Amount</th>
                  <th>Paid Amount</th>
                  <th>Payment Method</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Receipt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBidPayments.map((bidPayment) => (
                  <tr key={bidPayment.id}>
                    <td>
                      <strong>#{bidPayment.id}</strong>
                      <br />
                      <small className="text-muted">
                        {new Date(bidPayment.created_at).toLocaleDateString()}
                      </small>
                    </td>
                    <td>{getDisplayName(bidPayment.user)}</td>
                    <td>
                      <Badge bg={bidPayment.type === 'earn' ? 'success' : 'warning'}>
                        {bidPayment.type}
                      </Badge>
                    </td>
                    <td>{formatAmountDisplay(bidPayment)}</td>
                    <td>{formatPaidAmount(bidPayment)}</td>
                    <td>
                      <Badge bg="secondary" className="text-capitalize">
                        {bidPayment.payment_method?.replace('_', ' ') || 'N/A'}
                      </Badge>
                    </td>
                    <td>{getReasonDisplay(bidPayment.reason)}</td>
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
                          onClick={() => handleViewReceipt(bidPayment)}
                          disabled={!bidPayment.receipt_path}
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
                            onClick={() => handleApprove(bidPayment.id)}
                            disabled={actionLoading.approve === bidPayment.id}
                          >
                            {actionLoading.approve === bidPayment.id ? (
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
                            onClick={() => handleReject(bidPayment.id)}
                            disabled={actionLoading.reject === bidPayment.id}
                          >
                            {actionLoading.reject === bidPayment.id ? (
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
            📄 Bid Payment Receipt - #{selectedBid?.id}
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
                alt="Bid Payment Receipt" 
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
                  Bids: {selectedBid?.amount}
                </Badge>
                <Badge bg="info" className="me-2 fs-6">
                  Amount: ${selectedBid ? (parseFloat(selectedBid.paid_amount) || 0).toFixed(2) : '0'}
                </Badge>
                <Badge bg="secondary" className="fs-6">
                  Method: {selectedBid?.payment_method}
                </Badge>
              </div>
              <div className="mt-2 text-muted">
                <small>
                  Created: {selectedBid?.created_at ? new Date(selectedBid.created_at).toLocaleDateString() : 'N/A'}
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
          {selectedBid && (
            <>
              <Button 
                variant="success" 
                onClick={() => handleApprove(selectedBid.id)}
                disabled={actionLoading.approve === selectedBid.id}
              >
                {actionLoading.approve === selectedBid.id ? (
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
                onClick={() => handleReject(selectedBid.id)}
                disabled={actionLoading.reject === selectedBid.id}
              >
                {actionLoading.reject === selectedBid.id ? (
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