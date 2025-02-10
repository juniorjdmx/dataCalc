
import { Card } from "@/components/ui/card";
import { User, CreditCard } from "lucide-react";

interface BeneficiaryInfoProps {
  data: any;
}

const BeneficiaryInfo = ({ data }: BeneficiaryInfoProps) => {
  if (!data?.Calculo?.gprec) return null;

  const gprec = data.Calculo.gprec;
  const nome = typeof gprec.nomeBeneficiario === 'object' 
    ? gprec.nomeBeneficiario["#text"] 
    : gprec.nomeBeneficiario;
  
  const documento = typeof gprec.documentoFiscalBeneficiario === 'object'
    ? gprec.documentoFiscalBeneficiario["#text"]
    : gprec.documentoFiscalBeneficiario;

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Informações do Beneficiário
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
            <p className="font-medium text-gray-900 dark:text-white">{nome}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">
            <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Documento Fiscal</p>
            <p className="font-medium text-gray-900 dark:text-white">{documento}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BeneficiaryInfo;
