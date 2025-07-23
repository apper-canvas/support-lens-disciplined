import React from 'react';
import { format, isValid, parseISO } from 'date-fns';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DateRangePicker = ({ dateRange, onDateRangeChange }) => {
  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    const newDateRange = {
      ...dateRange,
      start: startDate || null
    };
    
    // If end date is before start date, clear end date
    if (startDate && dateRange.end && new Date(startDate) > new Date(dateRange.end)) {
      newDateRange.end = null;
    }
    
    onDateRangeChange(newDateRange);
  };

  const handleEndDateChange = (e) => {
    const endDate = e.target.value;
    onDateRangeChange({
      ...dateRange,
      end: endDate || null
    });
  };

  const handleClear = () => {
    onDateRangeChange({
      start: null,
      end: null
    });
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    
    // Handle different date formats
    let dateObj;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }
    
    if (!isValid(dateObj)) return '';
    
    // Format as YYYY-MM-DD for input[type="date"]
    return format(dateObj, 'yyyy-MM-dd');
  };

  const hasDateRange = dateRange?.start || dateRange?.end;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-700">
          Date Range
        </Label>
        {hasDateRange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-slate-500 hover:text-slate-700"
          >
            <ApperIcon name="X" className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date" className="text-xs text-slate-600 mb-1 block">
            Start Date
          </Label>
          <Input
            id="start-date"
            type="date"
            value={formatDateForInput(dateRange?.start)}
            onChange={handleStartDateChange}
            className="w-full"
            max={dateRange?.end ? formatDateForInput(dateRange.end) : undefined}
          />
        </div>
        
        <div>
          <Label htmlFor="end-date" className="text-xs text-slate-600 mb-1 block">
            End Date
          </Label>
          <Input
            id="end-date"
            type="date"
            value={formatDateForInput(dateRange?.end)}
            onChange={handleEndDateChange}
            className="w-full"
            min={dateRange?.start ? formatDateForInput(dateRange.start) : undefined}
          />
        </div>
      </div>
      
      {hasDateRange && (
        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-md">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" className="w-3 h-3" />
            <span>
              {dateRange?.start && dateRange?.end ? (
                `${format(new Date(dateRange.start), 'MMM d, yyyy')} - ${format(new Date(dateRange.end), 'MMM d, yyyy')}`
              ) : dateRange?.start ? (
                `From ${format(new Date(dateRange.start), 'MMM d, yyyy')}`
              ) : dateRange?.end ? (
                `Until ${format(new Date(dateRange.end), 'MMM d, yyyy')}`
              ) : (
                'No date range selected'
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;