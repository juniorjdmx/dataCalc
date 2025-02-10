
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface DataTableProps {
  data: Array<{
    valorCorrigido: number;
    valorVerbaParaContribuicaoSocial: number;
    diferenca: number;
    dataInicial: string;
  }>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const DataTable = ({ data }: DataTableProps) => {
  if (!data.length) return null;

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dados Processados
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Data Inicial</TableHead>
              <TableHead className="text-center">Valor Corrigido</TableHead>
              <TableHead className="text-center">Valor Verba Para Contribuição Social</TableHead>
              <TableHead className="text-center">Diferença</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">
                  {row.dataInicial}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {formatCurrency(row.valorCorrigido)}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(row.valorVerbaParaContribuicaoSocial)}
                </TableCell>
                <TableCell className={`text-center ${
                  row.diferenca > 0 ? 'text-green-600 dark:text-green-400' : 
                  row.diferenca < 0 ? 'text-red-600 dark:text-red-400' : ''
                }`}>
                  {formatCurrency(row.diferenca)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default DataTable;
