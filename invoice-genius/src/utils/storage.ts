import { Invoice } from '@/types/invoice';

const STORAGE_KEY = 'invoice-genius-invoices';

export const saveInvoice = (invoice: Invoice): void => {
  const invoices = getInvoices();
  const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
  
  if (existingIndex >= 0) {
    invoices[existingIndex] = invoice;
  } else {
    invoices.push(invoice);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
};

export const getInvoices = (): Invoice[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getInvoiceById = (id: string): Invoice | null => {
  const invoices = getInvoices();
  return invoices.find(invoice => invoice.id === id) || null;
};

export const deleteInvoice = (id: string): void => {
  const invoices = getInvoices();
  const filtered = invoices.filter(invoice => invoice.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const generateInvoiceNumber = (): string => {
  const invoices = getInvoices();
  const currentDate = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  
  // Find invoices for current month
  const currentMonthInvoices = invoices.filter(inv => 
    inv.invoiceNumber.includes(`INV - ${currentMonth}`)
  );
  
  // Get the highest number for current month
  const lastNumber = currentMonthInvoices.length > 0 
    ? Math.max(...currentMonthInvoices.map(inv => {
        const parts = inv.invoiceNumber.split(' - ');
        return parseInt(parts[2]) || 0;
      }))
    : 0;
  
  return `INV - ${currentMonth} - ${String(lastNumber + 1).padStart(2, '0')}`;
}; 