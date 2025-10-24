import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import { useYouTubeResults } from "../../hooks/useYouTubeResults";

const Search: React.FC = () => {
    const [setQuery, results, isLoading, error, query] = useYouTubeResults();
    // We will use this to store the selected channel ID for the 2nd API call
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);

    return (
        <div style={{ position: "relative" }}>
            <h1>YouTuber</h1>
            <Form.Control
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);
                    setShowOptions(val.length > 2);
                }}
            />
            {
                // Checks if the user's query is at least 1 character long and
                // that there is at least 1 result. Need to add form submission
                // functionality and automation upon choosing an option
            }
            <Dropdown show={showOptions && results.length > 0}>
                <Dropdown.Menu show>
                    {
                        isLoading ? <p>Loading...</p> : (
                            error ? <p>Error: {error}</p> :
                            results.length > 0 ? results.map((item) => (
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
                            )) : <p>No results found</p>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
            {
                // Here we will send another API call to get the channel comments
            }
            {
            //showResults && <SummaryBox />
            }
        </div>
    );
};

export default Search;
