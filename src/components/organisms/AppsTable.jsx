import React from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const AppsTable = ({ apps, onAppClick, selectedApps, onSelectionChange }) => {
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(apps.map(app => app.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectApp = (appId, checked) => {
    if (checked) {
      onSelectionChange([...selectedApps, appId]);
    } else {
      onSelectionChange(selectedApps.filter(id => id !== appId));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedApps.length === apps.length && apps.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                App Name
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                User
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                Plan
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                Messages
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                Last Activity
              </th>
              <th className="w-20 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {apps.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onAppClick(app)}
              >
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedApps.includes(app.id)}
                    onChange={(e) => handleSelectApp(app.id, e.target.checked)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-slate-900">{app.name}</div>
                    <div className="text-sm text-slate-500">{app.category}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm text-slate-900">{app.userEmail}</div>
                    <div className="text-xs text-slate-500">{app.company}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                    {app.plan}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={app.chatAnalysisStatus} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-900">{app.totalMessages}</span>
                    {app.dbConnected ? (
                      <ApperIcon name="Database" className="w-4 h-4 text-success-500" />
                    ) : (
                      <ApperIcon name="DatabaseX" className="w-4 h-4 text-error-500" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-500">
                  {format(new Date(app.lastActivity), "MMM d, HH:mm")}
                </td>
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon">
                    <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppsTable;