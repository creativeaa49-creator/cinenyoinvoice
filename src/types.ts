export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  category: 'production' | 'pre-production' | 'post-production' | 'equipment' | 'other';
};

export type Invoice = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  projectName: string;
  notes: string;
  lineItems: LineItem[];
  taxAmount: number;
  discount: number;
  currency: string;
};

export type CompanyInfo = {
  name: string;
  address: string;
  email: string;
  tagline: string;
};

export type AppState = {
  invoice: Invoice;
  company: CompanyInfo;
  isEditing: boolean;
};
