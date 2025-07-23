import React from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const AppDetailModal = ({ app, aiLogs, isOpen, onClose }) => {
  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{app.name}</h2>
            <p className="text-sm text-slate-500">{app.userEmail}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* App Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-500 mb-1">Category</div>
              <div className="font-medium text-slate-900">{app.category}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-500 mb-1">Plan</div>
              <div className="font-medium text-slate-900 capitalize">{app.plan}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-500 mb-1">Total Messages</div>
              <div className="font-medium text-slate-900">{app.totalMessages}</div>
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Status</h3>
            <div className="flex items-center space-x-4">
              <StatusBadge status={app.chatAnalysisStatus} />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">Sentiment Score:</span>
                <span className="font-medium text-slate-900">{app.sentimentScore}</span>
              </div>
              <div className="flex items-center space-x-2">
                {app.dbConnected ? (
                  <>
                    <ApperIcon name="Database" className="w-4 h-4 text-success-500" />
                    <span className="text-sm text-success-600">Connected</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="DatabaseX" className="w-4 h-4 text-error-500" />
                    <span className="text-sm text-error-600">Disconnected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* AI Log Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Analysis Timeline</h3>
            <div className="space-y-4">
              {aiLogs.map((log) => (
                <div key={log.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={log.status} />
                      <span className="text-sm text-slate-500">
                        {format(new Date(log.timestamp), "MMM d, HH:mm:ss")}
                      </span>
                    </div>
                    <div className="flex space-x-4 text-xs text-slate-500">
                      <span>Sentiment: {log.sentiment}</span>
                      <span>Frustration: {log.frustrationLevel}</span>
                      <span>Complexity: {log.technicalComplexity}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Create Support Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppDetailModal;