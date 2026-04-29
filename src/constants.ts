import { Invoice, CompanyInfo } from './types';

export const DEFAULT_COMPANY: CompanyInfo = {
  name: 'CINENYO PRODUCTION',
  address: 'Jl. Penjernihan I No.48, RW.8, Bend. Hilir, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10210',
  email: 'cinenyomedia@gmail.com',
  tagline: 'Professional Video Production'
};

export const DEFAULT_INVOICE: Invoice = {
  invoiceNumber: 'INV-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  projectName: '',
  notes: '',
  lineItems: [
    { 
      id: crypto.randomUUID(), 
      description: 'Production Day - Lead Videographer', 
      quantity: 1, 
      rate: 5000000, 
      category: 'production' 
    }
  ],
  taxAmount: 0,
  discount: 0,
  currency: 'IDR',
};

export const CATEGORIES = [
  { value: 'pre-production', label: 'Pre-Production' },
  { value: 'production', label: 'Production' },
  { value: 'post-production', label: 'Post-Production' },
  { value: 'equipment', label: 'Equipment Rental' },
  { value: 'other', label: 'Other' },
] as const;
