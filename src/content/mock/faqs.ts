import type { z } from 'zod';
import type { faqItemSchema, faqPageSchema } from '@/lib/content/schemas';

type FaqInput = z.input<typeof faqItemSchema>;

/**
 * MOCK — the help centre's articles, copied from the backend's seed
 * (`vokve-backend/src/seed/data.ts`, SUPPORT_FAQS) so the site and the app
 * say the same thing. `GET /site/faqs` should serve the live
 * `support_faqs` rows (active ones, in `sort` order).
 */
export const faqItems: FaqInput[] = [
  {
    id: 'faq-coins-earn',
    category: 'coins',
    question: 'How do I earn coins?',
    answer:
      'Walking, finishing a workout, keeping a streak, winning a challenge and inviting friends all pay coins. Steps pay a little every 100 you walk, a workout pays a fixed amount, and streak milestones pay a bonus. There is a daily ceiling across everything so one big day cannot pay forever.',
    tags: ['earning', 'steps', 'rewards', 'points'],
  },
  {
    id: 'faq-coins-missing',
    category: 'coins',
    question: 'My coins did not arrive. Where are they?',
    answer:
      'Step coins are held briefly while we check the day looks real, and appear as "pending" in your wallet until then. If you have hit the daily cap, anything further that day pays nothing — the cap resets at midnight in your timezone. Coin History shows every credit with its reason.',
    tags: ['missing', 'pending', 'not credited', 'cap'],
  },
  {
    id: 'faq-coins-expiry',
    category: 'coins',
    question: 'Do my coins expire?',
    answer:
      'Coins expire after 90 days without a step sync. Every time your phone sends its steps the whole window starts again — however many steps were in it. Earning coins another way, and spending them, do not reset it. We warn you 14 days and 3 days before.',
    tags: ['expire', 'expiry', 'lost coins'],
  },
  {
    id: 'faq-orders-pay',
    category: 'payments',
    question: 'How much can I pay with coins?',
    answer:
      'All of it. Everything in the VOKVE shop is paid in coins, at ₹0.25 a coin, and delivery is paid in coins too — no card, UPI or bank payment is taken. The checkout shows the total in coins before you confirm.',
    tags: ['discount', 'split', 'upi', 'card', 'price', 'coins only'],
  },
  {
    id: 'faq-orders-track',
    category: 'orders',
    question: 'Where is my order?',
    answer:
      'My Orders shows every order and where it is. Once it ships you get a tracking reference there and a notification. Most orders reach you in 2–4 working days.',
    tags: ['tracking', 'delivery', 'shipped', 'late'],
  },
  {
    id: 'faq-orders-cancel',
    category: 'orders',
    question: 'Can I cancel or return an order?',
    answer:
      'You can cancel from the order page any time before it ships — the coins go straight back to your wallet and any money is refunded to where it came from. After it ships, open a support ticket and we will sort out a return.',
    tags: ['cancel', 'return', 'refund'],
  },
  {
    id: 'faq-tracking-steps',
    category: 'tracking',
    question: 'My steps are not being counted',
    answer:
      'VOKVE reads steps from your phone’s health service. Check that VOKVE still has permission, that battery optimisation is not stopping it in the background, and that you have opened the app at least once today. Steps sync when the app opens.',
    tags: ['steps', 'health connect', 'permission', 'not counting', 'pedometer'],
  },
  {
    id: 'faq-account-email',
    category: 'account',
    question: 'How do I change my email or phone number?',
    answer:
      'Account → Security. Enter your password and the new address or number; we send a code to the new one and it only moves once that code passes. The old one keeps working until then.',
    tags: ['email', 'phone', 'number', 'change', 'update'],
  },
  {
    id: 'faq-account-delete',
    category: 'account',
    question: 'How do I delete my account?',
    answer:
      'Account → Privacy → Delete account. Deletion is scheduled 14 days ahead so you can change your mind — cancel it from the same screen any time before then. After that your personal data is erased; order and payment records are kept anonymised for accounting.',
    tags: ['delete', 'close account', 'remove', 'gdpr'],
  },
  {
    id: 'faq-account-data',
    category: 'account',
    question: 'Can I get a copy of my data?',
    answer:
      'Yes — Account → Privacy → Download my data gives you a JSON file with your profile, activity, workouts, orders, addresses and notifications. You can ask for one once a day.',
    tags: ['export', 'download', 'copy', 'gdpr', 'data'],
  },
  {
    id: 'faq-other-support',
    category: 'other',
    question: 'How do I reach a human?',
    answer:
      'Open a ticket from Help & Support and we will reply inside the app. Tickets carry your app version and device automatically, so you do not have to describe your phone to us.',
    tags: ['contact', 'human', 'ticket', 'email us'],
  },
  {
    id: 'faq-privacy-data',
    category: 'privacy',
    question: 'What data does VOKVE collect, and why?',
    answer:
      'Your steps and workouts, so we can pay coins for them; your profile and address, so an order reaches you; and what you do in the app, so it keeps working. Health data never leaves your account and is never sold. Account → Privacy lists every switch and what turning it off stops.',
    tags: ['data', 'privacy', 'health', 'collect', 'sell', 'gdpr'],
  },
  {
    id: 'faq-privacy-health',
    category: 'privacy',
    question: 'Who can see my health data?',
    answer:
      'Only you. Steps and workouts are read from your phone’s health service with your permission and are shown to nobody else; the leaderboard shows a rank and a first name, never the readings behind it. You can revoke the permission in your phone’s settings at any time — the app keeps working, it just stops paying step coins.',
    tags: ['health connect', 'healthkit', 'who can see', 'leaderboard', 'share'],
  },
  {
    id: 'faq-privacy-password',
    category: 'privacy',
    question: 'How do I keep my account safe?',
    answer:
      'Use a password you do not use anywhere else, keep the email and phone on the account current — they are how we reach you if something looks wrong — and sign out of devices you no longer use from Account → Security. We ask for a code before anything sensitive.',
    tags: ['password', 'safety', 'security', 'hacked', 'sessions', 'login'],
  },
];

const byId = (id: string): FaqInput => {
  const item = faqItems.find(f => f.id === id);
  if (!item) throw new Error(`mock FAQ ${id} is missing`);
  return item;
};

export const pickFaqs = (...ids: string[]) => ids.map(byId);

export const faqPage = {
  seo: {
    title: 'Help & FAQ',
    description:
      'Answers about earning and spending coins, step tracking, orders, your account and your privacy on VOKVE.',
  },
  hero: {
    eyebrow: 'Help centre',
    title: 'Questions, answered',
    subtitle:
      'The same answers our support team gives inside the app. Search, or browse by topic.',
  },
  categories: [
    { id: 'coins', title: 'Coins & rewards', icon: 'coins' },
    { id: 'tracking', title: 'Step tracking', icon: 'footprints' },
    { id: 'orders', title: 'Orders & shipping', icon: 'package' },
    { id: 'payments', title: 'Payments', icon: 'wallet' },
    { id: 'account', title: 'Your account', icon: 'key-round' },
    { id: 'privacy', title: 'Privacy & safety', icon: 'shield-check' },
    { id: 'other', title: 'Everything else', icon: 'life-buoy' },
  ],
  items: faqItems,
  contact: {
    title: 'Still stuck?',
    body: 'Open a ticket from Help & Support in the app, or write to us — a person will answer.',
    link: { label: 'Contact support', href: '/contact' },
  },
} satisfies z.input<typeof faqPageSchema>;
