import { useState, useEffect } from "react";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { Strategy, localStorageKey } from "./util";

const Actions = () => {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [editingRow, setEditingRow] = useState<string | null>(null);

    useEffect(() => {
        // Fetch data from local storage on component mount
        const storedData = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
        setStrategies(storedData);
    }, []);

    const calculatePercentage = (type: string, livePrice: number, purchasedPrice: number) => {
        if (purchasedPrice === 0) return 0; // Prevent division by zero
        const percentage = ((livePrice - purchasedPrice) / purchasedPrice) * 100;

        // Adjust for SELL or BUY
        if (type === 'SELL') {
            return -(percentage); // For sell it is inverse
        } else if (type === 'BUY') {
            return percentage;
        }

        return percentage;
    };

    const formatPercentage = (percentage: number) => {
        return `${percentage.toFixed(2)}%`;
    };

    const handleRemoveCompany = (symbol: string) => {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const updatedData = parsedData.filter((item: Strategy) => item.symbol !== symbol);
            localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
            setStrategies(updatedData);
        } else {
            console.warn("No data found in local storage.");
        }
    };

    const handleSave = (symbol: string, newPrice: number) => {
        const updatedStrategies = strategies.map((strategy) =>
            strategy.symbol === symbol
                ? { ...strategy, current_price: newPrice }
                : strategy
        );

        // Save to local storage
        localStorage.setItem(localStorageKey, JSON.stringify(updatedStrategies));
        setStrategies(updatedStrategies);
        setEditingRow(null); // Exit editing mode
    };

    const calcTotalProfit = () => {
        let val = 0
        strategies.map((strategy) => {
            if (strategy.type !== "MONITORING") {
                val = val + calculatePercentage(strategy.type, strategy.live_price ?? 0, strategy.current_price)
            }
        })
        return val
    }

    return (
        <div>
            {strategies.length > 0 && (
                <div>
                    <div style={{ display: "flex", justifySelf: "center" }}>
                        <p style={{ color: "#ef981f", textDecoration: "underline" }} className="center">
                            <b>Purchased Items</b>
                        </p>
                        <p style={{ marginLeft: "1rem", color: "#ef981f", textDecoration: "underline" }}>Total Profit: <span style={{
                            color: calcTotalProfit() > 0
                                ? "green"
                                : "red",
                        }}>  {calcTotalProfit().toFixed(2)}</span> </p>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Type</th>
                                    <th>Purchased Price</th>
                                    <th>Purchased Rating</th>
                                    <th>Live Price</th>
                                    <th>Profit Percentage</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {strategies.map((strategy) => (
                                    <tr key={strategy.symbol}>
                                        <td>{strategy.symbol}</td>
                                        <td
                                            style={{
                                                color: strategy.type === "BUY" ? "green" : strategy.type === "SELL" ? "red" : "gray",
                                            }}
                                        >
                                            {strategy.type}
                                        </td>
                                        <td
                                            onClick={() => setEditingRow(strategy.symbol)}
                                            style={{ cursor: "pointer" }}
                                        >

                                            {editingRow === strategy.symbol ? (
                                                <input
                                                    className="purchased_input"
                                                    type="number"
                                                    defaultValue={strategy.current_price.toFixed(2)}
                                                    onBlur={(e) => handleSave(strategy.symbol, parseFloat(e.target.value))}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleSave(strategy.symbol, parseFloat((e.target as HTMLInputElement).value));
                                                        }
                                                        if (e.key === "Escape") {
                                                            setEditingRow(null);
                                                        }
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                strategy.current_price.toFixed(2)
                                            )}
                                            <MdOutlineEdit className="icons edit" />
                                        </td>
                                        <td>
                                            {[...Array(5)].map((_, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        color:
                                                            index <
                                                                (strategy.rating ?? 0)
                                                                ? "#fd7403"
                                                                : "#CCCCCC",
                                                        fontSize: "18px",
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </td>

                                        <td>{strategy.live_price?.toFixed(2)}</td>
                                        <td
                                            style={{
                                                color: calculatePercentage(strategy.type, strategy.live_price ?? 0, strategy.current_price) > 0
                                                    ? "green"
                                                    : "red",
                                            }}
                                        >
                                            {formatPercentage(
                                                calculatePercentage(strategy.type, strategy.live_price ?? 0, strategy.current_price)
                                            )}
                                        </td>
                                        <td>
                                            <MdDeleteOutline
                                                className="icons delete"
                                                onClick={() => handleRemoveCompany(strategy.symbol)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Actions;
