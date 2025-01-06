// src/App.js
import { useEffect, useState } from 'react';
import axios from 'axios';

type StockActions = "BUY" | "SELL" | "MONITORING"

interface Strategy {
  symbol: string,
  type: StockActions,
  current_price: number,
  target_profit: number,
  stop_loss: number,
}


const App = () => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [newCompany, setNewCompany] = useState<string>('');
  const [companyStrategies, setCompanyStrategies] = useState<Record<string, Strategy | null>>({});

  useEffect(() => {
    // Set interval to call fetchStrategy every 30 seconds
    const intervalId = setInterval(() => {
      companies.map(symbol => {
        fetchStrategy(symbol)
      })
      // 30 seconds
    }, 30000);

    return () => clearInterval(intervalId);
  }, [companies]);

  const handleAddCompany = () => {
    if (newCompany && !companies.includes(newCompany)) {
      setCompanies([...companies, newCompany]);
      setNewCompany('');
      fetchStrategy(newCompany);
    }
  };

  const handleRemoveCompany = (symbol: string) => {
    setCompanies(companies.filter((company) => company !== symbol));
  };

  const fetchStrategy = async (symbol: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/trading-strategy/${symbol}/`);
      setCompanyStrategies((prevState) => ({
        ...prevState,
        [symbol]: response.data.strategy,
      }));
    } catch (error) {
      console.error('Error fetching strategy:', error);
    }
  };

  return (
    <div className="App">
      <h1>Stock Trading Strategy</h1>

      <input
        type="text"
        value={newCompany}
        onChange={(e) => setNewCompany(e.target.value)}
        placeholder="Enter Company Symbol (e.g., TCS.NS)"
      />
      <button onClick={handleAddCompany}>Add Company</button>

      <div>
        {companies.length > 0 && (
          <ul>
            {companies.map((company) => (
              <li key={company}>
                {company}
                <button onClick={() => handleRemoveCompany(company)}>Remove</button>
                <div>
                  <h3>Strategy for {company}</h3>
                  <div>
                    {companyStrategies[company] ? (
                      <div>
                        <p>Action: {companyStrategies[company].type}</p>
                        <p>Current Price: {companyStrategies[company].current_price}</p>
                        <p>Target Profit: {companyStrategies[company].target_profit}</p>
                        <p>Stop Loss Price: {companyStrategies[company].stop_loss}</p>

                      </div>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
