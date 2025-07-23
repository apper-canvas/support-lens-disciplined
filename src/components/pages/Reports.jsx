import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { reportsService } from "@/services/api/reportsService";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    type: "apps_overview",
    schedule: "once",
    format: "csv"
  });

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, searchValue]);

  const loadReports = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await reportsService.getAll();
      setReports(data);
      setLastUpdated(new Date());
      toast.success("Reports loaded successfully");
    } catch (err) {
      setError("Failed to load reports");
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        report =>
          report.name.toLowerCase().includes(search) ||
          report.type.toLowerCase().includes(search) ||
          report.status.toLowerCase().includes(search)
      );
    }

    setFilteredReports(filtered);
  };

  const handleCreateReport = async () => {
    try {
      if (!newReport.name.trim()) {
        toast.error("Please enter a report name");
        return;
      }

      const reportData = {
        ...newReport,
        createdAt: new Date().toISOString(),
        lastRun: null,
        status: "pending"
      };

      await reportsService.create(reportData);
      toast.success("Report created successfully");
      setShowCreateForm(false);
      setNewReport({
        name: "",
        type: "apps_overview",
        schedule: "once",
        format: "csv"
      });
      loadReports();
    } catch (err) {
      toast.error("Failed to create report");
    }
  };

  const handleRunReport = async (reportId) => {
    try {
      await reportsService.runReport(reportId);
      toast.success("Report generation started");
      loadReports();
    } catch (err) {
      toast.error("Failed to run report");
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await reportsService.delete(reportId);
      toast.success("Report deleted successfully");
      loadReports();
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <ApperIcon name="CheckCircle" className="w-4 h-4 text-success-500" />;
      case "running":
        return <ApperIcon name="Clock" className="w-4 h-4 text-warning-500 animate-spin" />;
      case "failed":
        return <ApperIcon name="XCircle" className="w-4 h-4 text-error-500" />;
      default:
        return <ApperIcon name="Circle" className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: "bg-success-100 text-success-800",
      running: "bg-warning-100 text-warning-800",
      failed: "bg-error-100 text-error-800",
      pending: "bg-slate-100 text-slate-800"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReports} />;

  return (
    <div className="p-6">
      <Header
        title="Reports & Exports"
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        onRefresh={loadReports}
        onExport={() => toast.info("Export feature coming soon")}
        isLoading={loading}
        lastUpdated={lastUpdated}
      />

      {/* Create Report Button */}
      <div className="mb-6">
        <Button onClick={() => setShowCreateForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Report
        </Button>
      </div>

      {/* Create Report Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Create New Report</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={newReport.name}
                onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                placeholder="Enter report name"
              />
            </div>

            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                id="reportType"
                value={newReport.type}
                onChange={(e) => setNewReport({...newReport, type: e.target.value})}
              >
                <option value="apps_overview">Apps Overview</option>
                <option value="user_analytics">User Analytics</option>
                <option value="ai_analysis">AI Analysis</option>
                <option value="status_summary">Status Summary</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="schedule">Schedule</Label>
              <Select
                id="schedule"
                value={newReport.schedule}
                onChange={(e) => setNewReport({...newReport, schedule: e.target.value})}
              >
                <option value="once">Run Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Format</Label>
              <Select
                id="format"
                value={newReport.format}
                onChange={(e) => setNewReport({...newReport, format: e.target.value})}
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
                <option value="pdf">PDF</option>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button onClick={handleCreateReport}>
              Create Report
            </Button>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Empty
          title="No reports found"
          description="Create your first report to get started with data exports."
          actionLabel="Create Report"
          onAction={() => setShowCreateForm(true)}
          icon="FileText"
        />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Report Name
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Schedule
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Last Run
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.Id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">{report.name}</div>
                      <div className="text-sm text-slate-500">
                        Created {format(new Date(report.createdAt), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-900 capitalize">
                        {report.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-900 capitalize">
                        {report.schedule}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(report.status)}
                        {getStatusBadge(report.status)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {report.lastRun 
                        ? format(new Date(report.lastRun), "MMM d, HH:mm")
                        : "Never"
                      }
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRunReport(report.Id)}
                          disabled={report.status === "running"}
                        >
                          <ApperIcon name="Play" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReport(report.Id)}
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4 text-error-500" />
                        </Button>
                      </div>
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

export default Reports;