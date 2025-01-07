/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { BASE_API, localStorageKey, Strategy } from "./util";


interface MonitorIntefrace {
    companies: string[]
    handleRemoveCompany: (symbol: string) => void
    setRefresh: (val: string) => void
    hardRefetch: string
}

const Monitor = (props: MonitorIntefrace) => {
    const { setRefresh, companies, handleRemoveCompany, hardRefetch } = props

    const [companyStrategies, setCompanyStrategies] = useState<Record<string, Strategy | null>>({});

    useEffect(() => {
        fetchAllComps()
        // Set interval to call fetchStrategy every 30 seconds
        const intervalId = setInterval(() => {
            fetchAllComps()
            // 30 seconds
        }, 30000);

        return () => clearInterval(intervalId);

    }, [companies, hardRefetch]);




    const fetchAllComps = () => {

        companies.map(symbol => {
            fetchStrategy(symbol)
        })

    }

    const fetchStrategy = async (symbol: string) => {
        if (symbol) {
            try {
                const response = await axios.get(`${BASE_API}trading-strategy/${symbol}/`);
                const fetchedStrategy = response.data.strategy;
                const livePrice = fetchedStrategy?.current_price;

                setCompanyStrategies((prevState) => ({
                    ...prevState,
                    [symbol]: response.data.strategy,
                }));

                const localStorageKey = "companyStrategies";
                const storedData = JSON.parse(localStorage.getItem(localStorageKey) || "[]");

                // Check if company already exists in local storage
                const updatedData = storedData.map((entry: Strategy) => {
                    if (entry.symbol === symbol) {
                        return { ...entry, live_price: livePrice }; // Update live_price
                    }
                    return entry;
                });

                localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
                setRefresh(new Date().toString())
            } catch (error) {
                console.error("Error fetching strategy:", error);
            }
        }
    };


    const handleAction = (strategy: Strategy | null) => {
        if (!strategy) return;

        const existingData = JSON.parse(localStorage.getItem(localStorageKey) || "[]"); // Retrieve existing data or initialize an empty array

        const updatedData = existingData.filter((item: Strategy) => item.symbol !== strategy.symbol);

        updatedData.push(strategy);

        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
        setRefresh(new Date().toString())
    };

    return <div>
        {companies.length > 0 && (
            <div>   <p><b>  Monitor: </b></p>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Action</th>
                                <th>Current Price</th>
                                <th>Target Profit</th>
                                <th>Stop Loss Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company) => {
                                return companyStrategies[company] && (
                                    <tr key={company}>
                                        <td>{company}</td>
                                        <td>
                                            <button className={`comp_btn ${companyStrategies[company].type === "SELL" ? "sell_btn" : companyStrategies[company].type === "BUY" ? "buy_btn" : "mod_btn"}`} onClick={() => handleAction(companyStrategies[company])}>{companyStrategies[company].type}</button>
                                        </td>
                                        <td>{companyStrategies[company].current_price.toFixed(2)}</td>
                                        <td>{companyStrategies[company].target_profit.toFixed(2)}</td>
                                        <td>{companyStrategies[company].stop_loss.toFixed(2)}</td>
                                        <td><MdDeleteOutline className="icons delete" onClick={() => handleRemoveCompany(company)} />
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>

                </div>
            </div>
        )
        }
    </div >


}

export default Monitor