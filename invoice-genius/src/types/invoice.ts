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
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  tokenAmount: number;
  remainingAmount: number;
  createdAt: string;
  dueDate: string;
  hsnCode: string;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  company: Company;
  client: Client;
  services: Omit<Service, 'id' | 'total'>[];
  taxRate: number;
  discountRate: number;
  tokenAmount: number;
  dueDate: string;
  hsnCode: string;
} 
