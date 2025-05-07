import React from 'react';
import { UploadCloud, Download, FileText, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HomeProps {
  setCurrentPage: (page: string) => void;
  downloadSampleCSV: () => void;
}

const Home: React.FC<HomeProps> = ({ setCurrentPage, downloadSampleCSV }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight sm:text-5xl mb-4">
          <span className="text-teal-500">Carbon</span>Snapshot
        </h1>
        <p className="text-xl text-slate-600">
          Get your carbon footprint estimate in minutes.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <FileText className="text-teal-500 h-6 w-6" />
              </div>
              <h2 className="ml-3 text-xl font-semibold text-slate-800">Upload Your Data</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Upload a CSV file with your organization's activity data. We'll analyze your energy consumption, travel, and other emissions sources.
            </p>
            <Button 
              className="w-full flex items-center justify-center"
              onClick={() => setCurrentPage('upload')}
            >
              Start Upload
              <UploadCloud className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Lightbulb className="text-emerald-500 h-6 w-6" />
              </div>
              <h2 className="ml-3 text-xl font-semibold text-slate-800">Get Insights</h2>
            </div>
            <p className="text-slate-600 mb-4">
              View your carbon footprint breakdown across scopes and categories. Identify your biggest emission sources and opportunities for reduction.
            </p>
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center text-teal-600 bg-teal-100 hover:bg-teal-200 border-teal-200"
              onClick={downloadSampleCSV}
            >
              Download Sample CSV
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">How It Works</h2>
          <ol className="space-y-6">
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-500 font-semibold mr-4">1</div>
              <div>
                <h3 className="text-lg font-medium text-slate-800">Prepare Your Data</h3>
                <p className="mt-1 text-slate-600">Collect your organization's activity data in CSV format. Include activities, quantities, and units.</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-500 font-semibold mr-4">2</div>
              <div>
                <h3 className="text-lg font-medium text-slate-800">Upload & Process</h3>
                <p className="mt-1 text-slate-600">Upload your CSV file. Our tool will automatically match activities to emission factors.</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-500 font-semibold mr-4">3</div>
              <div>
                <h3 className="text-lg font-medium text-slate-800">Analyze Results</h3>
                <p className="mt-1 text-slate-600">Review your estimated carbon footprint across different scopes and categories.</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-500 font-semibold mr-4">4</div>
              <div>
                <h3 className="text-lg font-medium text-slate-800">Download Report</h3>
                <p className="mt-1 text-slate-600">Generate a detailed PDF report of your emissions to share with stakeholders.</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
