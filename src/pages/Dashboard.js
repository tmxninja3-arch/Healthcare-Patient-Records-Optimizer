import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import PatientCard from '../components/PatientCard';
import './Dashboard.css';


const PATIENTS_PER_PAGE = 3;

function Dashboard() {
  // ============================================
  // STATE VARIABLES
  // ============================================

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [sortBy, setSortBy] = useState('name');


  const [currentPage, setCurrentPage] = useState(1);


  // useRef HOOK

  const searchInputRef = useRef(null);
  const renderCountRef = useRef(0);
  const topRef = useRef(null);

  
  // RENDER COUNTER

  renderCountRef.current = renderCountRef.current + 1;


  // FETCH PATIENTS (AXIOS)
 
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
      );

      console.log('API Status:', response.status);
      console.log('Patients fetched:', response.data.length);

      setPatients(response.data);
      setLastRefreshed(new Date().toLocaleTimeString());
      
      setCurrentPage(1);
    } catch (error) {
      if (error.response) {
        console.error('Server Error:', error.response.status);
        setError(`Server Error: ${error.response.status}`);
      } else if (error.request) {
        console.error('Network Error: No response received');
        setError('Network Error: Please check your internet connection');
      } else {
        console.error('Error:', error.message);
        setError(`Error: ${error.message}`);
      }
    }

    setLoading(false);
  };

  // useEffect - RUNS ON FIRST LOAD


  useEffect(() => {
    fetchPatients();

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  
  // useCallback HOOK - MEMOIZED FUNCTIONS

  const refreshPatients = useCallback(() => {
    console.log('Refreshing patients...');
    fetchPatients();
  }, []);

  const handleSelect = useCallback((patient) => {
    console.log('Patient selected:', patient.name);
    setSelectedPatient(patient);
  }, []);

  const scrollToTop = useCallback(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearch('');
    setCurrentPage(1);
    searchInputRef.current?.focus();
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
    console.log('Sorting by:', e.target.value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
   
  }, []);

  // Go to next page
  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => prev - 1);
  }, []);

  const goToPage = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  
  // useMemo HOOK - MEMOIZED CALCULATIONS

  // STEP 1: Filter and Sort patients (same as before)
  const filteredPatients = useMemo(() => {
    console.log('Filtering and sorting patients...');

    let result = [...patients];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter((patient) => {
        return (
          patient.name.toLowerCase().includes(searchLower) ||
          patient.email.toLowerCase().includes(searchLower)
        );
      });
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'email') {
      result.sort((a, b) => a.email.localeCompare(b.email));
    } else if (sortBy === 'hospital') {
      result.sort((a, b) =>
        (a.company?.name || '').localeCompare(b.company?.name || '')
      );
    }

    return result;
  }, [patients, search, sortBy]);


  const totalPages = useMemo(() => {
    return Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE);
  }, [filteredPatients]);

  
  const paginatedPatients = useMemo(() => {
    console.log('Calculating paginated patients...');
    const startIndex = (currentPage - 1) * PATIENTS_PER_PAGE;
   
    const endIndex = startIndex + PATIENTS_PER_PAGE;
    return filteredPatients.slice(startIndex, endIndex);
  }, [filteredPatients, currentPage]);
 
  const totalPatients = useMemo(() => {
    console.log('Calculating total patients...');
    return filteredPatients.length;
  }, [filteredPatients]);


  // RENDER (JSX)


  return (
    <div className="dashboard">
      <div ref={topRef}></div>

      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <h1>🏥 Healthcare Patient Dashboard</h1>
        <p className="header-subtitle">Patient Records Optimization System</p>
      </header>

      {/* ===== SECTION 1: Controls ===== */}
      <section className="section-controls">
        <div className="controls-row">
          {/* Search Input */}
          <div className="search-container">
            <label htmlFor="search">Search Patient:</label>
            <div className="search-input-wrapper">
              <input
                id="search"
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={handleSearchChange}
                ref={searchInputRef}
                className="search-input"
              />

              {search && (
                <button onClick={clearSearch} className="clear-btn">
                  ❌
                </button>
              )}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-container">
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="email">Email (A-Z)</option>
              <option value="hospital">Hospital (A-Z)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button onClick={refreshPatients} className="refresh-btn">
            🔄 Refresh Patients
          </button>

          {/* Render Counter */}
          <div className="render-counter">
            <span>Render Count: </span>
            <strong>{renderCountRef.current}</strong>
          </div>
        </div>

        {/* Last Refreshed Time */}
        {lastRefreshed && (
          <div className="last-refreshed">
            Last Refreshed: {lastRefreshed}
          </div>
        )}
      </section>

      {/* ===== ERROR MESSAGE ===== */}
      {error && (
        <section className="section-error">
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
            <button onClick={refreshPatients} className="retry-btn">
              Retry
            </button>
          </div>
        </section>
      )}

      {/* ===== SECTION 2: Stats ===== */}
      <section className="section-stats">
        <div className="stat-card">
          <h2>Total Patients</h2>
          <span className="stat-number">{totalPatients}</span>
        </div>

        <div className="stat-card sort-info-card">
          <h2>Sorted By</h2>
          <span className="sort-badge">
            {sortBy === 'name' && '👤 Name'}
            {sortBy === 'email' && '📧 Email'}
            {sortBy === 'hospital' && '🏥 Hospital'}
          </span>
        </div>

        {/* ── NEW: Page Info Card ── */}
        <div className="stat-card page-info-card">
          <h2>Current Page</h2>
          <span className="page-badge">
            {totalPages > 0 ? `${currentPage} of ${totalPages}` : '0 of 0'}
          </span>
        </div>

        {selectedPatient && (
          <div className="stat-card selected-card">
            <h2>Selected Patient</h2>
            <p className="selected-name">{selectedPatient.name}</p>
            <p className="selected-email">{selectedPatient.email}</p>
            <p className="selected-hospital">
              🏥 {selectedPatient.company?.name}
            </p>
          </div>
        )}
      </section>

      <section className="section-patients">
        <h2>
          Patient Records
          <span className="patients-showing">
            {totalPatients > 0 && (
              <>
                {' '}(Showing {(currentPage - 1) * PATIENTS_PER_PAGE + 1}
                -
                {Math.min(currentPage * PATIENTS_PER_PAGE, totalPatients)}
                {' '}of {totalPatients})
              </>
            )}
          </span>
          
        </h2>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="no-results">No patients found for "{search}"</div>
        ) : (
          <>
            {/* Patient Cards Grid */}
            <div className="patients-grid">
              
              {paginatedPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  handleSelect={handleSelect}
                  searchTerm={search}
                  isSelected={selectedPatient?.id === patient.id}
                />
              ))}
            </div>
            

            {totalPages > 1 && (
              <div className="pagination">
                {/* Previous Button */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="pagination-btn pagination-prev"
                >
                  ◀ Prev
                </button>
               
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`pagination-btn pagination-number ${
                          currentPage === pageNumber ? 'pagination-active' : ''
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-btn pagination-next"
                >
                  Next ▶
                </button>
                
              </div>
            )}
          
          </>
        )}
      </section>

      {/* ===== SECTION 4: Scroll Button ===== */}
      <section className="section-scroll">
        <button onClick={scrollToTop} className="scroll-btn">
          ⬆️ Scroll To Top
        </button>
      </section>
    </div>
  );
}

export default Dashboard;