import { useState, useContext } from "react";

const YoutubeSearchContext = () => {
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
    const [channelRecentVideoLinks, setChannelRecentVideoLinks] = useState<string[]>([]);
    const [channelComments, setChannelComments] = useState<string[]>([]);
};
