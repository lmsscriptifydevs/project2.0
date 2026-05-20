import _ from "lodash";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, toggleUserStatus, toggleUserrole } from "../../../redux/slices/userSlice";
import SidebarLayout from "../sidebarLayout";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users = [], isLoading, getError, meta = {} } = useSelector((state) => state.user);

  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const limit = 10;

  // PERF STARTUP: Defer getAllUsers until after first paint - UI renders first
  useEffect(() => {
    const delayedSearch = _.debounce(() => {
      dispatch(
        getAllUsers({
          page,
          limit,
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
          sort: sortField,
          order: sortOrder,
        })
      );
    }, 500);

    // PERF: Defer initial API call until after first paint
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => delayedSearch(), { timeout: 500 });
    } else {
      setTimeout(() => delayedSearch(), 0);
    }

    return () => delayedSearch.cancel();
  }, [dispatch, page, searchTerm, roleFilter, statusFilter, sortField, sortOrder]);

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < meta.total_pages) setPage((prev) => prev + 1);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleToggleBan = (userId, status) => {
    dispatch(toggleUserStatus({ userId, status })).then(() => {
      dispatch(
        getAllUsers({
          page,
          limit,
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
          sort: sortField,
          order: sortOrder,
        })
      );
    });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      dispatch(toggleUserrole({ userId, newRole })).then(() => {
        dispatch(
          getAllUsers({
            page,
            limit,
            search: searchTerm,
            role: roleFilter,
            status: statusFilter,
            sort: sortField,
            order: sortOrder,
          })
        );
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <SidebarLayout>
      <div className="container mt-4">
        <h2 className="mb-3">Admin Users</h2>

        <Form className="mb-3 d-flex gap-2 flex-wrap">
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="expert">Expert</option>
            <option value="client">Client</option>
          </Form.Select>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </Form.Select>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("");
              setStatusFilter("");
              setSortField("");
              setSortOrder("asc");
            }}
          >
            Clear Filters
          </Button>
        </Form>

        {getError && (
          <div className="alert alert-danger" role="alert">
            {getError}
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th style={{ cursor: "pointer" }} onClick={() => toggleSort("fname")}>Name {sortField === "fname" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => toggleSort("email")}>Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                <th>Role <small>(change from dropdown)</small></th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user?.id || index}>
                    <td>{(meta.current_page - 1) * limit + index + 1}</td>
                    <td>{user.fname}</td>
                    <td>{user.email}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="bidder/company representative/middleman">Business developer</option>
                        <option value="expert/freelancer">Freelancer</option>
                        <option value="client">Client</option>
                      </Form.Select>
                    </td>
                    <td>{user.status === "banned" ? "Banned" : "Active"}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => handleView(user)}>View</Button>{" "}
                      <Button
                        variant={user.status !== "banned" ? "danger" : "success"}
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to ${user.status !== "banned" ? "ban" : "unban"} this user?`)) {
                            handleToggleBan(user.id, user.status !== "banned" ? "banned" : "active");
                          }
                        }}
                      >
                        {user.status !== "banned" ? "Ban" : "Unban"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-secondary" onClick={handlePrevious} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {meta.current_page || page} of {meta.total_pages || 1}
            </span>
            <button
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={page === meta.total_pages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>Name:</strong> {selectedUser.fname}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> {selectedUser.status === "banned" ? "Banned" : "Active"}</p>
              <p><strong>Joined:</strong> {selectedUser.created_at}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </SidebarLayout>
  );
};

export default UsersPage;
