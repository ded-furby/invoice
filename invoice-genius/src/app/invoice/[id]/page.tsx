'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Invoice } from '@/types/invoice';
import { getInvoiceById } from '@/utils/storage';
import { exportToPDF } from '@/utils/pdf';

export default function InvoicePreviewPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      const foundInvoice = getInvoiceById(id);
      setInvoice(foundInvoice);
    }
    setIsLoading(false);
  }, [params.id]);

  const handleExportPDF = async () => {
    if (!invoice) return;
    
    setIsExporting(true);
    try {
      await exportToPDF('invoice-preview', `${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
          <p className="text-gray-600 mb-6">The invoice you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice Preview</h1>
              <p className="text-gray-600 mt-1">{invoice.invoiceNumber}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
              <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Invoice Preview */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="invoice-preview" className="rounded-lg p-8 shadow-sm text-white" style={{backgroundColor: 'rgb(50,50,50)', borderColor: 'rgb(70,70,70)'}}>
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <img 
                src="/intraverse-logo.png" 
                alt="Intraverse Technologies Logo" 
                className="h-16 w-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-white mb-2">
                {invoice.company.name}
              </h1>
              <div className="text-gray-300 whitespace-pre-line">
                {invoice.company.address}
              </div>
              <div className="text-gray-300 mt-2">
                <div>{invoice.company.email}</div>
                {invoice.company.phone && <div>{invoice.company.phone}</div>}
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-white mb-2">INVOICE</h2>
              <div className="text-lg font-mono font-semibold text-blue-400 mb-4">
                {invoice.invoiceNumber}
              </div>
              <div className="text-gray-300">
                <div><strong>Date:</strong> {formatDate(invoice.createdAt)}</div>
                <div><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</div>
                <div><strong>HSN Code:</strong> {invoice.hsnCode}</div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Bill To:</h3>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="font-semibold text-white">{invoice.client.name}</div>
              <div className="text-gray-200">{invoice.client.company}</div>
              <div className="text-gray-300 whitespace-pre-line mt-2">
                {invoice.client.address}
              </div>
              <div className="text-gray-300 mt-2">{invoice.client.email}</div>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-600">
                  <th className="text-left py-3 px-2 font-semibold text-white">Description</th>
                  <th className="text-center py-3 px-2 font-semibold text-white">Qty</th>
                  <th className="text-right py-3 px-2 font-semibold text-white">Unit Price</th>
                  <th className="text-right py-3 px-2 font-semibold text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.services.map((service) => (
                  <tr key={service.id} className="border-b border-gray-700">
                    <td className="py-3 px-2 text-white">{service.description}</td>
                    <td className="py-3 px-2 text-center text-gray-300">{service.quantity}</td>
                    <td className="py-3 px-2 text-right text-gray-300">
                      {formatCurrency(service.unitPrice)}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-white">
                      {formatCurrency(service.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                
                {invoice.discountRate > 0 && (
                  <div className="flex justify-between py-2 text-green-400">
                    <span>Discount ({invoice.discountRate}%):</span>
                    <span>-{formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}
                
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-300">Tax ({invoice.taxRate}%):</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(invoice.taxAmount)}
                    </span>
                  </div>
                )}
                
                <div className="border-t-2 border-gray-600 pt-2">
                  <div className="flex justify-between py-2">
                    <span className="text-xl font-bold text-white">Total:</span>
                    <span className="text-xl font-bold text-white">
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="border-t border-gray-600 pt-4 mt-4">
                  <div className="flex justify-between py-2">
                    <span className="text-blue-400 font-medium">Token Amount (Payable Today):</span>
                    <span className="font-semibold text-blue-400">
                      {formatCurrency(invoice.tokenAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-yellow-400 font-medium">Remaining Amount (Due by {formatDate(invoice.dueDate)}):</span>
                    <span className="font-semibold text-yellow-400">
                      {formatCurrency(invoice.remainingAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-600 text-center text-gray-300">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </main>
    </div>
  );
} 