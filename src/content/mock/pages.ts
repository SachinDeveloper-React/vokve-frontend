import type { z } from 'zod';
import type {
  contactPageSchema,
  invitePageSchema,
  legalIndexSchema,
  licensesPageSchema,
} from '@/lib/content/schemas';

/**
 * MOCK — `GET /site/pages/contact`. The channels carry tokens, not numbers:
 * `{{email}}`, `{{phone}}`, `{{whatsapp…}}` and `{{hours}}` are filled from
 * the live details the CRM edits (`GET /site/company`), and a channel whose
 * link needs a detail that is not set — no phone, no WhatsApp — is left out.
 */
export const contactPage = {
  seo: {
    title: 'Contact us',
    description: 'Reach the VOKVE support team by email, phone or from inside the app.',
  },
  hero: {
    eyebrow: 'Contact',
    title: 'Talk to a person',
    subtitle: 'Questions about coins, an order or your account — we read every message and we usually reply within a day.',
  },
  channels: [
    {
      icon: 'mail',
      tone: 'blue',
      title: 'Email',
      value: '{{email}}',
      href: 'mailto:{{email}}',
      note: '{{responseTime}}',
    },
    {
      icon: 'phone',
      tone: 'green',
      title: 'Phone',
      value: '{{phoneDisplay}}',
      href: 'tel:{{phone}}',
      note: '{{hours}}',
    },
    {
      icon: 'message-circle',
      tone: 'cyan',
      title: 'WhatsApp',
      value: '{{whatsappDisplay}}',
      href: '{{whatsappLink}}',
      note: '{{hours}}',
    },
    {
      icon: 'message-circle',
      tone: 'violet',
      title: 'In the app',
      value: 'Help & Support',
      href: null,
      note: 'Fastest for anything about your account — your app version and device are attached for you.',
    },
  ],
  inApp: {
    title: 'Already using VOKVE?',
    body: 'Open a ticket from the app. It carries your app version and device automatically, and the conversation stays in one place.',
    path: ['Account', 'Help & Support', 'Report an Issue'],
  },
  companyTitle: 'Company details',
  grievanceNote:
    'Complaints about your data or an order can be sent to our Grievance Officer. We acknowledge them within 24 hours and aim to resolve them within 30 days.',
} satisfies z.input<typeof contactPageSchema>;

/** MOCK — `GET /site/legal`, the hub that lists every document. */
export const legalIndex = {
  seo: {
    title: 'Legal',
    description: 'Every VOKVE policy in one place: privacy, terms, coins, refunds and shipping.',
  },
  hero: {
    eyebrow: 'Legal',
    title: 'The fine print, in plain words',
    subtitle: 'Everything that governs your use of VOKVE. Each document starts with a short version.',
  },
  documents: [
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      summary: 'What we collect, why, and the controls you have.',
      href: '/privacy',
      icon: 'shield-check',
      updatedAt: '2026-11-21',
    },
    {
      slug: 'terms',
      title: 'Terms & Conditions',
      summary: 'The agreement between you and VOKVE.',
      href: '/terms',
      icon: 'file-text',
      updatedAt: '2026-11-21',
    },
    {
      slug: 'rewards-policy',
      title: 'Coins & Fair Play',
      summary: 'How coins are earned, verified, capped and spent.',
      href: '/rewards-policy',
      icon: 'coins',
      updatedAt: '2026-11-21',
    },
    {
      slug: 'refund-policy',
      title: 'Refunds & Cancellations',
      summary: 'Cancelling, returning and getting your money back.',
      href: '/refund-policy',
      icon: 'rotate-ccw',
      updatedAt: '2026-11-21',
    },
    {
      slug: 'shipping-policy',
      title: 'Shipping & Delivery',
      summary: 'Where we deliver, what it costs and how long it takes.',
      href: '/shipping-policy',
      icon: 'truck',
      updatedAt: '2026-11-21',
    },
    {
      slug: 'delete-account',
      title: 'Account deletion',
      summary: 'How to delete your account and what happens to your data.',
      href: '/delete-account',
      icon: 'trash-2',
      updatedAt: '2026-11-21',
    },
    {
      slug: 'licenses',
      title: 'Open-source licences',
      summary: 'The open-source software VOKVE is built with.',
      href: '/licenses',
      icon: 'code',
      updatedAt: '2026-11-21',
    },
  ],
} satisfies z.input<typeof legalIndexSchema>;

/**
 * MOCK — `GET /site/pages/licenses`. Versions and licences are read from the
 * app's installed dependencies (package.json → node_modules) on 2026-11-21.
 */
