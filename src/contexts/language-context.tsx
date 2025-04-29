import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define available languages
export type Language = 'id' | 'en';

// Define translation object structure
type TranslationsType = {
  [key in Language]: {
    [key: string]: string;
  };
};

// Translations dictionary
export const translations: TranslationsType = {
  en: {
    // General
    'app.name': 'TaniTrack',
    'app.tagline': 'Agricultural Supply Chain Management',
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.view': 'View',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.close': 'Close',
    'action.add': 'Add',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.submit': 'Submit',
    'action.download': 'Download',
    'action.upload': 'Upload',
    'action.clear': 'Clear',
    'action.confirm': 'Confirm',
    'action.deny': 'Deny',
    'action.refresh': 'Refresh',
    'action.details': 'Details',
    'action.showAll': 'Show All',
    'action.showMore': 'Show More',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.commodities': 'Commodities',
    'nav.balance': 'Balance',
    'nav.transactions': 'Transactions',
    'nav.orderbook': 'Order Book',
    'nav.prices': 'Prices',
    'nav.shipping': 'Shipping',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.settings': 'Settings',
    'nav.notifications': 'Notifications',
    'nav.home': 'Home',

    // Commodities
    'commodities.title': 'Commodities',
    'commodities.subtitle': 'Manage your agricultural commodities',
    'commodities.add': 'Add Commodity',
    'commodities.name': 'Name',
    'commodities.type': 'Type',
    'commodities.quantity': 'Quantity',
    'commodities.location': 'Location',
    'commodities.grade': 'Grade',
    'commodities.action': 'Action',
    'commodities.search': 'Search commodities...',
    'commodities.detail': 'Commodity Details',
    'commodities.qrcode': 'QR Code',
    'commodities.unit': 'Unit',
    'commodities.created': 'Created Date',
    'commodities.upload.image': 'Upload commodity image',
    'commodities.upload.grade': 'Upload grading file',
    'commodities.list': 'Commodity List',
    'commodities.notfound': 'No commodities found',
    'commodities.history': 'Transaction History',
    'commodities.export': 'Export Data',
    'commodities.import': 'Import Data',
    'commodities.filter': 'Filter Commodities',
    'commodities.sort': 'Sort By',
    'commodities.harvest': 'Harvest Date',
    'commodities.origin': 'Origin',
    'commodities.category': 'Category',
    'commodities.price': 'Price',
    'commodities.certifications': 'Certifications',
    'commodities.description': 'Description',

    // Transactions
    'transactions.title': 'Transactions',
    'transactions.subtitle': 'Manage your commodity transactions',
    'transactions.id': 'Transaction ID',
    'transactions.type': 'Type',
    'transactions.commodity': 'Commodity',
    'transactions.quantity': 'Quantity',
    'transactions.price': 'Price',
    'transactions.status': 'Status',
    'transactions.buyer': 'Buyer',
    'transactions.seller': 'Seller',
    'transactions.date': 'Date',
    'transactions.action': 'Action',
    'transactions.search': 'Search transactions...',
    'transactions.detail': 'Transaction Details',
    'transactions.all': 'All',
    'transactions.pending': 'Pending',
    'transactions.processed': 'Processed',
    'transactions.completed': 'Completed',
    'transactions.canceled': 'Canceled',
    'transactions.total': 'Total Price',
    'transactions.terms': 'Terms & Conditions',
    'transactions.notfound': 'No transactions found',
    'transactions.filters': 'Transaction Filters',
    'transactions.payment': 'Payment Method',
    'transactions.timeline': 'Transaction Timeline',
    'transactions.documents': 'Documents',
    'transactions.notes': 'Notes',
    'transactions.invoice': 'Invoice',
    'transactions.empty': 'No transactions found',
    'transactions.new': 'New Transaction',
    'transactions.regular': 'Regular',
    'transactions.list': 'Transaction List',
    'transactions.print': 'Print Transaction',

    // Order Book
    'orderbook.title': 'Order Book',
    'orderbook.subtitle': 'View and accept commodity requests from buyers',
    'orderbook.id': 'Order ID',
    'orderbook.buyer': 'Buyer',
    'orderbook.commodity': 'Commodity',
    'orderbook.quantity': 'Quantity',
    'orderbook.grade': 'Required Grade',
    'orderbook.delivery': 'Delivery Date',
    'orderbook.expiry': 'Expiry Date',
    'orderbook.status': 'Status',
    'orderbook.action': 'Action',
    'orderbook.search': 'Search order book...',
    'orderbook.detail': 'Order Book Details',
    'orderbook.list': 'Order Book List',
    'orderbook.all': 'All',
    'orderbook.open': 'Open',
    'orderbook.accepted': 'Accepted',
    'orderbook.completed': 'Completed',
    'orderbook.expired': 'Expired',
    'orderbook.terms': 'Terms & Conditions',
    'orderbook.notfound': 'No order book entries found',
    'orderbook.filter': 'Filter Orders',
    'orderbook.sort': 'Sort By',
    'orderbook.create': 'Create Order',
    'orderbook.price': 'Asking Price',
    'orderbook.total': 'Total Value',
    'orderbook.offers': 'Offers',
    'orderbook.respond': 'Respond to Order',

    // Shipping
    'shipping.title': 'Shipping',
    'shipping.subtitle': 'Track and manage your shipments',
    'shipping.id': 'Shipment ID',
    'shipping.origin': 'Origin',
    'shipping.destination': 'Destination',
    'shipping.status': 'Status',
    'shipping.carrier': 'Carrier',
    'shipping.tracking': 'Tracking Number',
    'shipping.departureDate': 'Departure Date',
    'shipping.arrivalDate': 'Estimated Arrival',
    'shipping.commodity': 'Commodity',
    'shipping.weight': 'Weight',
    'shipping.cost': 'Shipping Cost',
    'shipping.documents': 'Documents',
    'shipping.notfound': 'No shipments found',
    'shipping.create': 'Create Shipment',
    'shipping.detail': 'Shipment Details',
    'shipping.updateStatus': 'Update Status',
    'shipping.trackShipment': 'Track Shipment',
    'shipping.vehicle': 'Vehicle Type',
    'shipping.driverInfo': 'Driver Information',
    'shipping.contact': 'Contact',
    'shipping.instructions': 'Special Instructions',
    'shipping.route': 'Route Information',
    'shipping.stops': 'Stops',
    'shipping.history': 'Status History',

    // Prices
    'prices.title': 'Market Prices',
    'prices.subtitle': 'View current commodity prices',
    'prices.commodity': 'Commodity',
    'prices.category': 'Category',
    'prices.currentPrice': 'Current Price',
    'prices.change': '24h Change',
    'prices.volume': '24h Volume',
    'prices.high': '24h High',
    'prices.low': '24h Low',
    'prices.chart': 'Price Chart',
    'prices.history': 'Price History',
    'prices.forecast': 'Price Forecast',
    'prices.market': 'Market',
    'prices.date': 'Last Updated',
    'prices.source': 'Data Source',
    'prices.filter': 'Filter Prices',
    'prices.compare': 'Compare',
    'prices.watchlist': 'Add to Watchlist',
    'prices.trends': 'Market Trends',
    'prices.notifications': 'Price Alerts',

    // Status labels
    'status.open': 'Open',
    'status.accepted': 'Accepted',
    'status.completed': 'Completed',
    'status.expired': 'Expired',
    'status.canceled': 'Canceled',
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.paid': 'Paid',
    'status.shipped': 'Shipped',
    'status.received': 'Received',
    'status.processing': 'Processing',
    'status.notshipped': 'Not Shipped',
    'status.shipping': 'Shipping',
    'status.delivered': 'Delivered',
    'status.inTransit': 'In Transit',
    'status.outForDelivery': 'Out for Delivery',
    'status.failed': 'Failed',
    'status.delayed': 'Delayed',
    'status.returned': 'Returned',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.draft': 'Draft',
    'status.onHold': 'On Hold',
    'status.negotiating': 'Negotiating',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome to TaniTrack',
    'dashboard.summary': 'Summary',
    'dashboard.recentTransactions': 'Recent Transactions',
    'dashboard.pendingOrders': 'Pending Orders',
    'dashboard.upcomingShipments': 'Upcoming Shipments',
    'dashboard.marketInsights': 'Market Insights',
    'dashboard.commodityStatus': 'Commodity Status',
    'dashboard.analytics': 'Analytics',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.alerts': 'Alerts',
    'dashboard.recommendations': 'Recommendations',

    // Profile/Account
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.company': 'Company Information',
    'profile.security': 'Security',
    'profile.preferences': 'Preferences',
    'profile.notifications': 'Notifications',
    'profile.paymentMethods': 'Payment Methods',
    'profile.accountHistory': 'Account History',
    'profile.documents': 'Documents',
    'profile.settings': 'Account Settings',
    'profile.help': 'Help & Support',
    'profile.logout': 'Logout',
    'profile.editProfile': 'Edit Profile',
    'profile.changePassword': 'Change Password',
    'profile.language': 'Language',
    'profile.theme': 'Theme',
    'profile.verifications': 'Verifications',

    // Balance/Finance
    'balance.title': 'Balance',
    'balance.available': 'Available Balance',
    'balance.pending': 'Pending',
    'balance.totalValue': 'Total Value',
    'balance.transactions': 'Transaction History',
    'balance.withdraw': 'Withdraw',
    'balance.deposit': 'Deposit',
    'balance.transfer': 'Transfer',
    'balance.statement': 'Statement',
    'balance.paymentMethods': 'Payment Methods',
    'balance.settings': 'Payment Settings',
    'balance.currency': 'Currency',
    'balance.exchange': 'Exchange Rate',

    // Time and dates
    'time.today': 'Today',
    'time.yesterday': 'Yesterday',
    'time.tomorrow': 'Tomorrow',
    'time.thisWeek': 'This Week',
    'time.lastWeek': 'Last Week',
    'time.thisMonth': 'This Month',
    'time.lastMonth': 'Last Month',
    'time.thisYear': 'This Year',
    'time.lastYear': 'Last Year',
    'time.custom': 'Custom Range',

    // Charts and Analytics
    'charts.dailyPrices': 'Daily Prices',
    'charts.monthlyVolume': 'Monthly Volume',
    'charts.commodityDistribution': 'Commodity Distribution',
    'charts.transactionTrends': 'Transaction Trends',
    'charts.marketComparison': 'Market Comparison',
    'charts.supplyDemand': 'Supply & Demand',
    'charts.seasonalTrends': 'Seasonal Trends',
    'charts.priceForecasts': 'Price Forecasts',
    'charts.exportImport': 'Export/Import Ratio',
    'charts.incomeExpenses': 'Income & Expenses',

    // Errors and notifications
    'error.generic': 'An error occurred',
    'error.notFound': 'Not found',
    'error.unauthorized': 'Unauthorized access',
    'error.forbidden': 'Access forbidden',
    'error.validation': 'Validation error',
    'error.network': 'Network error',
    'error.serverError': 'Server error',
    'error.timeout': 'Request timeout',
    'error.unavailable': 'Service unavailable',
    'success.saved': 'Successfully saved',
    'success.created': 'Successfully created',
    'success.updated': 'Successfully updated',
    'success.deleted': 'Successfully deleted',
    'info.processing': 'Processing your request',
    'info.noData': 'No data available',
    'warning.unsaved': 'You have unsaved changes',

    // Market
    'market.title': 'Commodity Market',
    'market.subtitle':
      'Explore and purchase quality agricultural commodities directly from farmers.',
    'market.search': 'Search commodities...',
    'market.filter': 'Filter',
    'market.sort': 'Sort',
    'market.currentPrices': 'See Current Prices',
    'market.farmer': 'Farmer',
    'market.location': 'Location',
    'market.stock': 'Stock',
    'market.price': 'Price',
    'market.details': 'Details',
    'market.buy': 'Buy',
    'market.noResults': 'No commodities found',
    'market.minOrder': 'Minimum order',
    'market.certifications': 'Certifications',
    'market.harvestDate': 'Harvest Date',
    'market.variety': 'Variety',
    'market.grade': 'Grade',
    'market.description': 'Description',
    'market.nutrition': 'Nutrition',
    'market.storage': 'Storage',
    'market.buyNow': 'Buy Now',
    'market.contactFarmer': 'Contact Farmer',
    'market.viewAllProducts': 'View All Products',
    'market.farmerInfo': 'Farmer Information',
    'market.memberSince': 'Member since',
    'market.transactions': 'transactions',
    'market.reviews': 'Customer Reviews',
    'market.noReviews': 'No reviews yet',
    'market.backToMarket': 'Back to Market',
    'market.notFound': 'Commodity not found',

    // Transaction Flow Explainer
    'flow.title': 'Transaction Process',
    'flow.subtitle': "Here's how the transaction process works from start to finish:",
    'flow.current': 'Current Step',
    'flow.helpTitle': 'Need help?',
    'flow.helpText':
      'If you need assistance with any step of the process, please contact our support team through the help center or WhatsApp.',

    'flow.pending.title': '1. Order Received',
    'flow.pending.description':
      'A buyer has placed an order for your commodity. Review the order details and decide to accept or reject it.',

    'flow.confirmed.title': '2. Order Confirmed',
    'flow.confirmed.description':
      "You've confirmed the order. The buyer has been notified and awaits further information.",

    'flow.negotiating.title': '3. Price Negotiation',
    'flow.negotiating.description':
      'Discuss and negotiate price terms with the buyer until both parties are satisfied.',

    'flow.paid.title': '4. Payment Received',
    'flow.paid.description':
      'The buyer has made the payment for the order. You can now proceed with preparing the shipment.',

    'flow.processing.title': '5. Preparing Shipment',
    'flow.processing.description':
      'Prepare the ordered commodities for shipping. Ensure proper packaging and documentation.',

    'flow.shipping.title': '6. Shipment in Transit',
    'flow.shipping.description':
      'The commodities are on their way to the buyer. Tracking information has been provided to the buyer.',

    'flow.shipped.title': '7. Shipment Delivered',
    'flow.shipped.description': "The shipment has been delivered to the buyer's specified address.",

    'flow.received.title': '8. Order Received',
    'flow.received.description':
      'The buyer has confirmed receipt of the commodities and is reviewing them.',

    'flow.completed.title': '9. Transaction Completed',
    'flow.completed.description':
      'The transaction has been successfully completed. The funds have been released to your account.',
    'transactions.updatedAt': 'Updated Date',
    'transactions.summary': 'Transaction Summary',
  },
  id: {
    // General
    'app.name': 'TaniTrack',
    'app.tagline': 'Manajemen Rantai Pasok Pertanian',
    'action.search': 'Cari',
    'action.filter': 'Filter',
    'action.view': 'Lihat',
    'action.edit': 'Edit',
    'action.delete': 'Hapus',
    'action.save': 'Simpan',
    'action.cancel': 'Batal',
    'action.close': 'Tutup',
    'action.add': 'Tambah',
    'action.back': 'Kembali',
    'action.next': 'Selanjutnya',
    'action.submit': 'Kirim',
    'action.download': 'Unduh',
    'action.upload': 'Unggah',
    'action.clear': 'Bersihkan',
    'action.confirm': 'Konfirmasi',
    'action.deny': 'Tolak',
    'action.refresh': 'Segarkan',
    'action.details': 'Detail',
    'action.showAll': 'Tampilkan Semua',
    'action.showMore': 'Tampilkan Lebih',
    'action.print': 'Cetak',

    // Navigation
    'nav.dashboard': 'Dasbor',
    'nav.commodities': 'Komoditas',
    'nav.balance': 'Saldo',
    'nav.transactions': 'Transaksi',
    'nav.orderbook': 'Order Book',
    'nav.prices': 'Harga',
    'nav.shipping': 'Pengiriman',
    'nav.profile': 'Profil',
    'nav.logout': 'Keluar',
    'nav.settings': 'Pengaturan',
    'nav.notifications': 'Notifikasi',
    'nav.home': 'Beranda',

    // Commodities
    'commodities.title': 'Komoditas',
    'commodities.subtitle': 'Kelola komoditas pertanian Anda',
    'commodities.add': 'Tambah Komoditas',
    'commodities.name': 'Nama',
    'commodities.type': 'Jenis',
    'commodities.quantity': 'Jumlah',
    'commodities.location': 'Lokasi',
    'commodities.grade': 'Grade',
    'commodities.action': 'Aksi',
    'commodities.search': 'Cari komoditas...',
    'commodities.detail': 'Detail Komoditas',
    'commodities.qrcode': 'QR Code',
    'commodities.unit': 'Satuan',
    'commodities.created': 'Tanggal Dibuat',
    'commodities.upload.image': 'Unggah foto komoditas',
    'commodities.upload.grade': 'Unggah file grading',
    'commodities.list': 'Daftar Komoditas',
    'commodities.notfound': 'Tidak ada komoditas yang ditemukan',
    'commodities.history': 'Riwayat Transaksi',
    'commodities.export': 'Ekspor Data',
    'commodities.import': 'Impor Data',
    'commodities.filter': 'Filter Komoditas',
    'commodities.sort': 'Urutkan Berdasarkan',
    'commodities.harvest': 'Tanggal Panen',
    'commodities.origin': 'Asal',
    'commodities.category': 'Kategori',
    'commodities.price': 'Harga',
    'commodities.certifications': 'Sertifikasi',
    'commodities.description': 'Deskripsi',

    // Transactions
    'transactions.title': 'Transaksi',
    'transactions.subtitle': 'Kelola transaksi komoditas Anda',
    'transactions.id': 'ID Transaksi',
    'transactions.type': 'Tipe',
    'transactions.commodity': 'Komoditas',
    'transactions.quantity': 'Jumlah',
    'transactions.price': 'Harga',
    'transactions.status': 'Status',
    'transactions.buyer': 'Pembeli',
    'transactions.seller': 'Penjual',
    'transactions.date': 'Tanggal',
    'transactions.action': 'Aksi',
    'transactions.search': 'Cari transaksi...',
    'transactions.detail': 'Detail Transaksi',
    'transactions.all': 'Semua',
    'transactions.pending': 'Menunggu',
    'transactions.processed': 'Diproses',
    'transactions.completed': 'Selesai',
    'transactions.canceled': 'Dibatalkan',
    'transactions.total': 'Total Harga',
    'transactions.terms': 'Syarat & Ketentuan',
    'transactions.notfound': 'Tidak ada transaksi yang ditemukan',
    'transactions.filters': 'Filter Transaksi',
    'transactions.payment': 'Metode Pembayaran',
    'transactions.timeline': 'Timeline Transaksi',
    'transactions.documents': 'Dokumen',
    'transactions.notes': 'Catatan',
    'transactions.invoice': 'Faktur',
    'transactions.empty': 'Tidak ada transaksi yang ditemukan',
    'transactions.new': 'Transaksi Baru',
    'transactions.regular': 'Reguler',
    'transactions.list': 'Daftar Transaksi',
    'transactions.print': 'Cetak Transaksi',
    'transactions.updatedAt': 'Tanggal Diperbarui',
    'transactions.summary': 'Ringkasan Transaksi',

    // Order Book
    'orderbook.title': 'Order Book',
    'orderbook.subtitle': 'Lihat dan terima permintaan komoditas dari pembeli',
    'orderbook.id': 'ID Order',
    'orderbook.buyer': 'Pembeli',
    'orderbook.commodity': 'Komoditas',
    'orderbook.quantity': 'Jumlah',
    'orderbook.grade': 'Grade yang Diminta',
    'orderbook.delivery': 'Tanggal Pengiriman',
    'orderbook.expiry': 'Tanggal Kedaluwarsa',
    'orderbook.status': 'Status',
    'orderbook.action': 'Aksi',
    'orderbook.search': 'Cari order book...',
    'orderbook.detail': 'Detail Order Book',
    'orderbook.list': 'Daftar Order Book',
    'orderbook.all': 'Semua',
    'orderbook.open': 'Terbuka',
    'orderbook.accepted': 'Diterima',
    'orderbook.completed': 'Selesai',
    'orderbook.expired': 'Kedaluwarsa',
    'orderbook.terms': 'Syarat & Ketentuan',
    'orderbook.notfound': 'Tidak ada order book yang ditemukan',
    'orderbook.filter': 'Filter Order',
    'orderbook.sort': 'Urutkan Berdasarkan',
    'orderbook.create': 'Buat Order',
    'orderbook.price': 'Harga Permintaan',
    'orderbook.total': 'Total Nilai',
    'orderbook.offers': 'Penawaran',
    'orderbook.respond': 'Tanggapi Order',

    // Shipping
    'shipping.title': 'Pengiriman',
    'shipping.subtitle': 'Lacak dan kelola pengiriman Anda',
    'shipping.id': 'ID Pengiriman',
    'shipping.origin': 'Asal',
    'shipping.destination': 'Tujuan',
    'shipping.status': 'Status',
    'shipping.carrier': 'Kurir',
    'shipping.tracking': 'Nomor Pelacakan',
    'shipping.departureDate': 'Tanggal Keberangkatan',
    'shipping.arrivalDate': 'Perkiraan Kedatangan',
    'shipping.commodity': 'Komoditas',
    'shipping.weight': 'Berat',
    'shipping.cost': 'Biaya Pengiriman',
    'shipping.documents': 'Dokumen',
    'shipping.notfound': 'Tidak ada pengiriman yang ditemukan',
    'shipping.create': 'Buat Pengiriman',
    'shipping.detail': 'Detail Pengiriman',
    'shipping.updateStatus': 'Perbarui Status',
    'shipping.trackShipment': 'Lacak Pengiriman',
    'shipping.vehicle': 'Jenis Kendaraan',
    'shipping.driverInfo': 'Informasi Pengemudi',
    'shipping.contact': 'Kontak',
    'shipping.instructions': 'Instruksi Khusus',
    'shipping.route': 'Informasi Rute',
    'shipping.stops': 'Tempat Pemberhentian',
    'shipping.history': 'Riwayat Status',

    // Prices
    'prices.title': 'Harga Pasar',
    'prices.name': 'Nama Komoditas',
    'prices.price': 'Harga',
    'prices.unit': 'Satuan',
    'prices.subtitle': 'Lihat harga komoditas saat ini',
    'prices.commodity': 'Komoditas',
    'prices.category': 'Kategori',
    'prices.currentPrice': 'Harga Saat Ini',
    'prices.change': 'Perubahan 24 Jam',
    'prices.volume': 'Volume 24 Jam',
    'prices.high': 'Tertinggi 24 Jam',
    'prices.action': 'Aksi',
    'prices.low': 'Terendah 24 Jam',
    'prices.region': 'Wilayah',
    'prices.grade': 'Grading',
    'prices.chart': 'Grafik Harga',
    'prices.history': 'Riwayat Harga',
    'prices.forecast': 'Perkiraan Harga',
    'prices.market': 'Pasar',
    'prices.date': 'Terakhir Diperbarui',
    'prices.notfound': 'Tidak ada harga komoditas yang ditemukan',
    'prices.source': 'Sumber Data',
    'prices.filter': 'Filter Harga',
    'prices.compare': 'Bandingkan',
    'prices.watchlist': 'Tambah ke Watchlist',
    'prices.trends': 'Tren Pasar',
    'prices.notifications': 'Notifikasi Harga',

    // Status labels
    'status.open': 'Terbuka',
    'status.accepted': 'Diterima',
    'status.completed': 'Selesai',
    'status.expired': 'Kedaluwarsa',
    'status.canceled': 'Dibatalkan',
    'status.pending': 'Menunggu',
    'status.confirmed': 'Dikonfirmasi',
    'status.paid': 'Dibayar',
    'status.shipped': 'Dikirim',
    'status.received': 'Diterima',
    'status.processing': 'Diproses',
    'status.notshipped': 'Belum Dikirim',
    'status.shipping': 'Sedang Dikirim',
    'status.delivered': 'Terkirim',
    'status.inTransit': 'Dalam Perjalanan',
    'status.outForDelivery': 'Siap Antar',
    'status.failed': 'Gagal',
    'status.delayed': 'Tertunda',
    'status.returned': 'Dikembalikan',
    'status.approved': 'Disetujui',
    'status.rejected': 'Ditolak',
    'status.draft': 'Draf',
    'status.onHold': 'Ditahan',
    'status.negotiating': 'Negosiasi',

    // Dashboard
    'dashboard.title': 'Dasbor',
    'dashboard.welcome': 'Selamat Datang di TaniTrack',
    'dashboard.summary': 'Ringkasan',
    'dashboard.recentTransactions': 'Transaksi Terbaru',
    'dashboard.pendingOrders': 'Pesanan Tertunda',
    'dashboard.upcomingShipments': 'Pengiriman Mendatang',
    'dashboard.marketInsights': 'Wawasan Pasar',
    'dashboard.commodityStatus': 'Status Komoditas',
    'dashboard.analytics': 'Analitik',
    'dashboard.quickActions': 'Aksi Cepat',
    'dashboard.alerts': 'Peringatan',
    'dashboard.recommendations': 'Rekomendasi',

    // Profile/Account
    'profile.title': 'Profil',
    'profile.personalInfo': 'Informasi Pribadi',
    'profile.company': 'Informasi Perusahaan',
    'profile.security': 'Keamanan',
    'profile.preferences': 'Preferensi',
    'profile.notifications': 'Notifikasi',
    'profile.paymentMethods': 'Metode Pembayaran',
    'profile.accountHistory': 'Riwayat Akun',
    'profile.documents': 'Dokumen',
    'profile.settings': 'Pengaturan Akun',
    'profile.help': 'Bantuan & Dukungan',
    'profile.logout': 'Keluar',
    'profile.editProfile': 'Edit Profil',
    'profile.changePassword': 'Ubah Kata Sandi',
    'profile.language': 'Bahasa',
    'profile.theme': 'Tema',
    'profile.verifications': 'Verifikasi',

    // Balance/Finance
    'balance.title': 'Saldo',
    'balance.available': 'Saldo Tersedia',
    'balance.pending': 'Tertunda',
    'balance.totalValue': 'Total Nilai',
    'balance.transactions': 'Riwayat Transaksi',
    'balance.withdraw': 'Tarik',
    'balance.deposit': 'Setor',
    'balance.transfer': 'Transfer',
    'balance.statement': 'Laporan',
    'balance.paymentMethods': 'Metode Pembayaran',
    'balance.settings': 'Pengaturan Pembayaran',
    'balance.currency': 'Mata Uang',
    'balance.exchange': 'Nilai Tukar',

    // Time and dates
    'time.today': 'Hari Ini',
    'time.yesterday': 'Kemarin',
    'time.tomorrow': 'Besok',
    'time.thisWeek': 'Minggu Ini',
    'time.lastWeek': 'Minggu Lalu',
    'time.thisMonth': 'Bulan Ini',
    'time.lastMonth': 'Bulan Lalu',
    'time.thisYear': 'Tahun Ini',
    'time.lastYear': 'Tahun Lalu',
    'time.custom': 'Rentang Kustom',

    // Charts and Analytics
    'charts.dailyPrices': 'Harga Harian',
    'charts.monthlyVolume': 'Volume Bulanan',
    'charts.commodityDistribution': 'Distribusi Komoditas',
    'charts.transactionTrends': 'Tren Transaksi',
    'charts.marketComparison': 'Perbandingan Pasar',
    'charts.supplyDemand': 'Penawaran & Permintaan',
    'charts.seasonalTrends': 'Tren Musiman',
    'charts.priceForecasts': 'Perkiraan Harga',
    'charts.exportImport': 'Rasio Ekspor/Impor',
    'charts.incomeExpenses': 'Pendapatan & Pengeluaran',

    // Errors and notifications
    'error.generic': 'Terjadi kesalahan',
    'error.notFound': 'Tidak ditemukan',
    'error.unauthorized': 'Akses tidak sah',
    'error.forbidden': 'Akses dilarang',
    'error.validation': 'Kesalahan validasi',
    'error.network': 'Kesalahan jaringan',
    'error.serverError': 'Kesalahan server',
    'error.timeout': 'Waktu permintaan habis',
    'error.unavailable': 'Layanan tidak tersedia',
    'success.saved': 'Berhasil disimpan',
    'success.created': 'Berhasil dibuat',
    'success.updated': 'Berhasil diperbarui',
    'success.deleted': 'Berhasil dihapus',
    'info.processing': 'Memproses permintaan Anda',
    'info.noData': 'Tidak ada data tersedia',
    'warning.unsaved': 'Anda memiliki perubahan yang belum disimpan',

    // Market
    'market.title': 'Pasar Komoditas',
    'market.subtitle': 'Jelajahi dan beli komoditas pertanian berkualitas langsung dari petani.',
    'market.search': 'Cari komoditas...',
    'market.filter': 'Filter',
    'market.sort': 'Urutkan',
    'market.currentPrices': 'Lihat Harga Terkini',
    'market.farmer': 'Petani',
    'market.location': 'Lokasi',
    'market.stock': 'Stok',
    'market.price': 'Harga',
    'market.details': 'Detail',
    'market.buy': 'Beli',
    'market.noResults': 'Tidak ada komoditas yang ditemukan',
    'market.minOrder': 'Pembelian minimum',
    'market.certifications': 'Sertifikasi',
    'market.harvestDate': 'Tanggal Panen',
    'market.variety': 'Varietas',
    'market.grade': 'Grade',
    'market.description': 'Deskripsi',
    'market.nutrition': 'Nutrisi',
    'market.storage': 'Penyimpanan',
    'market.buyNow': 'Beli Sekarang',
    'market.contactFarmer': 'Hubungi Petani',
    'market.viewAllProducts': 'Lihat Semua Produk',
    'market.farmerInfo': 'Informasi Petani',
    'market.memberSince': 'Bergabung sejak',
    'market.transactions': 'transaksi',
    'market.reviews': 'Ulasan Pembeli',
    'market.noReviews': 'Belum ada ulasan',
    'market.backToMarket': 'Kembali ke Pasar',
    'market.notFound': 'Komoditas tidak ditemukan',

    // Transaction Flow Explainer
    'flow.title': 'Proses Transaksi',
    'flow.subtitle': 'Berikut adalah cara kerja proses transaksi dari awal hingga akhir:',
    'flow.current': 'Langkah Saat Ini',
    'flow.helpTitle': 'Butuh bantuan?',
    'flow.helpText':
      'Jika Anda membutuhkan bantuan pada langkah mana pun dalam proses ini, silakan hubungi tim dukungan kami melalui pusat bantuan atau WhatsApp.',

    'flow.pending.title': '1. Pesanan Diterima',
    'flow.pending.description':
      'Pembeli telah melakukan pemesanan untuk komoditas Anda. Tinjau detail pesanan dan putuskan untuk menerima atau menolak.',

    'flow.confirmed.title': '2. Pesanan Dikonfirmasi',
    'flow.confirmed.description':
      'Anda telah mengkonfirmasi pesanan. Pembeli telah diberi tahu dan menunggu informasi lebih lanjut.',

    'flow.negotiating.title': '3. Negosiasi Harga',
    'flow.negotiating.description':
      'Diskusikan dan negosiasikan syarat harga dengan pembeli hingga kedua belah pihak puas.',

    'flow.paid.title': '4. Pembayaran Diterima',
    'flow.paid.description':
      'Pembeli telah melakukan pembayaran untuk pesanan. Anda sekarang dapat melanjutkan dengan persiapan pengiriman.',

    'flow.processing.title': '5. Persiapan Pengiriman',
    'flow.processing.description':
      'Siapkan komoditas yang dipesan untuk pengiriman. Pastikan pengemasan dan dokumentasi yang tepat.',

    'flow.shipping.title': '6. Pengiriman dalam Perjalanan',
    'flow.shipping.description':
      'Komoditas sedang dalam perjalanan ke pembeli. Informasi pelacakan telah diberikan kepada pembeli.',

    'flow.shipped.title': '7. Pengiriman Terkirim',
    'flow.shipped.description': 'Pengiriman telah sampai di alamat yang ditentukan pembeli.',

    'flow.received.title': '8. Pesanan Diterima',
    'flow.received.description':
      'Pembeli telah mengkonfirmasi penerimaan komoditas dan sedang memeriksa barang.',

    'flow.completed.title': '9. Transaksi Selesai',
    'flow.completed.description':
      'Transaksi telah berhasil diselesaikan. Dana telah dilepaskan ke akun Anda.',
  },
};

// Create the language context
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  // Load saved language preference from localStorage on initialization
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[language][key]) {
      return translations[language][key];
    }
    return key; // Fallback: return the key itself if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
