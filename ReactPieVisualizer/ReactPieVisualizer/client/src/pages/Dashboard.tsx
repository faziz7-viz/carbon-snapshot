import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { UploadCloud, Download, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmissionsData, EmissionsDataItem, SummaryItem } from '@/components/CarbonSnapshotApp';

interface DashboardProps {
  emissionsData: EmissionsData;
  companyName: string;
  setCurrentPage: (page: string) => void;
  generatePDFReport: () => void;
}

// Chart colors
const COLORS = ['#14b8a6', '#10b981', '#0d9488', '#059669', '#0f766e', '#047857'];

const Dashboard: React.FC<DashboardProps> = ({ 
  emissionsData, 
  companyName, 
  setCurrentPage, 
  generatePDFReport 
}) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Calculate metric tons for display
  const metricTons = (emissionsData.totalCO2e / 1000).toFixed(2);

  // Calculate percentages for pie charts
  const addPercentages = (items: SummaryItem[]) => {
    return items.map(item => ({
      ...item,
      percentage: Math.round((item.value / emissionsData.totalCO2e) * 100)
    }));
  };

  const scopeData = addPercentages(emissionsData.byScope);
  const categoryData = addPercentages(emissionsData.byCategory);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1 flex items-center">
            {companyName || 'Company'} Carbon Footprint
            <span className="ml-3 bg-green-100 text-xs font-medium text-green-800 px-2.5 py-0.5 rounded-full">
              ESTIMATE
            </span>
          </h1>
          <p className="text-slate-500 text-sm">
            Based on uploaded activity data. Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex mt-4 lg:mt-0 space-x-3">
          <Button 
            variant="outline"
            className="flex items-center"
            onClick={generatePDFReport}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button 
            className="flex items-center"
            onClick={() => setCurrentPage('upload')}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload New Data
          </Button>
        </div>
      </div>
      
      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Total emissions card */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Total Emissions</h2>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-slate-900">{formatNumber(emissionsData.totalCO2e)}</span>
              <span className="ml-2 text-lg text-slate-500">kg CO₂e</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              ({metricTons} metric tons CO₂e)
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="flex items-center text-sm">
                <Zap className="text-emerald-500 mr-2 h-4 w-4" />
                <span>Equivalent to driving approximately {Math.round(emissionsData.totalCO2e * 2.4)} miles</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Emissions by scope card */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Emissions by Scope</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scopeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percentage }) => `${percentage}%`}
                  >
                    {scopeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${value} kg CO₂e`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {scopeData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between py-1 text-sm">
                  <div className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{formatNumber(item.value)} kg CO₂e</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Emissions by category card */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Emissions by Category</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`${value} kg CO₂e`, '']} />
                  <Bar dataKey="value" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between py-1 text-sm">
                  <div className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full bg-teal-500 mr-2"
                    ></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{formatNumber(item.value)} kg CO₂e</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed emissions table card */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-slate-800">Detailed Emissions Data</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs">
              <span className="hidden sm:inline">Filter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline sm:ml-1">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={generatePDFReport}
            >
              Export
              <Download className="inline ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Unit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Scope</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Emissions (kg CO₂e)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {emissionsData.detailed.map((item: EmissionsDataItem) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{item.activity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatNumber(item.quantity)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.scope}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{formatNumber(item.co2e)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{emissionsData.detailed.length}</span> of <span className="font-medium">{emissionsData.detailed.length}</span> results
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs text-slate-500" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="text-xs" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
