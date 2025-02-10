
import { useState } from "react";
import { Upload, File, AlertCircle, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";
import DataTable from "@/components/DataTable";
import BeneficiaryInfo from "@/components/BeneficiaryInfo";

const Index = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [showSections, setShowSections] = useState(false);

  const xmlToJson = (xml: Node): any => {
    const obj: any = {};
    
    if (xml.nodeType === 1) { // Element node
      const element = xml as Element;
      if (element.attributes && element.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < element.attributes.length; j++) {
          const attribute = element.attributes.item(j);
          if (attribute) {
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      }
    } else if (xml.nodeType === 3) { // Text node
      const text = xml.nodeValue?.trim();
      return text ? text : null;
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        if (item) {
          const nodeName = item.nodeName;
          const result = xmlToJson(item);
          
          if (result !== null) {
            if (typeof obj[nodeName] === "undefined") {
              obj[nodeName] = result;
            } else {
              if (!Array.isArray(obj[nodeName])) {
                obj[nodeName] = [obj[nodeName]];
              }
              obj[nodeName].push(result);
            }
          }
        }
      }
    }
    return obj;
  };

  const extractValues = (obj: any) => {
    const results = [];
    
    function traverse(json: any) {
      if (typeof json === 'object' && json !== null) {
        if ('valorCorrigido' in json && 'valorVerbaParaContribuicaoSocial' in json) {
          const valorCorrigido = parseFloat(json.valorCorrigido["#text"] || 0);
          const valorVerba = parseFloat(json.valorVerbaParaContribuicaoSocial["#text"] || 0);
          const dataInicialTimestamp = parseInt(json.dataInicial?.["#text"] || "0");
          const dataInicial = dataInicialTimestamp ? 
            new Date(dataInicialTimestamp).toLocaleDateString('pt-BR') : 
            '-';
          
          results.push({
            valorCorrigido,
            valorVerbaParaContribuicaoSocial: valorVerba,
            diferenca: valorVerba - valorCorrigido,
            dataInicial
          });
        }
        for (const key in json) {
          traverse(json[key]);
        }
      }
    }
    
    traverse(obj);
    return results;
  };

  const processFile = (content: string) => {
    try {
      let parsedData;
      if (content.trim().startsWith("<")) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, "text/xml");
        parsedData = xmlToJson(xmlDoc);
      } else {
        parsedData = JSON.parse(content);
      }
      setJsonData(parsedData);
      setShowSections(true);
      toast.success("Arquivo processado com sucesso!");
    } catch (error) {
      toast.error("Erro ao processar arquivo. Verifique o formato.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {!showSections ? (
          <Card className="p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                <Upload className="w-8 h-8 text-gray-600 dark:text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Extrator de Dados XML/PJC/JSON
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Faça upload do seu arquivo para começar
              </p>
              <FileUploader onFileContent={processFile} />
            </div>
          </Card>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6">
              <FileUploader onFileContent={processFile} />
            </Card>

            <BeneficiaryInfo data={jsonData} />

            <DataTable data={jsonData ? extractValues(jsonData) : []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
