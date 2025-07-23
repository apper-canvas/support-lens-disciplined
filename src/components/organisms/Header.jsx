import React from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  onRefresh, 
  onExport,
  isLoading = false,
  lastUpdated 
}) => {
  return (
    <div className="bg-white border-b border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <ApperIcon 
              name="RefreshCw" 
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} 
            />
            Refresh
          </Button>
          <Button onClick={onExport} size="sm">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search apps, users, or status..."
          />
        </div>
      </div>
    </div>
  );
};

export default Header;