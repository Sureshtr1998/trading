import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API } from './util';

interface LogEntry {
    time: string;
    company: string;
    currentPrice: number;
    targetProfit: number;
    stopLoss: number;
}

const Logs = () => {
    const [logContent, setLogContent] = useState<LogEntry[]>([]);
    const [filter, setFilter] = useState<string>("");

    useEffect(() => {
        fetchLogs()
        const intervalId = setInterval(() => {
            fetchLogs()
        }, 30000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axios.get(`${BASE_API}get_log`);
            const logs = parseLogs(response.data.log_content);
            setLogContent(logs);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const parseLogs = (logArray: string[]): LogEntry[] => {
        return logArray.map((log: string) => {
            const timeMatch = log.match(/^\S+\s\S+/);
            const companyMatch = log.match(/Alert for: (\S+)/);
            const priceMatch = log.match(/'current_price':\s*([\d.]+)/);
            const targetMatch = log.match(/'target_profit':\s*([\d.]+)/);
            const stopMatch = log.match(/'stop_loss':\s*([\d.]+)/);

            return {
                time: timeMatch ? timeMatch[0] : '',
                company: companyMatch ? companyMatch[1] : '',
                currentPrice: priceMatch ? parseFloat(priceMatch[1]) : 0,
                targetProfit: targetMatch ? parseFloat(targetMatch[1]) : 0,
                stopLoss: stopMatch ? parseFloat(stopMatch[1]) : 0,
            };
        });
    };

    const filteredLogs = logContent.filter((log) =>
        log.company.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <h2 style={{ color: "#ef981f", textDecoration: "underline" }} className="center">Logs</h2>
            <div className="center">
                <input
                    className="center"
                    type="text"
                    placeholder="Filter by company"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ marginBottom: "10px", padding: "5px" }}
                />
            </div>
            <div className="table-container">
                <table>
                    <thead >
                        <tr>
                            <th>Time</th>
                            <th>Company</th>
                            <th>Current Price</th>
                            <th>Target Profit</th>
                            <th>Stop Loss</th>
                        </tr>
                    </thead>
                    <tbody >
                        {filteredLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.time}</td>
                                <td>{log.company}</td>
                                <td>{log.currentPrice}</td>
                                <td>{log.targetProfit}</td>
                                <td>{log.stopLoss}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='table_action'>
                <p style={{ marginRight: '1rem' }} onClick={fetchLogs}> Refetch</p>
            </div>
        </div>
    );
};

export default Logs;
