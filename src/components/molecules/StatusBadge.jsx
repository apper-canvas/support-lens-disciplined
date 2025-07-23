import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    const criticalStates = ["abandonment_risk", "completely_lost", "angry", "giving_up"];
    const warningStates = ["stuck", "confused", "repeating_issues", "frustrated", "going_in_circles"];
    const infoStates = ["needs_guidance", "requesting_examples", "seeking_alternatives", "documentation_needed"];
    const technicalStates = ["debugging", "troubleshooting_db", "performance_issues", "integration_problems"];
    const successStates = ["smooth_progress", "learning_effectively", "highly_engaged", "goal_achieved"];

    if (criticalStates.includes(status)) return "critical";
    if (warningStates.includes(status)) return "warning";
    if (infoStates.includes(status)) return "info";
    if (technicalStates.includes(status)) return "technical";
    if (successStates.includes(status)) return "success";
    return "default";
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {formatStatus(status)}
    </Badge>
  );
};

export default StatusBadge;