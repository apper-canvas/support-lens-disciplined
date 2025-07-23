import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { aiLogsService } from "@/services/api/aiLogsService";

const AIAnalysis = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchValue, selectedStatus]);

  const loadLogs = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await aiLogsService.getAll();
      setLogs(data);
      setLastUpdated(new Date());
      toast.success("AI analysis data loaded successfully");
    } catch (err) {
      setError("Failed to load AI analysis data");
      toast.error("Failed to load AI analysis data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.status.toLowerCase().includes(search) ||
          log.message.toLowerCase().includes(search) ||
          log.appId.toLowerCase().includes(search)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(log => log.status === selectedStatus);
    }

    setFilteredLogs(filtered);
  };

  const getStatusDistribution = () => {
    const statusCounts = {};
    logs.forEach(log => {
      statusCounts[log.status] = (statusCounts[log.status] || 0) + 1;
    });
    return statusCounts;
  };

  const getSentimentTrendData = () => {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === date.toDateString();
      });
      
      const avgSentiment = dayLogs.length > 0 
        ? dayLogs.reduce((sum, log) => sum + log.sentiment, 0) / dayLogs.length
        : 0;
      
      last7Days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        sentiment: avgSentiment.toFixed(2)
      });
    }
    
    return last7Days;
  };

  const getFrustrationDistribution = () => {
    const ranges = {
      "Low (0-3)": 0,
      "Medium (4-6)": 0,
      "High (7-8)": 0,
      "Critical (9-10)": 0
    };
    
    logs.forEach(log => {
      if (log.frustrationLevel <= 3) ranges["Low (0-3)"]++;
      else if (log.frustrationLevel <= 6) ranges["Medium (4-6)"]++;
      else if (log.frustrationLevel <= 8) ranges["High (7-8)"]++;
      else ranges["Critical (9-10)"]++;
    });
    
    return ranges;
  };

  const handleExport = () => {
    const csvData = filteredLogs.map(log => ({
      "App ID": log.appId,
      "Timestamp": new Date(log.timestamp).toLocaleString(),
      "Status": log.status,
      "Sentiment": log.sentiment,
      "Frustration Level": log.frustrationLevel,
      "Technical Complexity": log.technicalComplexity,
      "Message": log.message
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-analysis-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("AI analysis data exported successfully");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLogs} />;

  const statusDistribution = getStatusDistribution();
  const sentimentTrend = getSentimentTrendData();
  const frustrationDistribution = getFrustrationDistribution();

  const pieChartOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false }
    },
    labels: Object.keys(statusDistribution),
    colors: ["#EF4444", "#F59E0B", "#3B82F6", "#F97316", "#10B981"],
    legend: {
      position: "bottom",
      fontSize: "12px"
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 300 },
        legend: { position: "bottom" }
      }
    }]
  };

  const lineChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false }
    },
    stroke: {
      width: 3,
      curve: "smooth"
    },
    colors: ["#2563EB"],
    xaxis: {
      categories: sentimentTrend.map(d => d.date)
    },
    yaxis: {
      min: 0,
      max: 1,
      labels: {
        formatter: (val) => val.toFixed(1)
      }
    },
    grid: {
      borderColor: "#E2E8F0"
    }
  };

  const barChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false }
    },
    colors: ["#EF4444", "#F59E0B", "#F97316", "#DC2626"],
    xaxis: {
      categories: Object.keys(frustrationDistribution)
    },
    grid: {
      borderColor: "#E2E8F0"
    }
  };

  return (
    <div className="p-6">
      <Header
        title="AI Analysis Dashboard"
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        onRefresh={loadLogs}
        onExport={handleExport}
        isLoading={loading}
        lastUpdated={lastUpdated}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Distribution</h3>
          <Chart
            options={pieChartOptions}
            series={Object.values(statusDistribution)}
            type="pie"
            height={300}
          />
        </div>

        {/* Sentiment Trend */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">7-Day Sentiment Trend</h3>
          <Chart
            options={lineChartOptions}
            series={[{
              name: "Average Sentiment",
              data: sentimentTrend.map(d => parseFloat(d.sentiment))
            }]}
            type="line"
            height={300}
          />
        </div>

        {/* Frustration Levels */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Frustration Levels</h3>
          <Chart
            options={barChartOptions}
            series={[{
              name: "Count",
              data: Object.values(frustrationDistribution)
            }]}
            type="bar"
            height={300}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-slate-700">Filter by Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Statuses</option>
            {Object.keys(statusDistribution).map(status => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <Empty
          title="No AI logs found"
          description="No logs match your current search and filter criteria."
          icon="Brain"
        />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Timestamp
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    App ID
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Metrics
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm text-slate-900">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500 font-mono">
                      {log.appId}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Heart" className="w-3 h-3" />
                          <span>{log.sentiment}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Zap" className="w-3 h-3" />
                          <span>{log.frustrationLevel}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Cpu" className="w-3 h-3" />
                          <span>{log.technicalComplexity}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700 max-w-md truncate">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;