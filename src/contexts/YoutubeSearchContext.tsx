import React, { useState, useContext, createContext } from "react";

type YoutubeSearchDataContextType = {
    selectedChannelId: string | null;
    channelRecentVideoLinks: string[];
    channelComments: string[];
    isLoading: boolean;
    error: string | null;
};

const SearchContext = createContext<YoutubeSearchDataContextType | undefined>(undefined);

type YoutubeSearchDataContextProviderProps = {
    children: React.ReactNode;
    fetchRecentVideoLinks: (channelId: string) => Promise<string[]>;
    fetchRecentVideoComments: (recentVideoLinks: string[]) => Promise<string[]>;
};

export const YoutubeSearchDataContextProvider: React.FC<YoutubeSearchDataContextProviderProps> = ({ children, fetchRecentVideoLinks, fetchRecentVideoComments }) => {
    
};
