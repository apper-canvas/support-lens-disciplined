import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { usersService } from "@/services/api/usersService";
import { appsService } from "@/services/api/appsService";

const UserAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [userApps, setUserApps] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadUsersData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchValue]);

  const loadUsersData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [usersData, appsData] = await Promise.all([
        usersService.getAll(),
        appsService.getAll()
      ]);
      
      // Group apps by user
      const appsByUser = {};
      appsData.forEach(app => {
        if (!appsByUser[app.userId]) {
          appsByUser[app.userId] = [];
        }
        appsByUser[app.userId].push(app);
      });
      
      setUsers(usersData);
      setUserApps(appsByUser);
      setLastUpdated(new Date());
      toast.success("User analytics data loaded successfully");
    } catch (err) {
      setError("Failed to load user analytics data");
      toast.error("Failed to load user analytics data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.email.toLowerCase().includes(search) ||
          user.company.toLowerCase().includes(search) ||
          user.plan.toLowerCase().includes(search)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleExport = () => {
    const csvData = filteredUsers.map(user => {
      const apps = userApps[user.id] || [];
      const criticalApps = apps.filter(app => 
        ["abandonment_risk", "completely_lost", "angry", "giving_up"].includes(app.chatAnalysisStatus)
      );
      
      return {
        "Email": user.email,
        "Company": user.company,
        "Plan": user.plan,
        "Signup Date": new Date(user.signupDate).toLocaleDateString(),
        "Total Apps": apps.length,
        "Credits Used": user.creditsUsed,
        "Critical Apps": criticalApps.length,
        "Avg Sentiment": apps.length > 0 ? (apps.reduce((sum, app) => sum + app.sentimentScore, 0) / apps.length).toFixed(2) : "N/A"
      };
    });

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("User analytics exported successfully");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUsersData} />;

  return (
    <div className="p-6">
      <Header
        title="User Analytics"
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        onRefresh={loadUsersData}
        onExport={handleExport}
        isLoading={loading}
        lastUpdated={lastUpdated}
      />

      {filteredUsers.length === 0 ? (
        <Empty
          title="No users found"
          description="No users match your current search criteria."
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const apps = userApps[user.id] || [];
            const criticalApps = apps.filter(app => 
              ["abandonment_risk", "completely_lost", "angry", "giving_up"].includes(app.chatAnalysisStatus)
            );
            const avgSentiment = apps.length > 0 ? 
              (apps.reduce((sum, app) => sum + app.sentimentScore, 0) / apps.length) : 0;

            return (
              <div key={user.id} className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{user.email}</h3>
                    <p className="text-sm text-slate-500">{user.company}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.plan === "enterprise" ? "bg-purple-100 text-purple-800" :
                    user.plan === "pro" ? "bg-primary-100 text-primary-800" :
                    "bg-slate-100 text-slate-800"
                  }`}>
                    {user.plan}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{apps.length}</div>
                    <div className="text-sm text-slate-500">Total Apps</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{user.creditsUsed}</div>
                    <div className="text-sm text-slate-500">Credits Used</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Critical Apps</span>
                    <span className={`font-medium ${criticalApps.length > 0 ? "text-error-600" : "text-slate-900"}`}>
                      {criticalApps.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Avg Sentiment</span>
                    <span className={`font-medium ${
                      avgSentiment > 0.6 ? "text-success-600" :
                      avgSentiment > 0.3 ? "text-warning-600" :
                      "text-error-600"
                    }`}>
                      {avgSentiment.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Member Since</span>
                    <span className="text-slate-900">
                      {new Date(user.signupDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {criticalApps.length > 0 && (
                  <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <ApperIcon name="AlertTriangle" className="w-4 h-4 text-error-600" />
                      <span className="text-sm font-medium text-error-800">Needs Attention</span>
                    </div>
                    <div className="text-xs text-error-700">
                      {criticalApps.length} app{criticalApps.length > 1 ? "s" : ""} showing critical status
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserAnalytics;