import type { z } from 'zod';
import type { siteConfigSchema } from '@/lib/content/schemas';

/**
 * MOCK — stands in for `GET /site/config` until the backend serves it.
 * Support details mirror the backend's ⚙ `support.*` defaults; the Play
 * listing uses the app's real applicationId (`com.vokve.fitness`).
 */
export const siteConfig = {
  brand: {
    name: 'VOKVE',
    tagline: 'Walk. Earn. Redeem.',
    description:
      'VOKVE turns the steps you already take into coins you can spend on real rewards — every step verified, every coin earned.',
  },
  seo: {
    siteUrl: 'https://vokve.app',
    titleTemplate: '%s · VOKVE',
    defaultTitle: 'VOKVE — Walk. Earn. Redeem.',
    description:
      'Count your steps, keep your streak, win challenges and spend the coins you earn on real rewards. VOKVE is the fitness app where every step is verified.',
    keywords: ['step counter', 'walk and earn', 'fitness rewards', 'step challenges', 'VOKVE'],
  },
  company: {
    legalName: 'VOKVE Fitness',
    email: 'support@vokve.app',
    phone: '+918000000000',
    whatsapp: null,
    hours: 'Mon–Sat, 9 am – 7 pm IST',
    responseTime: 'We usually reply within 24 hours.',
    address: ['VOKVE Fitness', 'India'],
    grievanceOfficer: { title: 'Grievance Officer', name: null, email: 'support@vokve.app' },
  },
  stores: {
    android: {
      url: 'https://play.google.com/store/apps/details?id=com.vokve.fitness',
      label: 'Google Play',
      caption: 'Get it on',
      note: null,
    },
    ios: {
      url: null,
      label: 'App Store',
      caption: 'Download on the',
      note: 'Coming soon',
    },
  },
  announcement: {
    badge: 'New',
    text: 'Weekly and monthly step challenges, each with its own coin reward.',
    link: { label: 'See challenges', href: '/#challenges' },
  },
  nav: [
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  headerCta: { label: 'Get the app', href: '/#download' },
  footer: {
    blurb:
      'The fitness app that pays you back for walking — verified steps, honest coins, real rewards.',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '/#features' },
          { label: 'How it works', href: '/#how-it-works' },
          { label: 'Challenges', href: '/#challenges' },
          { label: 'Fair play', href: '/#fair-play' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About us', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Help & FAQ', href: '/faq' },
          { label: 'Open-source licences', href: '/licenses' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms & Conditions', href: '/terms' },
          { label: 'Coins & Fair Play', href: '/rewards-policy' },
          { label: 'Refunds & Cancellations', href: '/refund-policy' },
          { label: 'Shipping & Delivery', href: '/shipping-policy' },
        ],
      },
      {
        title: 'Your account',
        links: [
          { label: 'Delete your account', href: '/delete-account' },
          { label: 'Download your data', href: '/delete-account#export' },
          { label: 'All legal documents', href: '/legal' },
        ],
      },
    ],
    copyright: '© 2026 VOKVE Fitness. All rights reserved.',
    disclaimer:
      'VOKVE is a wellness app. It does not give medical advice — speak to a doctor about anything your readings worry you about.',
  },
  social: [],
  labels: {
    skipToContent: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    themeToggle: 'Switch between light and dark',
    onThisPage: 'On this page',
    lastUpdated: 'Last updated',
    effectiveFrom: 'Effective from',
    version: 'Version',
    shortVersion: 'The short version',
    searchPlaceholder: 'Search questions — try “coins” or “delete”',
    allCategories: 'All',
    noResults: 'Nothing matches that yet. Try another word, or write to us.',
    copy: 'Copy code',
    copied: 'Copied',
    readMore: 'Read more',
    notFoundTitle: 'This page wandered off',
    notFoundBody: 'The link may be old or mistyped. Everything else is right where you left it.',
    backHome: 'Back to home',
    questionsTitle: 'Questions about this document?',
    questionsBody: 'Write to us and a person — not a bot — will answer.',
  },
} satisfies z.input<typeof siteConfigSchema>;
