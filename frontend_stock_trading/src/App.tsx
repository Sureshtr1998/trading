import { useEffect, useState } from 'react';
import axios from 'axios';
import "./App.scss"
import { MdDeleteOutline } from "react-icons/md";

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
      fetchAllComps()
      // 30 seconds
    }, 30000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllComps = () => {
    companies.map(symbol => {
      fetchStrategy(symbol)
    })
  }

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

      <h2 style={{ color: "#ef981f", textDecoration: "underline" }} className="center">Om Namah Shivaay!!!</h2>
      <div className="center">

        <input
          className="center"
          type="text"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          placeholder="Enter Company Symbol (e.g., TCS.NS)"
        />


        <br />
        <button className="add_comp_btn" onClick={handleAddCompany}>Add Company</button>
      </div>
      <div>
        {companies.length > 0 && (
          <div>
            <table>
              <tr>
                <th>Company</th>
                <th>Action</th>
                <th>Current Price</th>
                <th>Target Profit</th>
                <th>Stop Loss Price</th>
                <th></th>
              </tr>
              {companies.map((company) => {
                return companyStrategies[company] && (
                  <tr key={company}>
                    <td>{company}</td>
                    <td>{companyStrategies[company].type}</td>
                    <td>{companyStrategies[company].current_price}</td>
                    <td>{companyStrategies[company].target_profit}</td>
                    <td>{companyStrategies[company].stop_loss}</td>
                    <td><MdDeleteOutline className="icons delete" onClick={() => handleRemoveCompany(company)} />
                    </td>
                  </tr>
                )
              })
              }
            </table>
            <div className='table_action'>
              <p onClick={fetchAllComps}> Refresh</p>
            </div>
          </div>
        )
        }
      </div >
    </div >
  );
}

export default App;
