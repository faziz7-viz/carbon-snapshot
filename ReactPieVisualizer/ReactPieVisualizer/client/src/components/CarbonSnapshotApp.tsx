import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import Home from '@/pages/Home';
import Upload from '@/pages/Upload';
import Dashboard from '@/pages/Dashboard';
import { LoadingSpinner, AlertMessage } from '@/pages/Upload';

// --- Constants and Configuration ---
const APP_NAME = "CarbonSnapshot";
const TAGLINE = "Get your carbon footprint estimate in minutes.";
const TEAL_COLOR = "#14b8a6"; // teal-500
const GREEN_COLOR = "#10b981"; // emerald-500

const SCOPES = {
  SCOPE_1: "Scope 1: Direct Emissions",
  SCOPE_2: "Scope 2: Indirect Emissions - Purchased Energy",
  SCOPE_3: "Scope 3: Indirect Emissions - Value Chain",
};

// Mock emission factors (kg CO2e per unit)
// These would ideally come from a comprehensive database or an AI model
const MOCK_EMISSION_FACTORS = {
  'electricity': { factor: 0.4, unit: 'kWh', scope: SCOPES.SCOPE_2, category: 'Energy' }, // kg CO2e/kWh
  'natural gas': { factor: 2.0, unit: 'therm', scope: SCOPES.SCOPE_1, category: 'Energy' }, // kg CO2e/therm
  'gasoline': { factor: 2.3, unit: 'liter', scope: SCOPES.SCOPE_1, category: 'Travel' }, // kg CO2e/liter
  'diesel': { factor: 2.7, unit: 'liter', scope: SCOPES.SCOPE_1, category: 'Travel' },
  'flights': { factor: 0.15, unit: 'km', scope: SCOPES.SCOPE_3, category: 'Travel' }, // kg CO2e/km (passenger-km)
  'hotel stays': { factor: 25, unit: 'night', scope: SCOPES.SCOPE_3, category: 'Travel' }, // kg CO2e/night
  'waste': { factor: 0.5, unit: 'kg', scope: SCOPES.SCOPE_3, category: 'Operations' }, // kg CO2e/kg
  'water': { factor: 0.3, unit: 'm3', scope: SCOPES.SCOPE_3, category: 'Operations' }, // kg CO2e/m3
  'commuting': { factor: 0.12, unit: 'km', scope: SCOPES.SCOPE_3, category: 'Travel' }, // Employee commuting
  'business travel - rail': { factor: 0.04, unit: 'km', scope: SCOPES.SCOPE_3, category: 'Travel' },
  'refrigerants': { factor: 1500, unit: 'kg', scope: SCOPES.SCOPE_1, category: 'Operations' }, // Leakage, GWP of common refrigerant
  'office supplies': { factor: 5, unit: 'item_bundle', scope: SCOPES.SCOPE_3, category: 'Operations' }, // Highly abstract
  'cloud computing': { factor: 0.05, unit: 'hour_cpu', scope: SCOPES.SCOPE_3, category: 'Operations' },
  'default': { factor: 1, unit: 'unit', scope: SCOPES.SCOPE_3, category: 'Other' }, // Default for unrecognized items
};

// Sample CSV Data
const SAMPLE_CSV_DATA = `Activity,Quantity,Unit,Date
Electricity Usage,1500,kWh,2023-01-15
Natural Gas,200,therm,2023-01-20
Gasoline Purchase,300,liter,2023-02-10
Flight - NYC to LON,11000,km,2023-03-05
Hotel Stay,5,night,2023-03-10
Office Waste,50,kg,2023-04-01
Water Consumption,20,m3,2023-04-05
Employee Commuting,2500,km,2023-05-01
Business Travel - Rail,800,km,2023-06-15
Refrigerant Leak,0.5,kg,2023-07-01
Cloud Services,500,hour_cpu,2023-08-01
Office Supplies,10,item_bundle,2023-09-01`;

export interface EmissionsDataItem {
  id: string;
  activity: string;
  quantity: number;
  unit: string;
  scope: string;
  category: string;
  co2e: number;
}

export interface SummaryItem {
  name: string;
  value: number;
}

export interface EmissionsData {
  totalCO2e: number;
  detailed: EmissionsDataItem[];
  byScope: SummaryItem[];
  byCategory: SummaryItem[];
}

const CarbonSnapshotApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'upload', 'dashboard'
  const [csvData, setCsvData] = useState<any>(null);
  const [emissionsData, setEmissionsData] = useState<EmissionsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Mock AI Processing and Calculation ---
  const processEmissions = useCallback(async (parsedData: any) => {
    setIsLoading(true);
    setError(null);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (!parsedData || !parsedData.data || parsedData.data.length === 0) {
        throw new Error("No data to process. Please upload a valid CSV.");
      }

      const detailedEmissions: EmissionsDataItem[] = [];
      let totalCO2e = 0;

      // Assuming first row is header
      const headers = parsedData.data[0].map((h: string) => h.trim().toLowerCase());
      const activityIndex = headers.indexOf('activity');
      const quantityIndex = headers.indexOf('quantity');
      const unitIndex = headers.indexOf('unit');

      if (activityIndex === -1 || quantityIndex === -1 || unitIndex === -1) {
        throw new Error("CSV must contain 'Activity', 'Quantity', and 'Unit' columns.");
      }

      parsedData.data.slice(1).forEach((row: any, index: number) => {
        if (row.length < Math.max(activityIndex, quantityIndex, unitIndex) + 1 || row.every((cell: any) => !cell || cell.trim() === "")) return; // Skip empty rows

        const activity = row[activityIndex]?.trim().toLowerCase();
        const quantity = parseFloat(row[quantityIndex]);
        const unit = row[unitIndex]?.trim().toLowerCase();

        if (!activity || isNaN(quantity) || !unit) {
          console.warn(`Skipping row ${index + 2}: Invalid data - Activity: ${activity}, Quantity: ${quantity}, Unit: ${unit}`);
          return; // Skip rows with missing critical data
        }

        let emissionFactorInfo = MOCK_EMISSION_FACTORS[activity as keyof typeof MOCK_EMISSION_FACTORS] ||
          Object.values(MOCK_EMISSION_FACTORS).find(ef => activity.includes(ef.category.toLowerCase())) ||
          MOCK_EMISSION_FACTORS['default'];

        const co2e = quantity * emissionFactorInfo.factor;
        totalCO2e += co2e;

        detailedEmissions.push({
          id: `item-${index}`,
          activity: row[activityIndex],
          quantity,
          unit: row[unitIndex],
          scope: emissionFactorInfo.scope,
          category: emissionFactorInfo.category,
          co2e: parseFloat(co2e.toFixed(2)),
        });
      });

      if (detailedEmissions.length === 0) {
        throw new Error("No valid emission activities found in the CSV data.");
      }

      const byScope = detailedEmissions.reduce((acc: Record<string, number>, item) => {
        acc[item.scope] = (acc[item.scope] || 0) + item.co2e;
        return acc;
      }, {});

      const byCategory = detailedEmissions.reduce((acc: Record<string, number>, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.co2e;
        return acc;
      }, {});

      setEmissionsData({
        totalCO2e: parseFloat(totalCO2e.toFixed(2)),
        detailed: detailedEmissions,
        byScope: Object.entries(byScope).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) })),
        byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) })),
      });
      setCurrentPage('dashboard');

    } catch (e: any) {
      console.error("Error processing emissions:", e);
      setError(e.message || "An unexpected error occurred during processing.");
      setEmissionsData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) { 
      setError(null);
      setIsLoading(true);
      if (!window.Papa) {
        setError("CSV parsing library (PapaParse) is not loaded. Please check your internet connection or contact support.");
        setIsLoading(false);
        return;
      }
      window.Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results);
          processEmissions(results);
        },
        error: (err: any) => {
          console.error("PapaParse Error:", err);
          setError(`Error parsing CSV file: ${err.message}. Please ensure it's a valid CSV.`);
          setIsLoading(false);
          setCsvData(null);
        }
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadSampleCSV = () => {
    const blob = new Blob([SAMPLE_CSV_DATA], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "sample_carbon_data.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // --- PDF Report Generation ---
  const generatePDFReport = () => {
    if (!emissionsData) return;
    setIsLoading(true);

    if (!window.jspdf || !window.jspdf.jsPDF) {
      setError("PDF generation library (jsPDF) is not loaded. Please check your internet connection or contact support."); 
      setIsLoading(false);
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let currentY = margin;

      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(TEAL_COLOR);
      pdf.text(APP_NAME, pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;
      pdf.setFontSize(12);
      pdf.setTextColor(100);
      pdf.text("Carbon Footprint Report", pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;

      if (companyName) {
        pdf.setFontSize(14);
        pdf.setTextColor(0);
        pdf.text(`Company: ${companyName}`, margin, currentY);
        currentY += 10;
      }

      pdf.setFontSize(10);
      pdf.text(`Report Generated: ${new Date().toLocaleDateString()}`, margin, currentY);
      currentY += 15;

      pdf.setFontSize(18);
      pdf.setTextColor(TEAL_COLOR);
      pdf.text("Total Estimated Emissions", margin, currentY);
      currentY += 8;
      pdf.setFontSize(22);
      pdf.setTextColor(0);
      pdf.text(`${emissionsData.totalCO2e.toLocaleString()} kg CO₂e`, margin, currentY);
      currentY += 10;
      pdf.setFontSize(14);
      pdf.text(`(${(emissionsData.totalCO2e / 1000).toLocaleString()} metric tons CO₂e)`, margin, currentY);
      currentY += 20;

      pdf.setFontSize(16);
      pdf.setTextColor(TEAL_COLOR);
      pdf.text("Top Emission Sources:", margin, currentY);
      currentY += 8;

      // Emissions by Category
      emissionsData.byCategory
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .forEach((category, index) => {
          pdf.setFontSize(12);
          pdf.setTextColor(0);
          const percentage = ((category.value / emissionsData.totalCO2e) * 100).toFixed(1);
          pdf.text(`${index + 1}. ${category.name}: ${category.value.toLocaleString()} kg CO₂e (${percentage}%)`, margin, currentY);
          currentY += 6;
        });
      currentY += 10;

      // Emissions by Scope
      pdf.setFontSize(16);
      pdf.setTextColor(TEAL_COLOR);
      pdf.text("Emissions by Scope:", margin, currentY);
      currentY += 8;

      emissionsData.byScope.forEach((scope, index) => {
        pdf.setFontSize(12);
        pdf.setTextColor(0);
        const percentage = ((scope.value / emissionsData.totalCO2e) * 100).toFixed(1);
        pdf.text(`${scope.name}: ${scope.value.toLocaleString()} kg CO₂e (${percentage}%)`, margin, currentY);
        currentY += 6;
      });
      currentY += 15;

      // Add page break if we're running out of space
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = margin;
      }

      // Detailed Emissions
      pdf.setFontSize(16);
      pdf.setTextColor(TEAL_COLOR);
      pdf.text("Detailed Emissions:", margin, currentY);
      currentY += 10;

      // Table headers
      const colWidths = [70, 30, 25, 35];
      const tableHeaders = ["Activity", "Quantity", "Unit", "CO₂e (kg)"];
      
      pdf.setFontSize(10);
      pdf.setTextColor(80);
      let xPos = margin;
      
      tableHeaders.forEach((header, i) => {
        pdf.text(header, xPos, currentY);
        xPos += colWidths[i];
      });
      
      currentY += 5;
      pdf.setDrawColor(200);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 5;

      // Table rows
      pdf.setTextColor(0);
      emissionsData.detailed.forEach((item, index) => {
        // Check if we need a new page
        if (currentY > pageHeight - 20) {
          pdf.addPage();
          currentY = margin;
          
          // Repeat headers on new page
          xPos = margin;
          pdf.setFontSize(10);
          pdf.setTextColor(80);
          tableHeaders.forEach((header, i) => {
            pdf.text(header, xPos, currentY);
            xPos += colWidths[i];
          });
          currentY += 5;
          pdf.setDrawColor(200);
          pdf.line(margin, currentY, pageWidth - margin, currentY);
          currentY += 5;
          pdf.setTextColor(0);
        }
        
        xPos = margin;
        pdf.text(item.activity.substring(0, 30), xPos, currentY);
        xPos += colWidths[0];
        pdf.text(item.quantity.toString(), xPos, currentY);
        xPos += colWidths[1];
        pdf.text(item.unit, xPos, currentY);
        xPos += colWidths[2];
        pdf.text(item.co2e.toString(), xPos, currentY);
        
        currentY += 5;
        
        // Add a light line between rows (except the last one)
        if (index < emissionsData.detailed.length - 1) {
          pdf.setDrawColor(230);
          pdf.line(margin, currentY - 2, pageWidth - margin, currentY - 2);
        }
      });

      // Footer
      currentY = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(`Generated by ${APP_NAME} | ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY, { align: 'center' });

      // Save the PDF
      pdf.save(`${companyName || 'Company'}_Carbon_Footprint_Report.pdf`);
      setIsLoading(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      setError("An error occurred while generating the PDF report.");
      setIsLoading(false);
    }
  };

  const dismissError = () => {
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        hasData={emissionsData !== null} 
      />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error alert */}
        {error && (
          <div className="mb-6">
            <AlertMessage 
              message={error} 
              type="error" 
              onDismiss={dismissError} 
            />
          </div>
        )}
        
        {/* Page Content */}
        {currentPage === 'home' && (
          <Home 
            setCurrentPage={setCurrentPage}
            downloadSampleCSV={downloadSampleCSV}
          />
        )}
        
        {currentPage === 'upload' && (
          <Upload 
            companyName={companyName}
            setCompanyName={setCompanyName}
            handleFileUpload={handleFileUpload}
            downloadSampleCSV={downloadSampleCSV}
            fileInputRef={fileInputRef}
          />
        )}
        
        {currentPage === 'dashboard' && emissionsData && (
          <Dashboard 
            emissionsData={emissionsData}
            companyName={companyName}
            setCurrentPage={setCurrentPage}
            generatePDFReport={generatePDFReport}
          />
        )}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner message="Processing your data... Please wait." />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CarbonSnapshotApp;
