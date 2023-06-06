// CachedSetsContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CachedSetsContext = createContext();

export const useCachedSets = () => {
    const context = useContext(CachedSetsContext);
    if (!context) {
        throw new Error("useCachedSets must be used within a CachedSetsProvider");
    }
    return context;
};

// CachedSetsContext.js
export const CachedSetsProvider = ({ children, address }) => {
    const [cachedSets, setCachedSets] = useState({});
    const [contextAddress, setContextAddress] = useState(address);

    useEffect(() => {
        setContextAddress(address);
    }, [address]);

    return (
        <CachedSetsContext.Provider
            value={{ cachedSets, setCachedSets, address: contextAddress }}
        >
            {children}
        </CachedSetsContext.Provider>
    );
};