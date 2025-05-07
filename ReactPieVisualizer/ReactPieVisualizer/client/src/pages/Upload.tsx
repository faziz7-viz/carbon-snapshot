import React, { DragEvent, useState } from 'react';
import { UploadCloud, Download, X, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface UploadProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  downloadSampleCSV: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Processing..." }) => (
  <div className="flex flex-col items-center justify-center space-y-3 p-8 bg-white rounded-lg shadow-xl max-w-md w-full">
    <svg className="animate-spin h-12 w-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-slate-700 text-lg font-medium mb-1">{message}</p>
  </div>
);

// Alert Message Component
export const AlertMessage: React.FC<{ 
  message: string; 
  type?: 'info' | 'error' | 'success'; 
  onDismiss?: () => void 
}> = ({ message, type = 'info', onDismiss }) => {
  let IconComponent;

  switch (type) {
    case 'error':
      IconComponent = AlertCircle;
      break;
    case 'success':
      IconComponent = CheckCircle;
      break;
    default: // info
      IconComponent = Info;
  }

  return (
    <Alert className={cn(
      type === "error" ? "bg-red-100 text-red-700" : 
      type === "success" ? "bg-green-100 text-green-700" : 
      "bg-blue-100 text-blue-700"
    )}>
      <IconComponent className="w-6 h-6 mr-3 flex-shrink-0" />
      <AlertDescription className="flex-grow">{message}</AlertDescription>
      {onDismiss && (
        <Button onClick={onDismiss} variant="ghost" className="ml-4 p-1 rounded-full hover:bg-opacity-20 hover:bg-current">
          <X className="w-5 h-5" />
        </Button>
      )}
    </Alert>
  );
};

const Upload: React.FC<UploadProps> = ({ 
  companyName, 
  setCompanyName, 
  handleFileUpload, 
  downloadSampleCSV,
  fileInputRef
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Create a synthetic event to pass to handleFileUpload
      const event = {
        target: {
          files: files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleFileUpload(event);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Upload Your Data</h1>
      
      <Card className="shadow-md overflow-hidden">
        {/* Company information section */}
        <CardContent className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Company Information</h2>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <Input 
              type="text" 
              id="companyName" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name" 
              className="w-full"
            />
          </div>
        </CardContent>
        
        {/* File upload section */}
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Upload CSV File</h2>
          <div 
            className={`border-2 border-dashed ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300'} rounded-lg p-6 text-center`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadCloud className="mx-auto text-slate-400 mb-4 h-10 w-10" />
            <p className="text-slate-600 mb-2">Drag and drop your CSV file here</p>
            <p className="text-slate-500 text-sm mb-4">or</p>
            <input 
              type="file" 
              id="fileInput" 
              ref={fileInputRef}
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <Button
              onClick={triggerFileInput}
              className="inline-flex items-center"
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          </div>
          
          <div className="mt-4 border-t border-slate-200 pt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Required CSV Format:</h3>
            <div className="bg-slate-50 p-3 rounded overflow-x-auto text-sm">
              <table className="min-w-full text-slate-600">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left font-medium bg-slate-100">Activity</th>
                    <th className="px-3 py-2 text-left font-medium bg-slate-100">Quantity</th>
                    <th className="px-3 py-2 text-left font-medium bg-slate-100">Unit</th>
                    <th className="px-3 py-2 text-left font-medium bg-slate-100">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-t border-slate-200">Electricity Usage</td>
                    <td className="px-3 py-2 border-t border-slate-200">1500</td>
                    <td className="px-3 py-2 border-t border-slate-200">kWh</td>
                    <td className="px-3 py-2 border-t border-slate-200">2023-01-15</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-t border-slate-200">Natural Gas</td>
                    <td className="px-3 py-2 border-t border-slate-200">200</td>
                    <td className="px-3 py-2 border-t border-slate-200">therm</td>
                    <td className="px-3 py-2 border-t border-slate-200">2023-01-20</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="ghost"
                className="flex items-center text-sm text-teal-600 hover:text-teal-700"
                onClick={downloadSampleCSV}
              >
                <Download className="mr-1 h-4 w-4" />
                Download Sample CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
