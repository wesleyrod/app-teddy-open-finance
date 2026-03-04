import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PerPageSelectorProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

export function PerPageSelector({ value, onChange, options = [4, 8, 12, 16] }: PerPageSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      Clientes por página:
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-16 justify-between text-xs h-7 border-gray-300 bg-white"
          >
            {value} <span className="text-gray-400 text-[10px]">▼</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-xs min-w-[64px]">
          {options.map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => onChange(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
