import { useEffect, useState } from 'react';
import "./App.scss"
import Monitor from './Monitor';
import Actions from './Actions';
import { localStorageKey, Strategy } from './util';
import InputAuto from './InputAuto';


const App = () => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [refresh, setRefresh] = useState<string>('')
  const [hardRefetch, setHardRefetch] = useState<string>("")

  useEffect(() => {
    const existingData = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
    const comps: string[] = []
    existingData.map((strat: Strategy) => {
      comps.push(strat.symbol)
    })
    setCompanies([...comps])
  }, [])


  const handleRemoveCompany = (symbol: string) => {
    setCompanies(companies.filter((company) => company !== symbol));
  };

  const clearAll = () => {
    localStorage.clear()
    setCompanies([])
    setRefresh(new Date().toString())
  }


  const refetch = () => {
    setHardRefetch(new Date().toString())
  }

  const onSelected = (symbol: string) => {
    if (symbol && !companies.includes(symbol)) {
      setCompanies([...companies, symbol]);
    }
  }

  return (
    <div className="App">

      <h4 style={{ color: "#ef981f", textDecoration: "underline" }} className="center">Om Namah Shivaay!!!</h4>
      <div className="center" style={{ display: "flex", justifyContent: "center" }}>
        <InputAuto onSelected={onSelected} />
        {/* <button className="comp_btn" onClick={handleAddCompany}>Add Company</button> */}
        <button className="comp_btn" onClick={clearAll}>Clear All</button>
        <button className="comp_btn" onClick={() => window.open('/logs', '_blank')}>View All Logs</button>
        <button className="comp_btn" onClick={refetch}>Refetch</button>
      </div>
      <div style={{ marginTop: "2rem", marginBottom: "5rem" }}>
        <Actions key={refresh} />
        <hr />
        <Monitor hardRefetch={hardRefetch} setRefresh={setRefresh} key={companies.length} companies={companies} handleRemoveCompany={handleRemoveCompany} />
      </div>
    </div >
  );
}

export default App;
