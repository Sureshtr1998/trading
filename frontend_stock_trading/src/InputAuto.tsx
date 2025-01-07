import { useState } from "react";
import "./AutoInput.scss";
import all_stocks from "./all_stocks.json";

interface InputAutoInterface {
    onSelected: (symbol: string) => void;
}

interface Suggestion {
    key: string;
    value: string;
}

type StockDictionary = {
    [key: string]: string;
};


const InputAuto = (props: InputAutoInterface) => {

    const { onSelected } = props;

    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isHideSuggs, setIsHideSuggs] = useState(false);
    const [selectedVal, setSelectedVal] = useState("");


    type InputEvent = React.ChangeEvent<HTMLInputElement>;


    const handleChange = (e: InputEvent) => {
        const input = e.target.value.trim();
        setIsHideSuggs(false);
        setSelectedVal(input);



        // Filter all_stocks based on input matching either key or value
        if (input.length > 0) {
            const matches = all_stocks.flatMap((entry: StockDictionary) => {
                const [key, value] = Object.entries(entry)[0];
                return key.toLowerCase().startsWith(input.toLowerCase()) ||
                    value.toLowerCase().startsWith(input.toLowerCase())
                    ? { key, value } // Return as a key-value pair object
                    : [];
            });

            setSuggestions(matches); // Update state with key-value pair objects
        } else {
            setSuggestions([]);
        }
    };

    // Hide suggestions and handle selected value
    const hideSuggs = (value: string) => {
        onSelected(value);
        setSelectedVal("");
        setIsHideSuggs(true);
    };

    return (
        <div className="sugesstion-auto">
            <input
                placeholder="Enter Company Name or Symbol"
                type="search"
                value={selectedVal}
                onChange={handleChange}
            />
            {selectedVal.length > 0 && (
                <div
                    className="suggestions"
                    style={{ display: isHideSuggs ? "none" : "block" }}
                >
                    {suggestions.map((sugg: Suggestion) => (
                        <div key={sugg.key}
                            onClick={() => {
                                hideSuggs(sugg.key);
                            }}
                        >
                            {sugg.key} - {sugg.value}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InputAuto;
