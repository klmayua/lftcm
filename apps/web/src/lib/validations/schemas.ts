import { z } from 'zod';

// Common validation patterns
export const patterns = {
  phone: /^\+?[\d\s-()]+$/,
  cameroonPhone: /^(\+237|237)?[6-9]\d{8}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

// Error messages in English and French for i18n
export const errorMessages = {
  required: {
    en: 'This field is required',
    fr: 'Ce champ est requis',
  },
  email: {
    en: 'Please enter a valid email address',
    fr: 'Veuillez entrer une adresse email valide',
  },
  phone: {
    en: 'Please enter a valid phone number',
    fr: 'Veuillez entrer un numéro de téléphone valide',
  },
  cameroonPhone: {
    en: 'Please enter a valid Cameroon phone number (e.g., +237 6XX XXX XXX)',
    fr: 'Veuillez entrer un numéro de téléphone camerounais valide (ex: +237 6XX XXX XXX)',
  },
  minLength: (min: number) => ({
    en: `Must be at least ${min} characters`,
    fr: `Doit contenir au moins ${min} caractères`,
  }),
  maxLength: (max: number) => ({
    en: `Must be at most ${max} characters`,
    fr: `Doit contenir au plus ${max} caractères`,
  }),
  password: {
    en: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    fr: 'Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule et chiffre',
  },
  passwordMatch: {
    en: 'Passwords do not match',
    fr: 'Les mots de passe ne correspondent pas',
  },
  amount: {
    en: 'Please enter a valid amount',
    fr: 'Veuillez entrer un montant valide',
  },
  minAmount: (min: number) => ({
    en: `Amount must be at least ${min} XAF`,
    fr: `Le montant doit être d'au moins ${min} FCFA`,
  }),
};

// Login schema
export const loginSchema = z.object({
  email: z.string().min(1, errorMessages.required.en).email(errorMessages.email.en),
  password: z.string().min(1, errorMessages.required.en),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Registration schema
export const registerSchema = z.object({
  firstName: z.string().min(2, errorMessages.minLength(2).en),
  lastName: z.string().min(2, errorMessages.minLength(2).en),
  email: z.string().email(errorMessages.email.en),
  phone: z.string().regex(patterns.cameroonPhone, errorMessages.cameroonPhone.en),
  password: z
    .string()
    .min(8, errorMessages.minLength(8).en)
    .regex(/[A-Z]/, errorMessages.password.en)
    .regex(/[a-z]/, errorMessages.password.en)
    .regex(/[0-9]/, errorMessages.password.en),
  confirmPassword: z.string(),
  branchId: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: errorMessages.passwordMatch.en,
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Prayer request schema
export const prayerRequestSchema = z.object({
  title: z.string().min(5, errorMessages.minLength(5).en).max(100, errorMessages.maxLength(100).en),
  content: z.string().min(20, errorMessages.minLength(20).en).max(2000, errorMessages.maxLength(2000).en),
  category: z.enum(['healing', 'provision', 'guidance', 'family', 'ministry', 'other']),
  isAnonymous: z.boolean().default(false),
  isPublic: z.boolean().default(false),
  name: z.string().optional(),
  email: z.string().email(errorMessages.email.en).optional().or(z.literal('')),
  phone: z.string().regex(patterns.cameroonPhone, errorMessages.cameroonPhone.en).optional().or(z.literal('')),
}).refine((data) => {
  // If not anonymous, name is required
  if (!data.isAnonymous && !data.name) {
    return false;
  }
  return true;
}, {
  message: 'Name is required when not submitting anonymously',
  path: ['name'],
});

export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>;

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, errorMessages.minLength(2).en).max(100, errorMessages.maxLength(100).en),
  email: z.string().email(errorMessages.email.en),
  phone: z.string().regex(patterns.cameroonPhone, errorMessages.cameroonPhone.en).optional().or(z.literal('')),
  subject: z.string().min(5, errorMessages.minLength(5).en).max(100, errorMessages.maxLength(100).en),
  message: z.string().min(20, errorMessages.minLength(20).en).max(2000, errorMessages.maxLength(2000).en),
  branchId: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Online giving schema
export const givingSchema = z.object({
  amount: z.number().min(100, errorMessages.minAmount(100).en),
  currency: z.enum(['XAF', 'USD', 'EUR']).default('XAF'),
  type: z.enum(['tithe', 'offering', 'partnership', 'building', 'special', 'other']),
  paymentMethod: z.enum(['mobile_money', 'card', 'bank_transfer']),
  phoneNumber: z.string().regex(patterns.cameroonPhone, errorMessages.cameroonPhone.en).optional(),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['weekly', 'biweekly', 'monthly']).optional(),
  message: z.string().max(500, errorMessages.maxLength(500).en).optional(),
}).refine((data) => {
  // Phone number required for mobile money
  if (data.paymentMethod === 'mobile_money' && !data.phoneNumber) {
    return false;
  }
  return true;
}, {
  message: 'Phone number is required for Mobile Money payments',
  path: ['phoneNumber'],
}).refine((data) => {
  // Frequency required if recurring
  if (data.isRecurring && !data.frequency) {
    return false;
  }
  return true;
}, {
  message: 'Please select a frequency for recurring giving',
  path: ['frequency'],
});

export type GivingInput = z.infer<typeof givingSchema>;

// Event registration schema
export const eventRegistrationSchema = z.object({
  firstName: z.string().min(2, errorMessages.minLength(2).en),
  lastName: z.string().min(2, errorMessages.minLength(2).en),
  email: z.string().email(errorMessages.email.en),
  phone: z.string().regex(patterns.cameroonPhone, errorMessages.cameroonPhone.en),
  eventId: z.string(),
  numberOfGuests: z.number().min(0).max(10).default(0),
  dietaryRequirements: z.string().max(500).optional(),
  specialNeeds: z.string().max(500).optional(),
  emergencyContact: z.object({
    name: z.string().min(2),
    phone: z.string().regex(patterns.cameroonPhone, errorMessages.cameroonPhone.en),
  }).optional(),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;

// Member profile update schema
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, errorMessages.minLength(2).en),
  lastName: z.string().min(2, errorMessages.minLength(2).en),
  phone: z.string().regex(patterns.cameroonPhone, errorMessages.cameroonPhone.en),
  dateOfBirth: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().default('Cameroon'),
  }).optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  occupation: z.string().max(100).optional(),
  employer: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, errorMessages.required.en),
  newPassword: z
    .string()
    .min(8, errorMessages.minLength(8).en)
    .regex(/[A-Z]/, errorMessages.password.en)
    .regex(/[a-z]/, errorMessages.password.en)
    .regex(/[0-9]/, errorMessages.password.en),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: errorMessages.passwordMatch.en,
  path: ['confirmPassword'],
});

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email(errorMessages.email.en),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  preferences: z.object({
    sermons: z.boolean().default(true),
    events: z.boolean().default(true),
    news: z.boolean().default(true),
    prayerRequests: z.boolean().default(false),
  }).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
