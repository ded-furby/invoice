import { Service, Invoice, InvoiceFormData } from '@/types/invoice';

export const calculateServiceTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateSubtotal = (services: Service[]): number => {
  return services.reduce((sum, service) => sum + service.total, 0);
};

export const calculateTaxAmount = (subtotal: number, taxRate: number): number => {
  return (subtotal * taxRate) / 100;
};

export const calculateDiscountAmount = (subtotal: number, discountRate: number): number => {
  return (subtotal * discountRate) / 100;
};

export const calculateTotal = (
  subtotal: number,
  taxAmount: number,
  discountAmount: number
): number => {
  return subtotal + taxAmount - discountAmount;
};

export const processInvoiceData = (formData: InvoiceFormData): Omit<Invoice, 'id' | 'createdAt'> => {
  // Process services with calculated totals
  const services: Service[] = formData.services.map((service, index) => ({
    ...service,
    id: `service-${index + 1}`,
    total: calculateServiceTotal(service.quantity, service.unitPrice)
  }));

  const subtotal = calculateSubtotal(services);
  const taxAmount = calculateTaxAmount(subtotal, formData.taxRate);
  const discountAmount = calculateDiscountAmount(subtotal, formData.discountRate);
  const total = calculateTotal(subtotal, taxAmount, discountAmount);
  const remainingAmount = total - formData.tokenAmount;

  return {
    invoiceNumber: formData.invoiceNumber,
    company: formData.company,
    client: formData.client,
    services,
    subtotal,
    taxRate: formData.taxRate,
    taxAmount,
    discountRate: formData.discountRate,
    discountAmount,
    total,
    tokenAmount: formData.tokenAmount,
    remainingAmount,
    dueDate: formData.dueDate,
    hsnCode: formData.hsnCode
  };
}; 