import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import PatientCard from '../components/PatientCard';
import './Dashboard.css';

function Dashboard() {
  // ============================================
  // STATE VARIABLES
  // ============================================
  
  // patients: stores the fetched patient data from API
  const [patients, setPatients] = useState([]);
  
  // search: stores what user types in search box
  const [search, setSearch] = useState('');
  
  // loading: tracks if API data is being fetched
  const [loading, setLoading] = useState(false);

  // error: stores any API error message
  const [error, setError] = useState(null);
  
  // selectedPatient: stores which patient user clicked (Bonus 2)
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // lastRefreshed: stores timestamp of last data refresh (Bonus 3)
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // ============================================
  // useRef HOOK - 3 USES
  // ============================================
  
  // USE 1: Auto-focus the search input when page loads
  const searchInputRef = useRef(null);
  
  // USE 2: Track how many times this component re-renders
  const renderCountRef = useRef(0);
  
  // USE 3: Reference to the top of the page for scroll functionality
  const topRef = useRef(null);

  // ============================================
  // RENDER COUNTER LOGIC (useRef)
  // ============================================
  
  // Every time this component renders, this value increases
  // useRef does NOT cause re-render when updated (unlike useState)
  renderCountRef.current = renderCountRef.current + 1;

  // ============================================
  // FETCH PATIENTS FUNCTION (USING AXIOS)
  // ============================================
  
  // ---- DIFFERENCE: fetch vs axios ----
  //
  // WITH FETCH (old way):
  //   const response = await fetch(url);
  //   const data = await response.json();  // need extra step to parse JSON
  //   // fetch does NOT throw error for 404/500 status codes
  //
  // WITH AXIOS (new way):
  //   const response = await axios.get(url);
  //   const data = response.data;  // already parsed as JSON automatically
  //   // axios throws error for 404/500 status codes automatically
  //
  // AXIOS ADVANTAGES:
  //   1. Auto JSON parsing (no need for .json())
  //   2. Auto error handling for bad status codes
  //   3. Better error messages
  //   4. Request/Response interceptors
  //   5. Request cancellation support
  //   6. Works in both browser and Node.js

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      // AXIOS GET REQUEST
      // axios.get() returns a promise
      // response.data contains the parsed JSON data directly
      // No need to call .json() like we do with fetch
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      
      // axios automatically parses JSON
      // response.data = the actual data array
      // response.status = 200
      // response.headers = response headers
      console.log('API Status:', response.status);
      console.log('Patients fetched:', response.data.length);

      // Store the data in state
      setPatients(response.data);
      
      // Update last refreshed time (Bonus 3)
      setLastRefreshed(new Date().toLocaleTimeString());

    } catch (error) {
      // AXIOS ERROR HANDLING
      // axios provides detailed error information

      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        // error.response.status = 404, 500, etc.
        // error.response.data = error response body
        console.error('Server Error:', error.response.status);
        console.error('Error Data:', error.response.data);
        setError(`Server Error: ${error.response.status}`);

      } else if (error.request) {
        // Request was made but no response received (network issue)
        // error.request = the request that was made
        console.error('Network Error: No response received');
        setError('Network Error: Please check your internet connection');

      } else {
        // Something else went wrong
        console.error('Error:', error.message);
        setError(`Error: ${error.message}`);
      }
    }

    setLoading(false);
  };

  // ============================================
  // useEffect - RUNS ON FIRST LOAD
  // ============================================
  
  useEffect(() => {
    // Fetch patient data when component mounts
    fetchPatients();
    
    // AUTO FOCUS the search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []); 
  // Empty [] = run only ONCE on mount

  // ============================================
  // useCallback HOOK - MEMOIZED FUNCTIONS
  // ============================================
  
  // USE 1: Memoize the refresh button click handler
  const refreshPatients = useCallback(() => {
    console.log('Refreshing patients...');
    fetchPatients();
  }, []); 

  // USE 2: Memoize the select handler passed to PatientCard
  const handleSelect = useCallback((patient) => {
    console.log('Patient selected:', patient.name);
    setSelectedPatient(patient);
  }, []); 

  // Scroll to top handler
  const scrollToTop = useCallback(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // ============================================
  // useMemo HOOK - MEMOIZED CALCULATIONS
  // ============================================
  
  // USE 1: Memoize the filtered patients list
  const filteredPatients = useMemo(() => {
    console.log('Filtering patients...');
    
    if (!search.trim()) {
      return patients;
    }
    
    const searchLower = search.toLowerCase();
    
    return patients.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower)
      );
    });
  }, [patients, search]); 

  // USE 2: Memoize the total patients count
  const totalPatients = useMemo(() => {
    console.log('Calculating total patients...');
    return filteredPatients.length;
  }, [filteredPatients]); 

  // ============================================
  // RENDER (JSX)
  // ============================================
  
  return (
    <div className="dashboard">
      {/* Top reference point for scroll-to-top */}
      <div ref={topRef}></div>

      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <h1>🏥 Healthcare Patient Dashboard</h1>
        <p className="header-subtitle">Patient Records Optimization System</p>
      </header>

      {/* ===== SECTION 1: Search, Refresh, Render Count ===== */}
      <section className="section-controls">
        <div className="controls-row">
          {/* Search Input with useRef for auto-focus */}
          <div className="search-container">
            <label htmlFor="search">Search Patient:</label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              ref={searchInputRef}  
              className="search-input"
            />
          </div>

          {/* Refresh Button with useCallback */}
          <button onClick={refreshPatients} className="refresh-btn">
            🔄 Refresh Patients
          </button>

          {/* Render Counter using useRef */}
          <div className="render-counter">
            <span>Render Count: </span>
            <strong>{renderCountRef.current}</strong>
          </div>
        </div>

        {/* Bonus 3: Last Refreshed Time */}
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

      {/* ===== SECTION 2: Total Patients (useMemo) ===== */}
      <section className="section-stats">
        <div className="stat-card">
          <h2>Total Patients</h2>
          <span className="stat-number">{totalPatients}</span>
        </div>

        {/* Bonus 2: Selected Patient */}
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

      {/* ===== SECTION 3: Patient Cards ===== */}
      <section className="section-patients">
        <h2>Patient Records</h2>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="no-results">No patients found for "{search}"</div>
        ) : (
          <div className="patients-grid">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                handleSelect={handleSelect}
                searchTerm={search}
              />
            ))}
          </div>
        )}
      </section>

      {/* ===== SECTION 4: Scroll To Top Button ===== */}
      <section className="section-scroll">
        <button onClick={scrollToTop} className="scroll-btn">
          ⬆️ Scroll To Top
        </button>
      </section>
    </div>
  );
}

export default Dashboard;