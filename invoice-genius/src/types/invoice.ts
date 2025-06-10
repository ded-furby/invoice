export interface Company {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface Client {
  name: string;
  company: string;
  email: string;
  address: string;
}

export interface Service {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  company: Company;
  client: Client;
  services: Service[];
  subtotal: number;
  taxType: 'interstate' | 'intrastate';
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTaxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  createdAt: string;
  dueDate: string;
  hscCode: string;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  company: Company;
  client: Client;
  services: Omit<Service, 'id' | 'total'>[];
  taxType: 'interstate' | 'intrastate';
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  discountRate: number;
  dueDate: string;
  hscCode: string;
} 