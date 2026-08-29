export const APP_NAME = 'AutoCare Pro';

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About Us', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Contact', to: '/contact' },
];

export const TIME_SLOTS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

export const SERVICE_CATEGORIES = [
  { value: 'all', label: 'All Services' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'repair', label: 'Repair' },
  { value: 'diagnostics', label: 'Diagnostics' },
  { value: 'tires', label: 'Tires' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'body', label: 'Body Work' },
  { value: 'other', label: 'Other' },
];

export const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

export const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  'in-progress': 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

export const WORKSHOP_INFO = {
  address: '1245 Industrial Avenue, Autoville, CA 90210',
  phone: '+1 (555) 234-5678',
  emergencyPhone: '+1 (555) 911-0000',
  email: 'service@autocarepro.example',
  hours: [
    { day: 'Monday - Friday', time: '7:30 AM - 7:00 PM' },
    { day: 'Saturday', time: '8:00 AM - 5:00 PM' },
    { day: 'Sunday', time: 'Emergency Service Only' },
  ],
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3020.5!2d-118.4!3d34.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAzJzAwLjAiTiAxMTjCsDI0JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1600000000000',
};
