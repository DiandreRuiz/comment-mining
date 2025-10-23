import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";

const Search: React.FC = () => {
    const [query, setQuery] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const suggestions = ["apple", "banana", "lettuce", "bread"];

    const filtered = suggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

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
                    setShow(val.length > 0);
                }}
            />
            {
                // Checks if the user's query is at least 1 character long and
                // that there is at least 1 result. Need to add form submission
                // functionality and automation upon choosing an option
            }
            <Dropdown show={show && filtered.length > 0}>
                <Dropdown.Menu show>
                    {filtered.map((item) => (
                        <Dropdown.Item
                            key={item}
                            onClick={() => {
                                setQuery(item);
                                setShow(false);
                            }}
                        >
                            {item}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default Search;
