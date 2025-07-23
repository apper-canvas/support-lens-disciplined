import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import FilterPanel from "@/components/organisms/FilterPanel";
import AppsTable from "@/components/organisms/AppsTable";
import AppDetailModal from "@/components/organisms/AppDetailModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { appsService } from "@/services/api/appsService";
import { aiLogsService } from "@/services/api/aiLogsService";

const AppsOverview = () => {
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedApps, setSelectedApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [appLogs, setAppLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    statuses: [],
    plans: []
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [apps, searchValue, filters]);

  const loadApps = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await appsService.getAll();
      setApps(data);
      setLastUpdated(new Date());
      toast.success("Apps data refreshed successfully");
    } catch (err) {
      setError("Failed to load apps data. Please try again.");
      toast.error("Failed to load apps data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...apps];

    // Search filter
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        app =>
          app.name.toLowerCase().includes(search) ||
          app.userEmail.toLowerCase().includes(search) ||
          app.category.toLowerCase().includes(search) ||
          app.chatAnalysisStatus.toLowerCase().includes(search) ||
          app.company.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(app =>
        filters.statuses.includes(app.chatAnalysisStatus)
      );
    }

    // Plan filter
    if (filters.plans.length > 0) {
      filtered = filtered.filter(app =>
        filters.plans.includes(app.plan)
      );
    }

    setFilteredApps(filtered);
  };

  const handleAppClick = async (app) => {
    try {
      setSelectedApp(app);
      const logs = await aiLogsService.getByAppId(app.id);
      setAppLogs(logs);
      setModalOpen(true);
    } catch (err) {
      toast.error("Failed to load app details");
    }
  };

  const handleExport = () => {
    const csvData = filteredApps.map(app => ({
      "App Name": app.name,
      "Category": app.category,
      "User Email": app.userEmail,
      "Company": app.company,
      "Plan": app.plan,
      "Status": app.chatAnalysisStatus,
      "Messages": app.totalMessages,
      "DB Connected": app.dbConnected ? "Yes" : "No",
      "Sentiment Score": app.sentimentScore,
      "Last Activity": new Date(app.lastActivity).toLocaleString()
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apps-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully");
  };

  const handleClearFilters = () => {
    setFilters({ statuses: [], plans: [] });
    setSearchValue("");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadApps} />;

  return (
    <div className="p-6">
      <Header
        title="Apps Overview"
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        onRefresh={loadApps}
        onExport={handleExport}
        isLoading={loading}
        lastUpdated={lastUpdated}
      />

      <FilterPanel
        isOpen={filtersOpen}
        onToggle={() => setFiltersOpen(!filtersOpen)}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {filteredApps.length === 0 ? (
        <Empty
          title="No apps found"
          description="No apps match your current search and filter criteria."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
          icon="Search"
        />
      ) : (
        <AppsTable
          apps={filteredApps}
          onAppClick={handleAppClick}
          selectedApps={selectedApps}
          onSelectionChange={setSelectedApps}
        />
      )}

      <AppDetailModal
        app={selectedApp}
        aiLogs={appLogs}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AppsOverview;