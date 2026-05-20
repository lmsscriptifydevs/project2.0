import { Button } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../assets/LoaderImg.gif";
import search from "../assets/searchbar.webp";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { sellerRating } from "../redux/slices/ratingSlice";
import { useDispatch, useSelector } from "../redux/store/store";
import { useAccessToken } from "../utils/useLocalStorage";

const MeetTopRatedFreelancer = () => {
  const token = useAccessToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isPreLoading } = useSelector((state) => state.allGigs);
  const [searchKeyword, setSearchKeyword] = useState("");
  const location = useLocation();
  const initialSearch = useMemo(() => {
    const d = location.state?.dataTopRated;
    return typeof d === "string" ? d : (d?.topRated ?? "");
  }, [location.state?.dataTopRated]);

  useEffect(() => {
    setSearchKeyword(initialSearch);
  }, [initialSearch]);

  const { userDetail } = useSelector((state) => state.rating);

  // PERF STARTUP: Defer sellerRating until after first paint - UI renders first
  useEffect(() => {
    const fetchRating = () => {
      dispatch(sellerRating());
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchRating, { timeout: 500 });
    } else {
      setTimeout(fetchRating, 0);
    }
  }, [dispatch]);

  const filteredProfiles = useMemo(() => {
    const list = Array.isArray(userDetail) ? userDetail : [];
    const kw = typeof searchKeyword === "string" ? searchKeyword.toLowerCase() : "";
    if (!kw) return list;
    return list.filter(
      (v) => v?.seller?.fname && v.seller.fname.toLowerCase().includes(kw)
    );
  }, [userDetail, searchKeyword]);

  const handleViewProfile = useCallback(
    (value) => {
      navigate(`/profileOtherPerson/${value.user_id}`, { state: { userId: value.user_id } });
    },
    [navigate]
  );

  return (
    <>
      {token ? <Navbar FirstNav="none" /> : <Navbar SecondNav="none" />}
      <div className="container my-3 allgigs-field poppins">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt-lg-0 mt-md-0 mt-sm-0 mt-4 pe-lg-0">
            <form className="input-group p-2 h-100" role="search">
              <span className="input-group-text pt-0 pb-0" id="basic-addon1">
                <img src={search} width={16} alt="" loading="lazy" />
              </span>
              <input
                type="search"
                className="form-control p-0 font-12"
                id="floatingInputGroup1"
                placeholder="Search"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </form>
          </div>
        </div>
        <div className="row">
          <h3 className="mt-4">
            Results for <span className="colororing">{searchKeyword ? searchKeyword : "All "} Profile</span>
          </h3>
          {isPreLoading ? (
            <div className="col-12 text-center py-5">
              <img src={Loader} width={120} height={120} alt="Loading" loading="lazy" />
              <h2 className="cocon fw-bold mt-2">Loading..</h2>
            </div>
          ) : filteredProfiles.length > 0 ? (
            filteredProfiles.map((value, index) => (
              <div className="col-3" key={value.user_id ?? value.seller?.id ?? `profile-${index}`}>
                      <div className="bg-white shadow rounded-4 my-4 py-4 px-lg-0 px-4 mx-lg-0 mx-3">
                        <div className=" text-center">
                          <img
                            src={value?.seller?.image}
                            alt=""
                            className="rounded-circle"
                            width={150}
                            height={150}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="text-center poppins px-2 mt-2 pb-2">
                          <p className="font-16 mb-0  fw-medium blackcolor">
                            {value?.seller?.fname}
                          </p>
                          <p className="font-14 mb-1 takegraycolor">
                            {value?.seller?.role}
                          </p>

                          <div className="text-ceenter mt-1">
                            <Button
                              className="btn-stepper-border rounded-5 poppins px-3 font-16"
                              onClick={() => handleViewProfile(value)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
            ))
          ) : (
            <h3 className="cocon">Not Found</h3>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MeetTopRatedFreelancer;