export const licensesPage = {
  seo: {
    title: 'Open-source licences',
    description: 'The open-source software the VOKVE app is built with, and the licences it is used under.',
  },
  hero: {
    eyebrow: 'Credits',
    title: 'Built on the shoulders of open source',
    subtitle: 'VOKVE uses these open-source projects. We are grateful to everyone who maintains them.',
  },
  intro: 'Each project is used under its own licence, linked below.',
  packages: [
    { name: 'React Native', version: '0.87.1', license: 'MIT', url: 'https://github.com/react/react-native' },
    { name: 'React', version: '19.2.3', license: 'MIT', url: 'https://github.com/facebook/react' },
    { name: 'React Navigation', version: '7.3.18', license: 'MIT', url: 'https://github.com/react-navigation/react-navigation' },
    { name: 'React Native Firebase', version: '26.4.0', license: 'Apache-2.0', url: 'https://github.com/invertase/react-native-firebase' },
    { name: 'Notifee', version: '9.1.8', license: 'Apache-2.0', url: 'https://github.com/invertase/notifee' },
    { name: 'React Native Apple Authentication', version: '2.5.1', license: 'Apache-2.0', url: 'https://github.com/invertase/react-native-apple-authentication' },
    { name: 'Nitro Google Sign-In', version: '2.3.0', license: 'MIT', url: 'https://github.com/react-native-nitro-google-sign-in/google-signin' },
    { name: 'Nitro Modules', version: '0.37.1', license: 'MIT', url: 'https://github.com/mrousavy/nitro' },
    { name: 'react-native-step-tracker-pro', version: '2.11.0', license: 'MIT', url: 'https://github.com/SachinDeveloper-React/react-native-step-tracker-pro' },
    { name: 'react-native-step-tracker-pro-ios', version: '1.1.1', license: 'MIT', url: 'https://github.com/SachinDeveloper-React/react-native-step-tracker-pro-ios' },
    { name: 'Reanimated', version: '4.6.0', license: 'MIT', url: 'https://github.com/software-mansion/react-native-reanimated' },
    { name: 'React Native Worklets', version: '0.12.2', license: 'MIT', url: 'https://github.com/software-mansion/react-native-reanimated' },
    { name: 'React Native Screens', version: '4.27.0', license: 'MIT', url: 'https://github.com/software-mansion/react-native-screens' },
    { name: 'React Native SVG', version: '15.15.5', license: 'MIT', url: 'https://github.com/software-mansion/react-native-svg' },
    { name: 'Safe Area Context', version: '5.9.1', license: 'MIT', url: 'https://github.com/AppAndFlow/react-native-safe-area-context' },
    { name: 'Keyboard Controller', version: '1.22.4', license: 'MIT', url: 'https://github.com/kirillzyusko/react-native-keyboard-controller' },
    { name: 'FlashList', version: '2.3.2', license: 'MIT', url: 'https://github.com/Shopify/flash-list' },
    { name: 'MMKV', version: '4.3.2', license: 'MIT', url: 'https://github.com/mrousavy/react-native-mmkv' },
    { name: 'React Native Keychain', version: '10.0.0', license: 'MIT', url: 'https://github.com/oblador/react-native-keychain' },
    { name: 'Device Info', version: '15.0.2', license: 'MIT', url: 'https://github.com/react-native-device-info/react-native-device-info' },
    { name: 'NetInfo', version: '12.0.1', license: 'MIT', url: 'https://github.com/react-native-netinfo/react-native-netinfo' },
    { name: 'Image Picker', version: '8.2.1', license: 'MIT', url: 'https://github.com/react-native-image-picker/react-native-image-picker' },
    { name: 'Clipboard', version: '1.16.3', license: 'MIT', url: 'https://github.com/react-native-clipboard/clipboard' },
    { name: 'Slider', version: '5.2.1', license: 'MIT', url: 'https://github.com/callstack/react-native-slider' },
    { name: 'Linear Gradient', version: '2.8.3', license: 'MIT', url: 'https://github.com/react-native-linear-gradient/react-native-linear-gradient' },
    { name: 'Lucide', version: '1.44.0', license: 'ISC', url: 'https://github.com/lucide-icons/lucide' },
    { name: 'React Hook Form', version: '7.87.0', license: 'MIT', url: 'https://github.com/react-hook-form/react-hook-form' },
    { name: 'Hookform Resolvers', version: '5.9.1', license: 'MIT', url: 'https://github.com/react-hook-form/resolvers' },
    { name: 'Zod', version: '4.6.7', license: 'MIT', url: 'https://github.com/colinhacks/zod' },
    { name: 'Zustand', version: '5.0.15', license: 'MIT', url: 'https://github.com/pmndrs/zustand' },
    { name: 'Immer', version: '11.1.18', license: 'MIT', url: 'https://github.com/immerjs/immer' },
    { name: 'Axios', version: '1.20.0', license: 'MIT', url: 'https://github.com/axios/axios' },
  ],
} satisfies z.input<typeof licensesPageSchema>;

/**
 * MOCK — `GET /site/pages/invite`, behind the share links the backend writes
 * (⚙ `support.inviteUrlBase` = https://vokve.com/r → /r/{code}). The reward is
 * ⚙ `coins.referral.invitee`; the pattern is the backend's code alphabet
 * (RULES F1: no O, 0, I or 1) and length (7).
 */
export const invitePage = {
  seo: {
    title: 'You’re invited to VOKVE',
    description: 'A friend invited you to VOKVE — the app that pays you coins for walking. Join with their code and you both get coins.',
  },
  hero: {
    eyebrow: 'You’re invited',
    title: 'A friend wants you walking with them',
    subtitle: 'Join VOKVE with their invite code and you both get coins once you get going.',
  },
  reward: { value: '20 coins', label: 'for you, and 20 for your friend' },
  codeLabel: 'Your invite code',
  steps: [
    { title: 'Download VOKVE', body: 'From Google Play or the App Store.' },
    { title: 'Sign up', body: 'Create your account and verify your email and phone.' },
    { title: 'Enter the code', body: 'On the Refer & Earn screen, within 7 days of joining.' },
    { title: 'Get moving', body: 'The coins land once your first active day checks out.' },
  ],
  invalid: {
    title: 'This invite link looks incomplete',
    body: 'Ask your friend to send their code again — it is 7 letters and numbers. You can still download VOKVE and add the code later.',
  },
  codePattern: '^[A-HJ-NP-Z2-9]{7}$',
} satisfies z.input<typeof invitePageSchema>;
