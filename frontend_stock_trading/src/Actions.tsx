import { useEffect, useState } from "react";
import { localStorageKey, Strategy } from "./util";
import { MdDeleteOutline } from "react-icons/md";


const Actions = () => {
    const [strategies, setStrategies] = useState<Strategy[]>([]);

    useEffect(() => {
        // Fetch data from local storage on component mount
        const storedData = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
        setStrategies(storedData);
    }, []);

    const calculatePercentage = (type: string, livePrice: number, purchasedPrice: number) => {
        if (purchasedPrice === 0) return 0; // Prevent division by zero
        const percentage =
            ((livePrice - purchasedPrice) / purchasedPrice) * 100;

        // Adjust for SELL or BUY
        if (type === 'SELL') {
            return -(percentage); // For sell it is inverse
        } else if (type === 'BUY') {
            return (percentage);
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
            setStrategies(updatedData)

        } else {
            console.warn("No data found in local storage.");
        }
    };



    return (
        <div>
            {strategies.length > 0 &&
                <div>
                    <p><b>  Actions: </b></p>
                    <table>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Type</th>
                                <th>Purchased Price</th>
                                <th>Live Price</th>
                                <th>Profit Percentage</th>
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            {strategies.map((strategy, index) => (
                                <tr key={index}>
                                    <td>{strategy.symbol}</td>
                                    <td
                                        style={{
                                            color: strategy.type === "BUY" ? "green" : strategy.type === "SELL" ? "red" : "black",
                                        }}
                                    >
                                        {strategy.type}
                                    </td>
                                    <td>{strategy.current_price}</td>
                                    <td>{strategy.live_price}</td>
                                    <td
                                        style={{
                                            color: calculatePercentage(strategy.type, strategy.live_price ?? 0, strategy.current_price) > 0
                                                ? 'green'
                                                : 'red',
                                        }}
                                    >
                                        {formatPercentage(
                                            calculatePercentage(strategy.type, strategy.live_price ?? 0, strategy.current_price)
                                        )}
                                    </td>
                                    <td><MdDeleteOutline className="icons delete" onClick={() => handleRemoveCompany(strategy.symbol)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
};

export default Actions;
