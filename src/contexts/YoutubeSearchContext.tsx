import React, { useState, useContext, createContext } from "react";

type YoutubeSearchDataContextType = {
    selectedChannelId: string | null;
    channelRecentVideoLinks: string[];
    channelComments: string[];
    loading: boolean;
    error: string | null;
};

const YoutubeSearchDataContext = createContext<YoutubeSearchDataContextType | undefined>(undefined);

type YoutubeSearchDataContextProviderProps = {
    children: React.ReactNode;
};

export const YoutubeSearchDataContextProvider: React.FC<YoutubeSearchDataContextProviderProps> = ({ children }) => {
    const [selectedChannelId, setSelectedChannelId] = useState(null);
    const [channelRecentVideoLinks, setChannelRecentVideoLinks] = useState([]);
    const [channelComments, setChannelComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRecentVideoLinks = (channelId: string) => {};

    return <YoutubeSearchDataContext.Provider value={{ selectedChannelId, channelRecentVideoLinks, channelComments, loading, error }}>{children}</YoutubeSearchDataContext.Provider>;
};
