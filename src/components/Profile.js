import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import user from "../assets/gigsRatingComments.webp";
import search from "../assets/searchbar.webp";
import Navbar from "./Navbar";
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const rows = [
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
  createData(
    <>
      <div className="poppins d-flex align-items-center">
        <img
          src={user}
          width={50}
          height={50}
          alt="w8"
          style={{ clipPath: "circle(50%)" }}
        />
        <div className="ms-2">
          <h6 className="font-16  mb-0">Natayla Herington</h6>
          <p className="font-14 mb-0" style={{ color: "#756F6F" }}>
            Natayla Herington
          </p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">OCT 01, 2024</p>,
    <Button className="btn-stepper-border poppins px-3  font-16">
      View Profile
    </Button>
  ),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

const Profile = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // -------------paginate---------------
  // Sample data (you can replace this with your actual data)
  // const data = Array.from({ length: 50 }, (_, i) => i + 1); // An array with numbers from 1 to 50
  const itemsPerPage = 5; // Number of items to show per page

  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = rows.slice(offset, offset + itemsPerPage);
 

  const pageCount = Math.ceil(rows.length / itemsPerPage);
  return (
    <>
      <Navbar FirstNav="none" />
      <div className="container-fluid mt-4">
        <div className="row allgigs-field">
          <div className="col-11 px-0">
            <div className="container-fluid">
              <div className="row  justify-content-end">
                <div className="col-lg-5 col-md-8 col-12 px-0">
                  <div class="input-group p-2 h-100 poppins">
                    <span class="input-group-text pt-0 pb-0" id="basic-addon1">
                      <img src={search} width={16} alt="" />
                    </span>
                    <input
                      type="text"
                      className="form-control p-0 font-12"
                      id="floatingInputGroup1"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid ProfileVisit my-4">
        <div className="row justify-content-center">
          <div
            className="col-11 bg-white rounded-3 p-3"
            style={{ boxShadow: "0px -2px 10px 0px #0000001A" }}
          >
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="custom pagination table"
              >
                <TableBody>
                  {currentPageData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell sx={{ width: "33%" }}>{row.name}</TableCell>
                      <TableCell sx={{ width: "33%" }} align="center">
                        {row.calories}
                      </TableCell>
                      <TableCell sx={{ width: "33%" }} align="right">
                        {row.fat}
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {/* <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                            colSpan={3}
                                            count={rows.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                                inputProps: {
                                                    'aria-label': 'rows per page',
                                                },
                                                native: true,
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow> */}
              </Table>
            </TableContainer>
            <div className="container-fluid">
              <div className="d-flex justify-content-end">
                <div className="reactPaginate px-3">
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default Profile;
