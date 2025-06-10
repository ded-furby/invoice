'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InvoiceFormData, Company, Client } from '@/types/invoice';
import { saveInvoice, generateInvoiceNumber } from '@/utils/storage';
import { processInvoiceData } from '@/utils/calculations';

const SERVICE_OPTIONS = [
  'UI/UX Design & Prototyping',
  'Frontend Development',
  'Backend Development',
  'Certification & Admin Panel',
  'Payment Gateway Integration',
  'CMS (Blogs, FAQs, Helpdesk)',
  'CRM, Chat & WhatsApp Integration',
  'AI ChatBot',
  'Deployment, QA & Documentation'
];

export default function CreateInvoicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: generateInvoiceNumber(),
    company: {
      name: 'Intraverse Technologies',
      address: 'Jabalpur,India',
      email: 'arjunvtani@gmail.com',
      phone: '+91 6267561651'
    },
    client: {
      name: '',
      company: '',
      email: '',
      address: ''
    },
    services: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0
      }
    ],
    taxType: 'interstate',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    discountRate: 0,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    hscCode: '998399'
  });

  const updateCompany = (field: keyof Company, value: string) => {
    setFormData(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value }
    }));
  };

  const updateClient = (field: keyof Client, value: string) => {
    setFormData(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }));
  };

  const updateService = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      setFormData(prev => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const processedData = processInvoiceData(formData);
      const invoice = {
        ...processedData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };

      saveInvoice(invoice);
      router.push(`/invoice/${invoice.id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
              <p className="text-gray-600 mt-1">Fill in the details to generate your invoice</p>
            </div>
            <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Invoice Number */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HSC Code *
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  maxLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.hscCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    if (value.length <= 6) {
                      setFormData(prev => ({ ...prev, hscCode: value }));
                    }
                  }}
                  placeholder="Enter 6-digit HSC code"
                />
                <p className="text-sm text-gray-500 mt-1">Enter a 6-digit numeric HSC (Harmonized System Code) code</p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.company.name}
                  onChange={(e) => updateCompany('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.company.email}
                  onChange={(e) => updateCompany('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.company.phone}
                  onChange={(e) => updateCompany('phone', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.company.address}
                  onChange={(e) => updateCompany('address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Client Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.client.name}
                  onChange={(e) => updateClient('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.client.company}
                  onChange={(e) => updateClient('company', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.client.email}
                  onChange={(e) => updateClient('email', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.client.address}
                  onChange={(e) => updateClient('address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Services</h2>
              <button
                type="button"
                onClick={addService}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Service
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Service {index + 1}</h3>
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          list={`services-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          placeholder="Type or select a service..."
                        />
                        <datalist id={`services-${index}`}>
                          {SERVICE_OPTIONS.map((option, optionIndex) => (
                            <option key={optionIndex} value={option} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={service.quantity}
                        onChange={(e) => updateService(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={service.unitPrice}
                        onChange={(e) => updateService(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Discount */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tax & Discount</h2>
            
            {/* Tax Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Type *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="taxType"
                    value="interstate"
                    checked={formData.taxType === 'interstate'}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxType: e.target.value as 'interstate' | 'intrastate' }))}
                    className="mr-2"
                  />
                  Interstate (IGST)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="taxType"
                    value="intrastate"
                    checked={formData.taxType === 'intrastate'}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxType: e.target.value as 'interstate' | 'intrastate' }))}
                    className="mr-2"
                  />
                  Intrastate (CGST + SGST)
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tax Rate Inputs */}
              {formData.taxType === 'interstate' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IGST Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.igstRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, igstRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CGST Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={formData.cgstRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, cgstRate: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SGST Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={formData.sgstRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, sgstRate: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.discountRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountRate: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 