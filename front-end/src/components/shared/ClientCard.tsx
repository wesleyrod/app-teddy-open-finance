import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ClientCardProps {
  name: string;
  salary: number;
  companyValue: number;
  actions?: ReactNode;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ClientCard({ name, salary, companyValue, actions }: ClientCardProps) {
  return (
    <Card className="border border-gray-100 shadow-sm rounded-md transition-all hover:shadow-md">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <h3 className="font-bold text-gray-900 text-base mb-4">{name}</h3>
        <p className="text-sm text-gray-600 mb-1">Salário: {formatBRL(salary)}</p>
        <p className="text-sm text-gray-600 mb-6">Empresa: {formatBRL(companyValue)}</p>

        {actions && (
          <div className="w-full flex justify-between items-center pt-3 border-t border-gray-100">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}