'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Invoice } from '@/types/invoice';
import { getInvoices, deleteInvoice } from '@/utils/storage';

export default function HomePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setInvoices(getInvoices());
    setIsLoading(false);
  }, []);

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
      setInvoices(getInvoices());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice Genius</h1>
              <p className="text-gray-600 mt-1">Professional invoice generator</p>
            </div>
            <Link href="/create" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Create New Invoice
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Create Professional Invoices in Minutes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Generate beautiful, professional invoices with automatic calculations, 
            PDF export, and local storage. No signup required.
          </p>
          <Link href="/create" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg">
            Get Started
          </Link>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Recent Invoices</h3>
            <span className="text-sm text-gray-500">
              {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total
            </span>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h4>
              <p className="text-gray-600 mb-6">Create your first invoice to get started</p>
              <Link href="/create" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Create Your First Invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice #</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-medium text-blue-600">
                          {invoice.invoiceNumber}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{invoice.client.name}</div>
                          <div className="text-sm text-gray-600">{invoice.client.company}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(invoice.total)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/invoice/${invoice.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
