import type { z } from 'zod';
import type { homePageSchema } from '@/lib/content/schemas';
import { pickFaqs } from './faqs';

/**
 * MOCK — stands in for `GET /site/pages/home`. The challenge list mirrors
 * the backend seed (CHALLENGES); every figure in the stats strip is a ⚙
 * config value today (coin share, grace days), so the backend should fill
 * them from config rather than from words typed into the panel.
 */
export const homePage = {
  seo: {
    title: 'VOKVE — Walk. Earn. Redeem.',
    description:
      'The fitness app that pays you back for walking. Verified steps, streaks, challenges and a rewards shop where your coins take money off real products.',
  },
  hero: {
    eyebrow: 'Every step verified',
    title: 'Your steps are worth more than you think.',
    highlight: 'worth more',
    subtitle:
      'VOKVE counts the walking you already do, checks that it is real, and pays you coins for it — coins you spend on real products in the VOKVE shop.',
    primaryCta: { label: 'Get the app', href: '/#download' },
    secondaryCta: { label: 'See how it works', href: '/#how-it-works' },
    trust: ['Free to download', 'Health data never sold', 'Health Connect & Apple Health'],
    scene: {
      dayLabel: 'Today',
      verifiedLabel: 'Verified',
      steps: 8432,
      goal: 10000,
      stepsLabel: 'steps',
      goalLabel: 'of {goal}',
      metrics: [
        { icon: 'route', value: '6.2 km', label: 'Distance' },
        { icon: 'timer', value: '58 min', label: 'Active' },
        { icon: 'flame', value: '342', label: 'kcal' },
      ],
      streak: { value: '12', label: 'day streak' },
      challenge: { title: '10K Steps Challenge', progress: 0.84, reward: '+200 coins' },
      rank: { value: '#3', label: 'this week' },
      coin: { value: '+7.98', label: 'coins today' },
    },
  },
  stats: [
    { value: '₹0', label: 'to download and use' },
    { value: '9', label: 'live challenges with rewards' },
    { value: '30%', label: 'of a shop order payable in coins' },
    { value: '14 days', label: 'to undo an account deletion' },
  ],
  howItWorks: {
    eyebrow: 'How it works',
    title: 'Four steps. One of them is walking.',
    subtitle: 'No wearable, no subscription. Your phone does the counting and we do the checking.',
    steps: [
      {
        icon: 'footprints',
        title: 'Walk like you already do',
        body: 'Keep your phone with you. VOKVE counts steps through Health Connect on Android and Apple Health on iPhone.',
      },
      {
        icon: 'shield-check',
        title: 'We check the day is real',
        body: 'Each day is compared with how genuine walking looks. Step coins wait as pending while we check.',
      },
      {
        icon: 'coins',
        title: 'Coins land in your wallet',
        body: 'Steps, workouts, streaks, challenges and invites all pay — up to a daily ceiling that keeps it fair.',
      },
      {
        icon: 'shopping-bag',
        title: 'Spend them on real things',
        body: 'Coins take up to 30% off products in the VOKVE shop. The split is shown before you pay.',
      },
    ],
  },
  features: {
    eyebrow: 'Everything in one place',
    title: 'Built around the walk, ready for the rest.',
    subtitle:
      'Steps are the heart of VOKVE. Around them: the habits that keep you moving, and the rewards that make it worth it.',
    items: [
      {
        icon: 'footprints',
        title: 'Verified step tracking',
        body: 'Counts in the background and syncs when you open the app. Your phone is enough — no band or watch needed.',
        tone: 'brand',
        span: 'wide',
      },
      {
        icon: 'trophy',
        title: 'Challenges',
        body: 'Daily, weekly and monthly goals — from 10,000 steps in a day to a month-long marathon — each with its own reward.',
        tone: 'gold',
        span: 'wide',
      },
      {
        icon: 'flame',
        title: 'Streaks & freezes',
        body: 'Hit your goal day after day for milestone bonuses. Missed one? A freeze can save the run.',
        tone: 'orange',
        span: 'regular',
      },
      {
        icon: 'medal',
        title: 'Weekly leaderboard',
        body: 'See where you rank each week. The board shows a rank and a first name — never your readings.',
        tone: 'violet',
        span: 'regular',
      },
      {
        icon: 'shopping-bag',
        title: 'Rewards shop',
        body: 'Real products, with coins covering part of the bill and card or UPI for the rest.',
        tone: 'pink',
        span: 'regular',
      },
      {
        icon: 'droplets',
        title: 'Hydration',
        body: 'Log water in a tap and get reminders at the hours you choose, with quiet hours respected.',
        tone: 'cyan',
        span: 'regular',
      },
      {
        icon: 'salad',
        title: 'Nutrition & diet plans',
        body: 'Log meals from the food library and follow plans built around your goal.',
        tone: 'green',
        span: 'regular',
      },
      {
        icon: 'heart-pulse',
        title: 'Vitals log',
        body: 'Note down your heart rate and blood pressure readings and watch the trend over time.',
        tone: 'brand',
        span: 'regular',
      },
      {
        icon: 'dumbbell',
        title: 'Guided workouts',
        body: 'Follow a workout set by set. Finished sessions pay coins and keep your streak alive.',
        tone: 'blue',
        span: 'wide',
      },
      {
        icon: 'gift',
        title: 'Refer & earn',
        body: 'Invite a friend with your code — you both get coins once they join and get moving.',
        tone: 'gold',
        span: 'wide',
      },
    ],
  },
  challenges: {
    eyebrow: 'Challenges',
    title: 'Something to aim for, every day of the month.',
    subtitle: 'Join as many as you like. Overlapping challenges each pay when you finish them.',
    items: [
      {
        id: 'ch-10k-steps',
        emoji: '👟',
        title: '10K Steps Challenge',
        description: 'Walk 10,000 steps in a day',
        cadence: 'Daily',
        rewardLabel: '200 coins',
        badgeLabel: 'Badge',
      },
      {
        id: 'ch-burn-500',
        emoji: '🔥',
        title: 'Burn 500 Calories',
        description: 'Burn 500 calories in a day',
        cadence: 'Daily',
        rewardLabel: '150 coins',
        badgeLabel: 'Badge',
      },
      {
        id: 'ch-30-min-active',
        emoji: '⏱️',
        title: '30 Min Active Time',
        description: 'Be active for 30 minutes',
        cadence: 'Daily',
        rewardLabel: '100 coins',
        badgeLabel: 'Badge',
      },
      {
        id: 'ch-week-step-master',
        emoji: '🚶',
        title: 'Weekly Step Master',
        description: 'Walk 70,000 steps this week',
        cadence: 'Weekly',
        rewardLabel: '800 coins',
        badgeLabel: 'Badge',
      },
      {
        id: 'ch-7-day-consistency',
        emoji: '⭐',
        title: '7 Days Consistency',
        description: 'Hit your daily goal for 7 days',
        cadence: 'Weekly',
        rewardLabel: '500 coins',
        badgeLabel: 'Badge',
      },
      {
        id: 'ch-monthly-marathon',
        emoji: '🏅',
        title: 'Monthly Marathon',
        description: 'Cover 300,000 steps in a month',
        cadence: 'Monthly',
        rewardLabel: '1,500 coins',
        badgeLabel: 'Badge',
      },
    ],
    note: 'Challenge rewards are paid within the daily coin ceiling explained in our [Coins & Fair Play policy](/rewards-policy).',
  },
  fairPlay: {
    eyebrow: 'Fair play',
    title: 'Coins mean something because cheating doesn’t pay.',
    subtitle:
      'A reward is only worth having if everyone earned theirs the same way. So every day passes four layers before it pays.',
    layers: [
      {
        icon: 'smartphone',
        title: 'Counted on your phone',
        body: 'Steps come from your phone’s own step sensor and health service — never from a number anyone types in.',
      },
      {
        icon: 'activity',
        title: 'Checked against real walking',
        body: 'Each day is compared with how genuine walking looks before it pays a single coin.',
      },
      {
        icon: 'hourglass',
        title: 'Held, then released',
        body: 'Step coins wait as pending for a short window and land in your wallet once the day checks out.',
      },
      {
        icon: 'scale',
        title: 'Capped for everyone',
        body: 'A daily ceiling across every way to earn means no single day — and no single trick — pays forever.',
      },
    ],
    note: 'Shaken phones, apps that invent steps and shared devices are spotted and don’t pay. The full rules are in our [Coins & Fair Play policy](/rewards-policy).',
  },
  privacy: {
    eyebrow: 'Your data, your call',
    title: 'Health data is personal. We treat it that way.',
    subtitle: null,
    points: [
      {
        icon: 'lock',
        tone: 'green',
        title: 'Never sold',
        body: 'Your steps and workouts are used to pay you and show you your progress. That is all.',
        link: { label: 'Privacy Policy', href: '/privacy' },
      },
      {
        icon: 'sliders-horizontal',
        tone: 'violet',
        title: 'Switches that really switch',
        body: 'Turn off usage analytics or personalised offers and the server stops — not just the screen.',
        link: { label: 'Your choices', href: '/privacy#your-choices' },
      },
      {
        icon: 'download',
        tone: 'blue',
        title: 'Take a copy any day',
        body: 'Download everything we hold about you as a single file, once every 24 hours.',
        link: { label: 'How to export', href: '/delete-account#export' },
      },
      {
        icon: 'trash-2',
        tone: 'brand',
        title: 'Delete with a 14-day undo',
        body: 'Ask from the app and it is scheduled two weeks out, so a slip of the thumb costs nothing.',
        link: { label: 'Delete your account', href: '/delete-account' },
      },
    ],
  },
  faq: {
    eyebrow: 'Good questions',
    title: 'Before you ask.',
    subtitle: null,
    items: pickFaqs('faq-coins-earn', 'faq-tracking-steps', 'faq-orders-pay', 'faq-account-delete'),
    cta: { label: 'All questions', href: '/faq' },
  },
  download: {
    eyebrow: 'Get started',
    title: 'Start earning on your next walk.',
    subtitle:
      'Download VOKVE, allow step tracking, and the steps you take from today begin to count.',
    note: 'Free to download. Coins have no cash value and can only be spent in the VOKVE shop.',
  },
} satisfies z.input<typeof homePageSchema>;
