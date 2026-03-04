import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import type { Client } from "@/services/api";

export const clientSchema = z.object({
  name: z.string().min(2, "O nome deve ter ao menos 2 caracteres."),
  salary: z.number({ error: "Informe o salário." }).positive("O salário deve ser maior que zero."),
  companyValue: z.number({ error: "Informe o valor da empresa." }).positive("O valor da empresa deve ser maior que zero."),
});

export type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  initialData?: Client;
  onFormDataChange: (data: ClientFormData) => void;
  submitRef?: React.MutableRefObject<(() => Promise<boolean>) | null>;
}

export function ClientForm({ initialData, onFormDataChange, submitRef }: ClientFormProps) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      salary: initialData?.salary ?? 0,
      companyValue: initialData?.companyValue ?? 0,
    },
    mode: "onBlur",
  });

  if (submitRef) {
    submitRef.current = () =>
      new Promise<boolean>((resolve) => {
        handleSubmit(
          (valid) => {
            onFormDataChange(valid);
            resolve(true);
          },
          () => resolve(false),
        )();
      });
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      <div>
        <Input
          id="name"
          placeholder="Digite o nome:"
          className={`h-12 border-gray-300 rounded-sm text-sm placeholder:text-gray-400 focus-visible:ring-orange-400 ${errors.name ? "border-red-400 focus-visible:ring-red-400" : ""}`}
          {...register("name", {
            onChange: () => onFormDataChange(getValues()),
          })}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Controller
          name="salary"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumericFormat
              id="salary"
              customInput={Input}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              value={value || ""}
              placeholder="Digite o salário:"
              className={`h-12 border-gray-300 rounded-sm text-sm placeholder:text-gray-400 focus-visible:ring-orange-400 ${errors.salary ? "border-red-400 focus-visible:ring-red-400" : ""}`}
              onValueChange={(values) => {
                const v = values.floatValue ?? 0;
                onChange(v);
                onFormDataChange({ ...getValues(), salary: v });
              }}
              onBlur={onBlur}
            />
          )}
        />
        {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>}
      </div>
      <div>
        <Controller
          name="companyValue"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumericFormat
              id="companyValue"
              customInput={Input}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              value={value || ""}
              placeholder="Digite o valor da empresa:"
              className={`h-12 border-gray-300 rounded-sm text-sm placeholder:text-gray-400 focus-visible:ring-orange-400 ${errors.companyValue ? "border-red-400 focus-visible:ring-red-400" : ""}`}
              onValueChange={(values) => {
                const v = values.floatValue ?? 0;
                onChange(v);
                onFormDataChange({ ...getValues(), companyValue: v });
              }}
              onBlur={onBlur}
            />
          )}
        />
        {errors.companyValue && <p className="text-red-500 text-xs mt-1">{errors.companyValue.message}</p>}
      </div>
    </div>
  );
}