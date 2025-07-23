import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ label, error, children, ...props }) => {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {children || <Input {...props} />}
      {error && <p className="text-sm text-error-600">{error}</p>}
    </div>
  );
};

export default FormField;