import React, { useState } from "react";
import user from "../assets/gigsRatingComments.webp";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";

function createData(Name, Registration, Amount, Total, Status) {
  return { Name, Registration, Amount, Total, Status };
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
          <p className="font-16  mb-0">wellxcapital</p>
          <p className="font-14 takegraycolor  mb-0">wellxcapital</p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">Apr 06, 2022</p>,
    <p className="mb-0 font-16 poppins">$500</p>
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
          <p className="font-16  mb-0">wellxcapital</p>
          <p className="font-14 takegraycolor  mb-0">wellxcapital</p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">Apr 06, 2022</p>,
    <p className="mb-0 font-16 poppins">$500</p>
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
          <p className="font-16  mb-0">wellxcapital</p>
          <p className="font-14 takegraycolor  mb-0">wellxcapital</p>
        </div>
      </div>
    </>,
    <p className="mb-0 font-16 poppins">Apr 06, 2022</p>,
    <p className="mb-0 font-16 poppins">$500</p>
  ),
].sort((a, b) => (a.Registration < b.Registration ? -1 : 1));

const ReferalTable = ({ myReferrals }) => {
  return (
    <>
      <div className="container-fluid ProfileVisit order-table my-42">
        <div className="row justify-content-center">
          <div className="col-12 bg-white rounded-3 px-0">
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell className="font-16 poppins fw-medium ps-4">
                      Name
                    </TableCell>
                    <TableCell
                      className="font-16 poppins fw-medium"
                      align="center"
                    >
                      Registration Date
                    </TableCell>
                    <TableCell
                      className="font-16 poppins fw-medium"
                      align="center"
                    >
                      Amount Earned
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myReferrals.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="ps-4">
                        <div className="poppins d-flex align-items-center">
                          <img
                            src={row?.image}
                            width={50}
                            height={50}
                            alt="w8"
                            style={{ clipPath: "circle(50%)" }}
                          />
                          <div className="ms-2">
                            <p className="font-16  mb-0">
                              {row?.fname + " " + row.lname}
                            </p>
                            <p className="font-14 takegraycolor  mb-0">
                              {row?.role}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <p className="mb-0 font-16 poppins">
                          {new Date(row?.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="mb-0 font-16 poppins">$1</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default ReferalTable;
