import { Service, Invoice, InvoiceFormData } from '@/types/invoice';

export const calculateServiceTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateSubtotal = (services: Service[]): number => {
  return services.reduce((sum, service) => sum + service.total, 0);
};

export const calculateTaxAmounts = (
  subtotal: number, 
  taxType: 'interstate' | 'intrastate',
  cgstRate: number,
  sgstRate: number,
  igstRate: number
) => {
  if (taxType === 'interstate') {
    return {
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: (subtotal * igstRate) / 100,
      totalTaxAmount: (subtotal * igstRate) / 100
    };
  } else {
    const cgstAmount = (subtotal * cgstRate) / 100;
    const sgstAmount = (subtotal * sgstRate) / 100;
    return {
      cgstAmount,
      sgstAmount,
      igstAmount: 0,
      totalTaxAmount: cgstAmount + sgstAmount
    };
  }
};

export const calculateDiscountAmount = (subtotal: number, discountRate: number): number => {
  return (subtotal * discountRate) / 100;
};

export const calculateTotal = (
  subtotal: number,
  totalTaxAmount: number,
  discountAmount: number
): number => {
  return subtotal + totalTaxAmount - discountAmount;
};

export const processInvoiceData = (formData: InvoiceFormData): Omit<Invoice, 'id' | 'createdAt'> => {
  // Process services with calculated totals
  const services: Service[] = formData.services.map((service, index) => ({
    ...service,
    id: `service-${index + 1}`,
    total: calculateServiceTotal(service.quantity, service.unitPrice)
  }));

  const subtotal = calculateSubtotal(services);
  const taxAmounts = calculateTaxAmounts(
    subtotal, 
    formData.taxType, 
    formData.cgstRate, 
    formData.sgstRate, 
    formData.igstRate
  );
  const discountAmount = calculateDiscountAmount(subtotal, formData.discountRate);
  const total = calculateTotal(subtotal, taxAmounts.totalTaxAmount, discountAmount);

  return {
    invoiceNumber: formData.invoiceNumber,
    company: formData.company,
    client: formData.client,
    services,
    subtotal,
    taxType: formData.taxType,
    cgstRate: formData.cgstRate,
    sgstRate: formData.sgstRate,
    igstRate: formData.igstRate,
    cgstAmount: taxAmounts.cgstAmount,
    sgstAmount: taxAmounts.sgstAmount,
    igstAmount: taxAmounts.igstAmount,
    totalTaxAmount: taxAmounts.totalTaxAmount,
    discountRate: formData.discountRate,
    discountAmount,
    total,
    dueDate: formData.dueDate,
    hscCode: formData.hscCode
  };
}; 