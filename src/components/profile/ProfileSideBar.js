import React, { useEffect, useRef, useState } from "react";
// import John from "../assets/john.webp";
import { Box, Button, Modal } from "@mui/material";
import { BsFillShieldLockFill } from "react-icons/bs";
import { FaPlus, FaPowerOff, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emptyProfile from "../../assets/AfterUpload.webp";
import emptyProfileModal from "../../assets/emptyProfileModal.webp";
import { profileUpdate, userProfile } from "../../redux/slices/profileSlice";
import { useDispatch, useSelector } from "../../redux/store/store";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: "600px" },
  bgcolor: "#0f172a",
  color: "#ffffff",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "24px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  p: 4,
};

const ProfileSideBar = ({ setupTabState, tabStates }) => {
  const [modalOne, setModalOne] = React.useState(false);
  const [modalTwo, setModalTwo] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userDetail, isLoading, getError } = useSelector(
    (state) => state.profile
  );

  const [activeTab, setActiveTab] = useState(tabStates);
  const handleTabs = (tabsValue) => {
    setupTabState(tabsValue);
    setActiveTab(tabsValue);
  };
  // =======logout=======
  const handelLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
    // setTimeout(() => {
    // }, 500);
  };

  // ----------------- image upload --------------

  const [imgPreview, setImgPreview] = useState(null);
  // console.log(imgPreview, '=========================');
  const onClose = () => {
    setImgPreview(null);
  };
  // console.log(imgPreview, '=====================p');

  const onCrop = (preview) => {
    setImgPreview(preview);
    // console.log(imgPreview, '============================oncrop');
  };
  // -----------img--hit in---apis----------
  const handleUploadProfilePhoto = (e) => {
    e.preventDefault();
    let data = {
      image: imgPreview,
    };
    // console.log(data, "===img---data");
    dispatch(profileUpdate(data, handleResponse));
  };
  const handleResponse = (data) => {
    if (data?.status) {
      setModalTwo(false);
      // console.log(data?.message, '============if')
      toast.success("Successfully Update Profile", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      // console.log(data?.message, '================else')
    }
  };
  // PERF STARTUP: Defer userProfile until after first paint - UI renders first
  useEffect(() => {
    const fetchProfile = () => {
      const data = {
        device_token: "123456789",
      };
      dispatch(userProfile(data));
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchProfile, { timeout: 500 });
    } else {
      setTimeout(fetchProfile, 0);
    }
  }, [dispatch]);
  const [selectedImagePreview, setSelectedPreview] = useState(null);
  useEffect(() => {
    setSelectedPreview(emptyProfileModal);
    setImgPreview(userDetail?.image);
    // console.log(userDetail?.image);
  }, [userDetail]);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Trigger the file input to open
    fileInputRef.current.click();
  };
  const [isImageSelected, setImageSelected] = useState(false);
  const handleFileChange = (e) => {
    // Handle the selected file here
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      // console.log(imageUrl);
      setSelectedPreview(imageUrl);
      setImageSelected(true);
    }
    setImgPreview(selectedFile);
    // console.log("Selected File:", selectedFile);
  };
  return (
    <>
      <ToastContainer />

      <div className=" highT sidebar-profile poppins">
        <div className="userImg-selection d-flex flex-column justify-content-center align-items-center">
          <div>
            {/* Button trigger modal */}
            <div>
              <div className="d-flex justify-content-center">
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={userDetail ? userDetail.image : emptyProfile}
                    className="w-100 h-100 rounded-circle 
                  "
                    alt="w8"
                  />
                </div>
              </div>
              <button
                type="button"
                className="profile-upload px-3 p-2 mt-4 d-flex align-items-center"
                onClick={(e) => setModalOne(true)}
              >
                <FaPlus className="me-2" /> Upload Photo
              </button>
            </div>
            <Modal
              open={modalOne}
              onClose={(e) => setModalOne(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                className="bg-white rounded-4 p-lg-5 p-md-4 -sm-3 p-2 profile-modal-mbl"
                sx={style}
              >
                <div className="border-0">
                  <h1
                    className="modal-title font-28 cocon"
                    id="staticBackdropLabel"
                  >
                    Your Photo
                  </h1>
                </div>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12 text-center">
                      <img
                        src={selectedImagePreview}
                        className="mt-3 rounded-circle "
                        width={150}
                        height={150}
                        alt="w8"
                      />
                      <div>
                        {/* <u className='colororing poppins mt-4 font-14 cursor-pointer' onClick={() => setImgPreview(null)} >Delete current image</u> */}
                        <p className="font-16 takegraycolor text-center mt-2">
                          250 x 250{" "}
                          <span className="font-12 takegraycolor">Min</span>
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-8 col-md-8 col-12">
                      <h4 className="poppins font-24 blackcolor">
                        Present the finest version of yourself to the client.
                      </h4>
                      <p
                        className="font-16 poppins mb-2"
                        style={{ color: "##1D2B3C" }}
                      >
                        Must be an actual photo of you.
                      </p>
                      <p className="takegraycolor font-16 poppins">
                        Logo, group photo, clip art and digitally altered images
                        are not allowed.
                      </p>
                      <div
                        className="d-flex justify-content-end image-upload-after  my-lg-0 my-md-0 my-3"
                        style={{ bottom: "20px", right: "25px" }}
                      >
                        <Button
                          type="button"
                          onClick={(e) => {
                            setModalOne(false);
                          }}
                          className="btn-stepper-border me-3 poppins px-3 p-2 rounded-3 font-16"
                        >
                          Close
                        </Button>
                        <Button
                          className=" btn-stepper poppins  px-3 p-2 rounded-3 font-16 d-flex align-items-center"
                          onClick={
                            isImageSelected
                              ? handleUploadProfilePhoto
                              : handleButtonClick
                          }
                        >
                          {isImageSelected
                            ? "Upload Photo"
                            : "Click to Attach Photo"}
                        </Button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Box>
            </Modal>
            {/* Modal */}
          </div>
        </div>

        <div className="mt-5 side-bar-tabs poppins">
          <ul className="container-fluid  ">
            <li
              className={`list  py-2 font-16 row justify-content-center ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => handleTabs("profile")}
            >
              <div className="col-1">
                <FaUserEdit className="me-3" size={16} />
              </div>
              <div className="col-3">
                <p className="mb-0">Profile</p>
              </div>
            </li>
            <li
              className={`list  py-2 row justify-content-center font-16 ${
                activeTab === "MyOrders" ? "active" : ""
              }`}
              onClick={() => handleTabs("MyOrders")}
            >
              <div className="col-1">
                <BsFillShieldLockFill size={16} className="me-3" />
              </div>
              <div className="col-3">
                <p className="mb-0">Security</p>
              </div>
            </li>
            <li
              className="list py-2 font-16 row justify-content-center "
              onClick={handelLogout}
            >
              <div className="col-1">
                <FaPowerOff size={16} className="me-3" />
              </div>
              <div className="col-3">
                <p className="mb-0">Logout</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfileSideBar;
