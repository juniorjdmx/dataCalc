
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, FileDown } from "lucide-react";
import { toast } from "sonner";

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

  const exportToCSV = () => {
    const headers = ['Data Inicial', 'Valor Corrigido', 'Valor Verba Para Contribuição Social', 'Diferença'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.dataInicial,
        formatCurrency(row.valorCorrigido),
        formatCurrency(row.valorVerbaParaContribuicaoSocial),
        formatCurrency(row.diferenca)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dados_processados.csv';
    link.click();
    toast.success('Arquivo CSV exportado com sucesso!');
  };

  const print = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Relatório de Dados Processados</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f5f5f5; }
            .header { margin-bottom: 30px; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Relatório de Dados Processados</h2>
            <p>Data de geração: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Data Inicial</th>
                <th>Valor Corrigido</th>
                <th>Valor Verba Para Contribuição Social</th>
                <th>Diferença</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  <td>${row.dataInicial}</td>
                  <td>${formatCurrency(row.valorCorrigido)}</td>
                  <td>${formatCurrency(row.valorVerbaParaContribuicaoSocial)}</td>
                  <td>${formatCurrency(row.diferenca)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dados Processados
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar / Imprimir
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={print}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
