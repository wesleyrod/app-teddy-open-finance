import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import type { Client } from "@/services/api";

interface ClientFormData {
  name: string;
  salary: number;
  companyValue: number;
}

interface ClientFormProps {
  initialData?: Client;
  onFormDataChange: (data: ClientFormData) => void;
}

export function ClientForm({ initialData, onFormDataChange }: ClientFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [salary, setSalary] = useState(initialData?.salary ?? 0);
  const [companyValue, setCompanyValue] = useState(initialData?.companyValue ?? 0);

  const emitChange = (updates: Partial<ClientFormData>) => {
    onFormDataChange({
      name: updates.name ?? name,
      salary: updates.salary ?? salary,
      companyValue: updates.companyValue ?? companyValue,
    });
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      <Input
        id="name"
        value={name}
        placeholder="Digite o nome:"
        className="h-12 border-gray-300 rounded-sm text-sm placeholder:text-gray-400 focus-visible:ring-orange-400"
        onChange={(e) => {
          setName(e.target.value);
          emitChange({ name: e.target.value });
        }}
      />
      <NumericFormat
        id="salary"
        customInput={Input}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        value={salary || ""}
        placeholder="Digite o salário:"
        className="h-12 border-gray-300 rounded-sm text-sm placeholder:text-gray-400 focus-visible:ring-orange-400"
        onValueChange={(values) => {
          const v = values.floatValue ?? 0;
          setSalary(v);
          emitChange({ salary: v });
        }}
      />
      <NumericFormat
        id="companyValue"
        customInput={Input}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        value={companyValue || ""}
        placeholder="Digite o valor da empresa:"
        className="h-12 border-gray-300 rounded-sm text-sm placeholder:text-gray-400 focus-visible:ring-orange-400"
        onValueChange={(values) => {
          const v = values.floatValue ?? 0;
          setCompanyValue(v);
          emitChange({ companyValue: v });
        }}
      />
    </div>
  );
}