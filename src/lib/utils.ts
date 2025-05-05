import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in IDR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with thousand separator for price input
export function formatPriceInput(value: string): string {
  // Remove non-digit characters
  const digits = value.replace(/\D/g, '');

  // Format with thousand separators
  if (digits) {
    return new Intl.NumberFormat('id-ID').format(parseInt(digits));
  }

  return '';
}

// Parse formatted price input back to number
export function parsePriceInput(value: string): number {
  // Remove all non-digit characters
  return parseInt(value.replace(/\D/g, '')) || 0;
}

// Format date to localized string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

// Format date with time
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Shorten text with ellipsis
export function shortenText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate random color based on string
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}

// Get status badge color
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    menunggu_konfirmasi: 'bg-yellow-100 text-yellow-800',
    dikonfirmasi: 'bg-blue-100 text-blue-800',
    negosiasi: 'bg-purple-100 text-purple-800',
    dibayar: 'bg-green-100 text-green-800',
    persiapan_pengiriman: 'bg-indigo-100 text-indigo-800',
    sedang_dikirim: 'bg-blue-100 text-blue-800',
    sudah_dikirim: 'bg-green-100 text-green-800',
    diterima: 'bg-teal-100 text-teal-800',
    selesai: 'bg-green-100 text-green-800',
    dibatalkan: 'bg-red-100 text-red-800',
    open: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    completed: 'bg-teal-100 text-teal-800',
    expired: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

// Format status text
export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ');
}
