import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { useYouTubeResults } from "../../hooks/useYoutubeResults";
import SummaryBox from "./SummaryBox";

const Search: React.FC = () => {
    const [setQuery, setSelectedChannelId, results, isLoading, error, query, selectedChannelId] = useYouTubeResults();
    // We will use this to store the selected channel ID for the 2nd API call
    const [showOptions, setShowOptions] = useState<boolean>(false);

    useEffect(() => {
        const testBackend = async () => {
            try {
                const response = await fetch("/api");
                console.log("Backend says:", response);
            } catch (err) {
                console.error("Error calling backend:", err);
            }
        };

        testBackend();
    }, []);

    return (
        <div style={{ position: "relative" }}>
            <h1>YouTube Channel Search</h1>
            <div className="d-flex justify-content-center mb-5">
                <InputGroup style={{ width: "50%" }}>
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => {
                            const val = e.target.value;
                            setQuery(val);
                            setShowOptions(val.length > 2);
                        }}
                        style={{ boxShadow: "none" }}
                        onFocus={(e) => (e.target.style.boxShadow = "none")}
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                    />
                    <Button type="submit" variant="primary">
                        Research
                    </Button>
                </InputGroup>
            </div>

            {
                // Checks if the user's query is at least 1 character long and
                // that there is at least 1 result. Need to add form submission
                // functionality and automation upon choosing an option
            }
            <Dropdown show={showOptions} className="mx-auto w-50">
                <Dropdown.Menu>
                    {isLoading ? (
                        <div className="text-center p-2">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <div className="px-3 py-2">Error: {error}</div>
                    ) : results.length > 0 ? (
                        results.map((item) => (
                            <Dropdown.Item
                                key={item.id.channelId}
                                onClick={() => {
                                    setSelectedChannelId(item.id.channelId ?? null);
                                    setShowOptions(false);
                                    setQuery(item.snippet.title);
                                }}
                            >
                                {item.snippet.title}
                            </Dropdown.Item>
                        ))
                    ) : (
                        <div className="text-center p-2">
                            <Spinner />
                        </div>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            {selectedChannelId && <SummaryBox channelId={selectedChannelId} />}
        </div>
    );
};

export default Search;
