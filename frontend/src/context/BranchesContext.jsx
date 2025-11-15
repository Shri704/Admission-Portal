import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getBranches } from "../services/branchService.js";

const BranchesContext = createContext(null);

export function BranchesProvider({ children }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBranches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBranches();
      const branchesData = response?.data || [];
      setBranches(branchesData);
      return branchesData;
    } catch (error) {
      console.error("Error loading branches:", error);
      setBranches([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  // Format branches for dropdown use (matching the old BRANCHES constant format)
  const branchesForSelect = branches.map((branch) => ({
    label: branch.name,
    value: branch.code,
  }));

  const value = {
    branches,
    branchesForSelect,
    loading,
    refreshBranches: loadBranches,
  };

  return (
    <BranchesContext.Provider value={value}>{children}</BranchesContext.Provider>
  );
}

export function useBranches() {
  const context = useContext(BranchesContext);
  if (!context) {
    throw new Error("useBranches must be used within a BranchesProvider");
  }
  return context;
}

