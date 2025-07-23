import React from "react";
import Button from "@/components/atoms/Button";
import FilterGroup from "@/components/molecules/FilterGroup";
import ApperIcon from "@/components/ApperIcon";

const FilterPanel = ({ 
  isOpen, 
  onToggle, 
  filters, 
  onFiltersChange,
  onClearFilters 
}) => {
  const statusCategories = [
    {
      title: "Critical Attention",
      options: [
        { value: "abandonment_risk", label: "Abandonment Risk", count: 12 },
        { value: "completely_lost", label: "Completely Lost", count: 8 },
        { value: "angry", label: "Angry", count: 5 },
        { value: "giving_up", label: "Giving Up", count: 7 }
      ]
    },
    {
      title: "Struggle Indicators",
      options: [
        { value: "stuck", label: "Stuck", count: 23 },
        { value: "confused", label: "Confused", count: 18 },
        { value: "repeating_issues", label: "Repeating Issues", count: 15 },
        { value: "frustrated", label: "Frustrated", count: 19 }
      ]
    },
    {
      title: "Help Seeking",
      options: [
        { value: "needs_guidance", label: "Needs Guidance", count: 34 },
        { value: "requesting_examples", label: "Requesting Examples", count: 28 },
        { value: "seeking_alternatives", label: "Seeking Alternatives", count: 12 },
        { value: "documentation_needed", label: "Documentation Needed", count: 16 }
      ]
    },
    {
      title: "Technical Issues",
      options: [
        { value: "debugging", label: "Debugging", count: 22 },
        { value: "troubleshooting_db", label: "Troubleshooting DB", count: 14 },
        { value: "performance_issues", label: "Performance Issues", count: 9 },
        { value: "integration_problems", label: "Integration Problems", count: 11 }
      ]
    },
    {
      title: "Positive Engagement",
      options: [
        { value: "smooth_progress", label: "Smooth Progress", count: 156 },
        { value: "learning_effectively", label: "Learning Effectively", count: 89 },
        { value: "highly_engaged", label: "Highly Engaged", count: 67 },
        { value: "goal_achieved", label: "Goal Achieved", count: 45 }
      ]
    }
  ];

  const planOptions = [
    { value: "free", label: "Free", count: 456 },
    { value: "pro", label: "Pro", count: 234 },
    { value: "enterprise", label: "Enterprise", count: 89 }
  ];

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="mb-4"
      >
        <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
        Show Filters
      </Button>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statusCategories.map((category) => (
          <FilterGroup
            key={category.title}
            title={category.title}
            options={category.options}
            selectedValues={filters.statuses || []}
            onChange={(values) => onFiltersChange({ ...filters, statuses: values })}
          />
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <FilterGroup
          title="Plan Types"
          options={planOptions}
          selectedValues={filters.plans || []}
          onChange={(values) => onFiltersChange({ ...filters, plans: values })}
        />
      </div>
    </div>
  );
};

export default FilterPanel;