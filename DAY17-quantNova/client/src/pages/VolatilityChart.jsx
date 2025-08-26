import React, { useMemo, useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

// Comprehensive company/asset database
const COMPANIES = [
  // Major US Stocks
  { name: "Apple Inc.", symbol: "AAPL", category: "Technology" },
  { name: "Microsoft Corporation", symbol: "MSFT", category: "Technology" },
  { name: "Amazon.com Inc.", symbol: "AMZN", category: "E-commerce" },
  { name: "Alphabet Inc. (Google)", symbol: "GOOGL", category: "Technology" },
  { name: "Tesla Inc.", symbol: "TSLA", category: "Electric Vehicles" },
  { name: "Meta Platforms Inc.", symbol: "META", category: "Social Media" },
  { name: "NVIDIA Corporation", symbol: "NVDA", category: "Semiconductors" },
  { name: "Netflix Inc.", symbol: "NFLX", category: "Entertainment" },
  { name: "PayPal Holdings Inc.", symbol: "PYPL", category: "Fintech" },
  { name: "Adobe Inc.", symbol: "ADBE", category: "Software" },
  { name: "Salesforce Inc.", symbol: "CRM", category: "Cloud" },
  { name: "Intel Corporation", symbol: "INTC", category: "Semiconductors" },
  { name: "Advanced Micro Devices", symbol: "AMD", category: "Semiconductors" },
  { name: "Zoom Video Communications", symbol: "ZM", category: "Communications" },
  { name: "Spotify Technology SA", symbol: "SPOT", category: "Entertainment" },
  { name: "Uber Technologies Inc.", symbol: "UBER", category: "Transportation" },
  { name: "Airbnb Inc.", symbol: "ABNB", category: "Travel" },
  { name: "Square Inc.", symbol: "SQ", category: "Fintech" },
  { name: "Coinbase Global Inc.", symbol: "COIN", category: "Cryptocurrency" },
  { name: "Palantir Technologies", symbol: "PLTR", category: "Data Analytics" },
  
  // Traditional Stocks
  { name: "Johnson & Johnson", symbol: "JNJ", category: "Healthcare" },
  { name: "Procter & Gamble Co.", symbol: "PG", category: "Consumer Goods" },
  { name: "The Coca-Cola Company", symbol: "KO", category: "Beverages" },
  { name: "JPMorgan Chase & Co.", symbol: "JPM", category: "Banking" },
  { name: "Visa Inc.", symbol: "V", category: "Financial Services" },
  { name: "Mastercard Inc.", symbol: "MA", category: "Financial Services" },
  { name: "Bank of America Corp.", symbol: "BAC", category: "Banking" },
  { name: "Wells Fargo & Company", symbol: "WFC", category: "Banking" },
  { name: "ExxonMobil Corporation", symbol: "XOM", category: "Energy" },
  { name: "Chevron Corporation", symbol: "CVX", category: "Energy" },
  
  // ETFs
  { name: "SPDR S&P 500 ETF Trust", symbol: "SPY", category: "ETF" },
  { name: "Invesco QQQ Trust", symbol: "QQQ", category: "ETF" },
  { name: "iShares Russell 2000 ETF", symbol: "IWM", category: "ETF" },
  { name: "Vanguard Total Stock Market", symbol: "VTI", category: "ETF" },
  { name: "iShares MSCI Emerging Markets", symbol: "EEM", category: "ETF" },
  { name: "SPDR Gold Shares", symbol: "GLD", category: "Commodities" },
  { name: "United States Oil Fund", symbol: "USO", category: "Commodities" },
  { name: "VanEck Vectors Gold Miners", symbol: "GDX", category: "Mining" },
  
  // Cryptocurrencies
  { name: "Bitcoin", symbol: "BTC-USD", category: "Cryptocurrency" },
  { name: "Ethereum", symbol: "ETH-USD", category: "Cryptocurrency" },
  { name: "Cardano", symbol: "ADA-USD", category: "Cryptocurrency" },
  { name: "Solana", symbol: "SOL-USD", category: "Cryptocurrency" },
  { name: "Polygon", symbol: "MATIC-USD", category: "Cryptocurrency" },
  { name: "Chainlink", symbol: "LINK-USD", category: "Cryptocurrency" },
  { name: "Litecoin", symbol: "LTC-USD", category: "Cryptocurrency" },
  { name: "Dogecoin", symbol: "DOGE-USD", category: "Cryptocurrency" },
  
  // International Stocks
  { name: "Alibaba Group Holding", symbol: "BABA", category: "E-commerce" },
  { name: "Taiwan Semiconductor", symbol: "TSM", category: "Semiconductors" },
  { name: "ASML Holding NV", symbol: "ASML", category: "Semiconductors" },
  { name: "Shopify Inc.", symbol: "SHOP", category: "E-commerce" },
  { name: "Sea Limited", symbol: "SE", category: "E-commerce" },
  { name: "Roku Inc.", symbol: "ROKU", category: "Entertainment" },
];

// Quick access presets
const QUICK_PRESETS = [
  { name: "S&P 500 ETF", symbol: "SPY" },
  { name: "Bitcoin", symbol: "BTC-USD" },
  { name: "Tesla", symbol: "TSLA" },
  { name: "Apple", symbol: "AAPL" },
];

export default function VolatilityChart() {
  const [symbol, setSymbol] = useState("SPY");
  const [windowSize, setWindowSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [rmse, setRmse] = useState(null);
  const [title, setTitle] = useState("");
  const [dataResp, setDataResp] = useState(null);
  const [error, setError] = useState("");
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://quantnova.onrender.com/api/volatility?symbol=${encodeURIComponent(symbol)}&window=${windowSize}`
      );
      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json") ? await res.json() : { detail: await res.text() };
      if (!res.ok) throw new Error(payload.detail || "Request failed");
      setRmse(payload.rmse);
      setTitle(payload.title);
      setDataResp(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return COMPANIES.slice(0, 10); // Show first 10 by default
    
    const term = searchTerm.toLowerCase();
    return COMPANIES.filter(company => 
      company.name.toLowerCase().includes(term) ||
      company.symbol.toLowerCase().includes(term) ||
      company.category.toLowerCase().includes(term)
    ).slice(0, 15); // Limit to 15 results
  }, [searchTerm]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
    setFocusedIndex(-1);
    
    // If the value matches a symbol exactly, set it
    const exactMatch = COMPANIES.find(c => c.symbol.toLowerCase() === value.toLowerCase());
    if (exactMatch) {
      setSymbol(exactMatch.symbol);
    } else {
      // Allow free typing for custom symbols
      setSymbol(value.toUpperCase());
    }
  };

  // Handle company selection from dropdown
  const selectCompany = (company) => {
    setSymbol(company.symbol);
    setSearchTerm(company.name);
    setShowDropdown(false);
    setFocusedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || filteredCompanies.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredCompanies.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          selectCompany(filteredCompanies[focusedIndex]);
        } else {
          fetchData();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setFocusedIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize search term with selected company name
  useEffect(() => {
    const selectedCompany = COMPANIES.find(c => c.symbol === symbol);
    if (selectedCompany && !searchTerm) {
      setSearchTerm(selectedCompany.name);
    }
  }, [symbol]);

  const chartData = useMemo(() => {
    if (!dataResp) return null;
    return {
      labels: dataResp.dates,
      datasets: [
        {
          label: "Actual Volatility",
          data: dataResp.actual,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.25,
          borderColor: "rgba(99, 179, 237, 1)",
          backgroundColor: "rgba(99, 179, 237, 0.15)",
          fill: true,
        },
        {
          label: "Predicted Volatility",
          data: dataResp.predicted,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.25,
          borderColor: "rgba(250, 171, 120, 1)",
          backgroundColor: "rgba(250, 171, 120, 0.10)",
          fill: true,
        },
      ],
    };
  }, [dataResp]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top", labels: { boxWidth: 12, color: "white" } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(4)}`
        }
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { color: "white", maxRotation: 45, minRotation: 45, autoSkip: true, maxTicksLimit: 12 },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { color: "white" },
        beginAtZero: true,
      },
    },
    elements: { point: { hitRadius: 6 } },
  }), []);

  return (
    <div style={{
      color: '#e5e7eb',
      background: 'linear-gradient(180deg, rgba(2,6,23,0.7), rgba(2,6,23,0.2))',
      border: '1px solid #334155',
      borderRadius: '16px',
      padding: '20px',
      maxWidth: '1100px',
      margin: '0 auto',
      boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
    }}>
      <header style={{ marginBottom: '16px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.25rem' }}>Volatility Chart</h2>
        <p style={{ margin: '0 0 16px', color: '#9ca3af' }}>
          Run the model on a symbol with a chosen rolling window.
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.6fr auto',
        gap: '16px',
        alignItems: 'end',
        marginBottom: '16px'
      }}>
        <div style={{ position: 'relative' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            color: '#9ca3af',
            marginBottom: '6px'
          }}>
            Company / Symbol
          </label>
          
          <div style={{ display: 'grid', gap: '8px' }} ref={dropdownRef}>
            {/* Enhanced search input */}
            <div style={{ position: 'relative' }}>
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search companies or enter symbol..."
                style={{
                  width: '100%',
                  background: '#0f172a',
                  color: '#e5e7eb',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '10px 40px 10px 12px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22d3ee';
                  e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.25)';
                  setShowDropdown(true);
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#334155';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              {/* Search icon */}
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}>
                🔍
              </div>
              
              {/* Dropdown */}
              {showDropdown && filteredCompanies.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  marginTop: '4px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
                }}>
                  {filteredCompanies.map((company, index) => (
                    <div
                      key={company.symbol}
                      onClick={() => selectCompany(company)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: index < filteredCompanies.length - 1 ? '1px solid #1f2937' : 'none',
                        background: index === focusedIndex ? '#1f2937' : 'transparent'
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                        {company.name}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#9ca3af',
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <span style={{ fontWeight: '600', color: '#22d3ee' }}>
                          {company.symbol}
                        </span>
                        <span>•</span>
                        <span>{company.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick-pick chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.symbol}
                  type="button"
                  onClick={() => {
                    setSymbol(preset.symbol);
                    setSearchTerm(preset.name);
                    setShowDropdown(false);
                  }}
                  style={{
                    background: symbol === preset.symbol ? '#0ea5e9' : '#1f2937',
                    border: '1px solid #334155',
                    borderColor: symbol === preset.symbol ? 'transparent' : '#334155',
                    color: symbol === preset.symbol ? '#081018' : '#e5e7eb',
                    padding: '6px 10px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                  title={preset.name}
                >
                  {preset.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            color: '#9ca3af',
            marginBottom: '6px'
          }}>
            Window
          </label>
          <input
            type="number"
            min={2}
            max={60}
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
            style={{
              width: '100%',
              background: '#0f172a',
              color: '#e5e7eb',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '10px 12px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#22d3ee';
              e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#334155';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input
            type="range"
            min={2}
            max={60}
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
            style={{
              width: '100%',
              marginTop: '8px',
              accentColor: '#22d3ee'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'end' }}>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
              color: '#06121b',
              border: '0',
              borderRadius: '12px',
              padding: '10px 16px',
              fontWeight: '600',
              cursor: loading ? 'default' : 'pointer',
              minWidth: '88px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(0,0,0,0.15)',
                borderTopColor: 'rgba(0,0,0,0.55)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
            ) : "Run"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          color: '#fecaca',
          padding: '10px 12px',
          borderRadius: '12px',
          marginBottom: '10px'
        }}>
          {error}
        </div>
      )}

      {rmse !== null && (
        <div style={{ marginBottom: '6px', color: '#e5e7eb' }}>
          <span><strong>Test RMSE:</strong> {rmse.toFixed(4)}</span>
        </div>
      )}

      {title && (
        <h3 style={{ margin: '6px 0 10px 0', fontSize: '1.1rem' }}>{title}</h3>
      )}

      <div style={{
        height: '460px',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '12px'
      }}>
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div style={{
            color: '#9ca3af',
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            fontStyle: 'italic'
          }}>
            Run the model to see a chart.
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}