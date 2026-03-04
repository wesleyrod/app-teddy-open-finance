import type { ReactNode } from "react";
import { PerPageSelector } from "./PerPageSelector";

interface PageHeaderProps {
  title: ReactNode;
  perPage: number;
  onPerPageChange: (value: number) => void;
}

export function PageHeader({ title, perPage, onPerPageChange }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-lg font-medium text-gray-900">
        {title}
      </h1>
      <PerPageSelector value={perPage} onChange={onPerPageChange} />
    </div>
  );
}
