import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const navigation = [
    {
      name: "Apps Overview",
      path: "/",
      icon: "LayoutDashboard",
      description: "Monitor all applications"
    },
    {
      name: "User Analytics",
      path: "/users",
      icon: "Users",
      description: "User behavior insights"
    },
    {
      name: "AI Analysis",
      path: "/ai-analysis",
      icon: "Brain",
      description: "Conversation analysis"
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "FileText",
      description: "Export and reporting"
    }
  ];

  return (
    <div className="hidden lg:block w-64 bg-white border-r border-slate-200 h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Eye" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Support Lens</h1>
            <p className="text-xs text-slate-500">Analytics Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon 
                    name={item.icon} 
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-primary-600" : "text-slate-400"
                    )} 
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.description}</div>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="Activity" className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">System Status</span>
          </div>
          <div className="space-y-1 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Active Apps</span>
              <span className="font-medium text-slate-700">1,234</span>
            </div>
            <div className="flex justify-between">
              <span>Critical Issues</span>
              <span className="font-medium text-error-600">23</span>
            </div>
            <div className="flex justify-between">
              <span>Last Sync</span>
              <span className="font-medium text-slate-700">2m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;