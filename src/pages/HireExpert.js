import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsChevronLeft, BsCircleFill, BsXCircleFill } from "react-icons/bs";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ExpertCard from "../components/ExpertCard";
import Navbar from "../components/Navbar";
import Profilreviw from "../components/Profilreviw";
import { getAllFreelancers, getCategories } from "../redux/slices/userSlice";

// ─── Constants ────────────────────────────────────────────────────────────────
const JOB_SUCCESS_OPTIONS = [
  { value: "any",  label: "Any job success" },
  { value: "80",   label: "80% & up" },
  { value: "90",   label: "90% & up" },
];

const PER_PAGE = 25;

// ─── Theme CSS Variables ──────────────────────────────────────────────────────
const THEME = {
  mainBg:         "#020617",
  cardBg:         "rgba(255,255,255,0.02)",
  cardBgActive:   "rgba(255,255,255,0.04)",
  orange:         "#f0591f",
  orangeFaint:    "rgba(240,89,31,0.15)",
  orangeBorder:   "rgba(240,89,31,0.4)",
  white:          "#ffffff",
  grayLight:      "#d4d4d8",
  grayMid:        "#a1a1aa",
  grayBody:       "#71717a",
  grayDark:       "#52525b",
  borderLight:    "rgba(255,255,255,0.06)",
  borderMed:      "rgba(255,255,255,0.07)",
  blueFaint:      "rgba(59,130,246,0.05)",
};

// ─── Utility Functions ────────────────────────────────────────────────────────
const safeArray  = (a) => (Array.isArray(a) ? a : []);
const safeString = (s) => (typeof s === "string" ? s : "");

const prepareUser = (user) => ({
  ...user,
  fname:         safeString(user.fname),
  lname:         safeString(user.lname),
  user_name:     safeString(user.user_name),
  city:          safeString(user.city),
  country:       safeString(user.country),
  state:         safeString(user.state),
  skills:        safeArray(user.skills).map((s) => safeString(typeof s === "object" ? s.name : s)),
  gigs:          safeArray(user.gigs).map((g) => ({
    ...g,
    title:       safeString(g.title),
    description: safeString(g.description),
    tags:        safeArray(g.tags).map(safeString),
    category:    g.category ? { ...g.category, name: safeString(g.category.name) } : { name: "" },
  })),
  success_ratio: Number(user.success_ratio) || 0,
});

// ─── Sub-components ───────────────────────────────────────────────────────────
const FilterBadge = ({ label, onRemove }) => (
  <span style={{
    display:        "inline-flex",
    alignItems:     "center",
    gap:            "6px",
    padding:        "4px 10px",
    borderRadius:   "20px",
    fontSize:       "12px",
    fontWeight:     500,
    background:     THEME.orangeFaint,
    border:         `1px solid ${THEME.orangeBorder}`,
    color:          THEME.orange,
    fontFamily:     "'Sora', sans-serif",
  }}>
    {label}
    <FiX
      size={12}
      style={{ cursor: "pointer", opacity: 0.8 }}
      onClick={onRemove}
    />
  </span>
);

const SectionTitle = ({ children }) => (
  <p style={{
    margin:       "0 0 14px 0",
    fontSize:     "11px",
    fontWeight:   700,
    letterSpacing:"1.5px",
    textTransform:"uppercase",
    color:        THEME.grayBody,
    fontFamily:   "'Sora', sans-serif",
  }}>
    {children}
  </p>
);

const FilterOption = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display:       "flex",
      alignItems:    "center",
      gap:           "10px",
      padding:       "8px 12px",
      marginBottom:  "4px",
      borderRadius:  "8px",
      cursor:        "pointer",
      background:    active ? THEME.orangeFaint : "transparent",
      border:        `1px solid ${active ? THEME.orangeBorder : "transparent"}`,
      transition:    "all 0.15s ease",
      color:         active ? THEME.orange : THEME.grayMid,
      fontSize:      "13px",
      fontFamily:    "'Sora', sans-serif",
    }}
  >
    <BsCircleFill size={7} style={{ flexShrink: 0, opacity: active ? 1 : 0.4 }} />
    {label}
  </div>
);

const SearchInput = ({ placeholder, defaultValue, onChange, icon }) => (
  <div style={{
    display:      "flex",
    alignItems:   "center",
    gap:          "10px",
    padding:      "10px 14px",
    borderRadius: "10px",
    background:   THEME.cardBg,
    border:       `1px solid ${THEME.borderMed}`,
    transition:   "border-color 0.2s",
  }}
    onFocus={(e) => e.currentTarget.style.borderColor = THEME.orangeBorder}
    onBlur={(e)  => e.currentTarget.style.borderColor = THEME.borderMed}
  >
    {icon}
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      style={{
        background:  "transparent",
        border:      "none",
        outline:     "none",
        width:       "100%",
        color:       THEME.white,
        fontSize:    "13px",
        fontFamily:  "'Sora', sans-serif",
      }}
    />
  </div>
);

// ─── Custom Pagination ────────────────────────────────────────────────────────
const CustomPagination = ({ page, totalPages, onChange }) => {
  const pages = useMemo(() => {
    const arr = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) arr.push(i);
    if (arr[0] > 1) { arr.unshift("..."); arr.unshift(1); }
    if (arr[arr.length - 1] < totalPages) { arr.push("..."); arr.push(totalPages); }
    return arr;
  }, [page, totalPages]);

  const btnStyle = (active, disabled) => ({
    padding:        "6px 12px",
    borderRadius:   "8px",
    border:         `1px solid ${active ? THEME.orange : THEME.borderMed}`,
    background:     active ? THEME.orange : "transparent",
    color:          active ? THEME.white : disabled ? THEME.grayDark : THEME.grayMid,
    cursor:         disabled ? "not-allowed" : "pointer",
    fontSize:       "13px",
    fontFamily:     "'Sora', sans-serif",
    fontWeight:     active ? 600 : 400,
    transition:     "all 0.15s",
    minWidth:       "36px",
  });

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "center", marginTop: "24px" }}>
      <button style={btnStyle(false, page === 1)} onClick={() => page > 1 && onChange(page - 1)}>‹</button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dot-${i}`} style={{ color: THEME.grayBody, padding: "0 4px" }}>…</span>
        ) : (
          <button key={p} style={btnStyle(p === page, false)} onClick={() => onChange(p)}>{p}</button>
        )
      )}
      <button style={btnStyle(false, page === totalPages)} onClick={() => page < totalPages && onChange(page + 1)}>›</button>
    </div>
  );
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{
    padding:      "20px",
    borderRadius: "12px",
    background:   THEME.cardBg,
    border:       `1px solid ${THEME.borderLight}`,
    marginBottom: "12px",
  }}>
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: THEME.borderMed, animation: "pulse 1.5s infinite" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, width: "40%", borderRadius: 6, background: THEME.borderMed, marginBottom: 8, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 11, width: "60%", borderRadius: 6, background: THEME.borderLight, animation: "pulse 1.5s infinite" }} />
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const HireExpert = () => {
  const dispatch   = useDispatch();
  const rawData    = useSelector((state) => state.user.userList);       // paginated Laravel response
  const loading    = useSelector((state) => state.user.isLoading);
  const error      = useSelector((state) => state.user.getError);
  const categories = useSelector((state) => state.user.categories || []);
  const isCategoriesLoading = useSelector((state) => state.user.isLoadingCategories);

  // ── Server Pagination State ────────────────────────────────────────────────
  const [page, setPage]   = useState(1);

  // ── Filter State ──────────────────────────────────────────────────────────
  const [searchQuery,        setSearchQuery]        = useState("");
  const [locationSearch,     setLocationSearch]     = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedJobSuccess, setSelectedJobSuccess] = useState("any");

  // ── UI State ───────────────────────────────────────────────────────────────
  const [expertDetail,  setExpertDetail]  = useState(null);
  const [expertModal,   setExpertModal]   = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);    // mobile sidebar

  const searchRef   = useRef(null);
  const locationRef = useRef(null);
  const searchTO    = useRef(null);
  const locationTO  = useRef(null);

  // ── Derived Data from Redux (Laravel paginated response) ──────────────────
  const serverItems  = useMemo(() => safeArray(rawData?.data).map(prepareUser), [rawData]);
  const totalPages   = rawData?.last_page  ?? 1;
  const totalCount   = rawData?.total      ?? 0;

  // ── Client-side Filters on current page's data ────────────────────────────
  const filteredData = useMemo(() => {
    let result = serverItems;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((u) =>
        u.fname.toLowerCase().includes(q) ||
        u.lname.toLowerCase().includes(q) ||
        u.user_name.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q)) ||
        u.gigs.some((g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
        )
      );
    }

    if (locationSearch.trim()) {
      const l = locationSearch.toLowerCase();
      result = result.filter((u) =>
        u.city.toLowerCase().includes(l) ||
        u.country.toLowerCase().includes(l) ||
        u.state.toLowerCase().includes(l)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((u) =>
        u.gigs.some((g) =>
          selectedCategories.some((c) => g.category.name.toLowerCase().includes(c.toLowerCase()))
        )
      );
    }

    if (selectedJobSuccess !== "any") {
      const min = parseInt(selectedJobSuccess);
      result = result.filter((u) => u.success_ratio >= min);
    }

    return result;
  }, [serverItems, searchQuery, locationSearch, selectedCategories, selectedJobSuccess]);

  // ── Fetch on page change ───────────────────────────────────────────────────
  useEffect(() => {
    // Pass search keyword to the backend
    dispatch(getAllFreelancers({ page, perPage: PER_PAGE, search: searchQuery }));
  }, [dispatch, page, searchQuery]);

  useEffect(() => {
    if (!categories.length) dispatch(getCategories());
  }, [dispatch]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [searchQuery, locationSearch, selectedCategories, selectedJobSuccess]);

  // Debounced handlers
  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    clearTimeout(searchTO.current);
    searchTO.current = setTimeout(() => setSearchQuery(val), 300);
  }, []);

  const handleLocationChange = useCallback((e) => {
    const val = e.target.value;
    clearTimeout(locationTO.current);
    locationTO.current = setTimeout(() => setLocationSearch(val), 300);
  }, []);

  const toggleCategory = useCallback((cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const clearAll = useCallback(() => {
    setSearchQuery("");
    setLocationSearch("");
    setSelectedCategories([]);
    setSelectedJobSuccess("any");
    if (searchRef.current)   searchRef.current.value   = "";
    if (locationRef.current) locationRef.current.value = "";
  }, []);

  // Cleanup
  useEffect(() => () => {
    clearTimeout(searchTO.current);
    clearTimeout(locationTO.current);
  }, []);

  const activeFilters = [
    searchQuery.trim()       && { label: `"${searchQuery}"`,    clear: () => { setSearchQuery(""); if (searchRef.current) searchRef.current.value = ""; } },
    locationSearch.trim()    && { label: `📍 ${locationSearch}`, clear: () => { setLocationSearch(""); if (locationRef.current) locationRef.current.value = ""; } },
    ...selectedCategories.map((c) => ({ label: c, clear: () => toggleCategory(c) })),
    selectedJobSuccess !== "any" && { label: `✓ ${selectedJobSuccess}%+`, clear: () => setSelectedJobSuccess("any") },
  ].filter(Boolean);

  // ── Sidebar Content ────────────────────────────────────────────────────────
  const SidebarFilters = () => (
    <div style={{
      background:   THEME.mainBg,
      borderRight:  `1px solid ${THEME.borderLight}`,
      padding:      "24px 20px",
      height:       "100%",
      overflowY:    "auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <span style={{
          fontSize:    "13px",
          fontWeight:  700,
          letterSpacing:"1px",
          textTransform:"uppercase",
          color:       THEME.grayMid,
          fontFamily:  "'Sora', sans-serif",
          display:     "flex",
          alignItems:  "center",
          gap:         "8px",
        }}>
          <FiSliders size={14} color={THEME.orange} /> Filters
          {activeFilters.length > 0 && (
            <span style={{
              padding:    "2px 7px",
              borderRadius:12,
              background: THEME.orange,
              color:      THEME.white,
              fontSize:   "10px",
              fontWeight: 700,
            }}>{activeFilters.length}</span>
          )}
        </span>
        {activeFilters.length > 0 && (
          <button onClick={clearAll} style={{
            background: "transparent",
            border:     `1px solid ${THEME.borderMed}`,
            color:      THEME.grayBody,
            borderRadius:8,
            padding:    "4px 10px",
            fontSize:   "11px",
            cursor:     "pointer",
            fontFamily: "'Sora', sans-serif",
          }}>Clear all</button>
        )}
      </div>

      {/* Location */}
      <div style={{ marginBottom: "28px" }}>
        <SectionTitle>Location</SectionTitle>
        <SearchInput
          placeholder="Search location…"
          defaultValue={locationSearch}
          onChange={handleLocationChange}
          icon={<FiSearch size={14} color={THEME.grayBody} />}
        />
      </div>

      {/* Categories */}
      <div style={{ marginBottom: "28px" }}>
        <SectionTitle>Categories</SectionTitle>
        {isCategoriesLoading ? (
          <div style={{ color: THEME.grayBody, fontSize: 13, fontFamily: "'Sora', sans-serif" }}>Loading…</div>
        ) : (
          categories.map((cat) => (
            <FilterOption
              key={cat.id || cat.name}
              label={cat.name}
              active={selectedCategories.includes(cat.name)}
              onClick={() => toggleCategory(cat.name)}
            />
          ))
        )}
      </div>

      {/* Job Success */}
      <div>
        <SectionTitle>Job Success</SectionTitle>
        {JOB_SUCCESS_OPTIONS.map((opt) => (
          <FilterOption
            key={opt.value}
            label={opt.label}
            active={selectedJobSuccess === opt.value}
            onClick={() => setSelectedJobSuccess(opt.value)}
          />
        ))}
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar FirstNav="none" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        body { background: ${THEME.mainBg}; }

        ::placeholder { color: ${THEME.grayDark} !important; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        .he-expert-card {
          animation: fadeIn 0.25s ease both;
        }

        .he-expert-card:nth-child(1) { animation-delay: 0.04s; }
        .he-expert-card:nth-child(2) { animation-delay: 0.08s; }
        .he-expert-card:nth-child(3) { animation-delay: 0.12s; }
        .he-expert-card:nth-child(4) { animation-delay: 0.16s; }
        .he-expert-card:nth-child(5) { animation-delay: 0.20s; }

        /* Mobile sidebar overlay */
        .he-mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          z-index: 1040;
          backdrop-filter: blur(4px);
        }
        .he-mobile-overlay.show { display: block; }
        .he-mobile-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 300px;
          z-index: 1050;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .he-mobile-drawer.show {
          transform: translateX(0);
        }

        /* Offcanvas expert detail */
        .he-offcanvas {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: 420px;
          max-width: 95vw;
          background: #080f1f;
          border-left: 1px solid ${THEME.borderMed};
          z-index: 1055;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          overflow-y: auto;
          padding: 24px;
        }
        .he-offcanvas.show {
          transform: translateX(0);
        }
        .he-offcanvas::-webkit-scrollbar { width: 5px; }
        .he-offcanvas::-webkit-scrollbar-track { background: transparent; }
        .he-offcanvas::-webkit-scrollbar-thumb { background: ${THEME.borderMed}; border-radius: 3px; }

        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: ${THEME.borderMed}; border-radius: 3px; }

        @media (max-width: 768px) {
          .he-desktop-sidebar { display: none !important; }
        }
        @media (min-width: 769px) {
          .he-mobile-toggle { display: none !important; }
        }
      `}</style>

      {/* Mobile overlay + drawer */}
      <div className={`he-mobile-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />
      <div className={`he-mobile-drawer sidebar-scroll ${sidebarOpen ? "show" : ""}`}>
        <SidebarFilters />
      </div>

      {/* Expert detail offcanvas */}
      <div className={`he-offcanvas ${expertModal ? "show" : ""}`}>
        <button
          onClick={() => { setExpertModal(false); setExpertDetail(null); }}
          style={{
            background: "transparent",
            border:     "none",
            color:      THEME.orange,
            cursor:     "pointer",
            display:    "flex",
            alignItems: "center",
            gap:        "8px",
            marginBottom:"20px",
            fontFamily: "'Sora', sans-serif",
            fontSize:   "13px",
          }}
        >
          <BsChevronLeft /> Back
        </button>
        {expertDetail && <Profilreviw expertDetail={expertDetail} />}
      </div>

      {/* ── Page Layout ── */}
      <div style={{
        display:      "flex",
        minHeight:    "100vh",
        background:   THEME.mainBg,
        paddingTop:   "70px",
        fontFamily:   "'Sora', sans-serif",
      }}>
        {/* Desktop Sidebar */}
        <div
          className="he-desktop-sidebar sidebar-scroll"
          style={{
            width:      "280px",
            flexShrink: 0,
            position:   "sticky",
            top:        70,
            height:     "calc(100vh - 70px)",
            overflowY:  "auto",
          }}
        >
          <SidebarFilters />
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "28px 24px", maxWidth: "900px" }}>

          {/* Top bar */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center" }}>

            {/* Mobile filter toggle */}
            <button
              className="he-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              style={{
                background:   THEME.cardBg,
                border:       `1px solid ${THEME.borderMed}`,
                borderRadius: "10px",
                padding:      "10px 14px",
                color:        THEME.grayMid,
                cursor:       "pointer",
                flexShrink:   0,
                display:      "flex",
                alignItems:   "center",
                gap:          "6px",
                fontSize:     "13px",
              }}
            >
              <FiSliders size={14} color={THEME.orange} />
              Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>

            {/* Search */}
            <div style={{ flex: 1 }}>
              <SearchInput
                placeholder="Search by name, skills, or description…"
                defaultValue={searchQuery}
                onChange={handleSearchChange}
                icon={<FiSearch size={15} color={THEME.grayBody} />}
              />
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {activeFilters.map((f, i) => (
                <FilterBadge key={i} label={f.label} onRemove={f.clear} />
              ))}
            </div>
          )}

          {/* Results count */}
          <div style={{
            marginBottom: "16px",
            fontSize:     "12px",
            color:        THEME.grayBody,
            display:      "flex",
            alignItems:   "center",
            gap:          "8px",
          }}>
            {loading ? (
              <span>Loading freelancers…</span>
            ) : (
              <>
                <span style={{ color: THEME.orange, fontWeight: 600 }}>{filteredData.length}</span>
                {activeFilters.length ? " matching on this page · " : " freelancers · "}
                <span>Page {page} of {totalPages} · {totalCount} total</span>
              </>
            )}
          </div>

          {/* Error */}
          {error && !loading && (
            <div style={{
              padding:      "16px 20px",
              borderRadius: "12px",
              background:   "rgba(239,68,68,0.08)",
              border:       "1px solid rgba(239,68,68,0.25)",
              color:        "#f87171",
              fontSize:     "13px",
              marginBottom: "16px",
            }}>
              Error loading freelancers: {error}
            </div>
          )}

          {/* Cards */}
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredData.length > 0 ? (
            filteredData.map((user, i) => (
              <div key={user.id || user._id || `e-${i}`} className="he-expert-card">
                <ExpertCard user={user} showExpertDetail={(d) => { setExpertDetail(d); setExpertModal(true); }} />
              </div>
            ))
          ) : (
            <div style={{
              textAlign:  "center",
              padding:    "60px 20px",
              color:      THEME.grayBody,
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.4 }}>🔍</div>
              <p style={{ color: THEME.grayMid, fontWeight: 600, marginBottom: "6px" }}>
                No freelancers found
              </p>
              <p style={{ fontSize: "13px", maxWidth: "300px", margin: "0 auto 20px" }}>
                {activeFilters.length
                  ? "No match on this page. Try adjusting your filters."
                  : "No freelancers available right now."}
              </p>
              {activeFilters.length > 0 && (
                <button onClick={clearAll} style={{
                  padding:      "8px 20px",
                  borderRadius: "8px",
                  background:   THEME.orangeFaint,
                  border:       `1px solid ${THEME.orangeBorder}`,
                  color:        THEME.orange,
                  cursor:       "pointer",
                  fontSize:     "13px",
                  fontFamily:   "'Sora', sans-serif",
                }}>
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <CustomPagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HireExpert;