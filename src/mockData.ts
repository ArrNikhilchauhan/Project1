import { Service, Market, Assistant } from './types';

export const servicesData: Service[] = [
  {
    id: 'standard-carry',
    name: 'Shopping Assistant',
    description: 'Enjoy a stress-free shopping experience with a trained Diblo Assistant. We carry your bags, assist with queues, find shops, and navigate markets for you.',
    pricePerHour: 299,
    image: '/assets/shopping_assistance.jpeg',
    badgeText: 'Most Popular',
    icon: 'shopping_bag',
    features: [
      'Carrying Shopping Bags',
      'Queue Assistance',
      'Finding Shops & Market Navigation',
      'Umbrella & Water Assistance'
    ],
    unit: 'hour'
  },
  {
    id: 'pram-carry-plus',
    name: 'Senior Citizen Assistant',
    description: 'Trusted support for senior citizens during shopping, hospital visits and daily tasks. Compassionate, reliable, and trained for elder care.',
    pricePerHour: 349,
    image: '/assets/senior_care.jpeg',
    badgeText: 'Elder Care',
    icon: 'child_friendly',
    features: [
      'Shopping & Walking Assistance',
      'Hospital & Pharmacy Visits',
      'Bill Payments & Bank Visits',
      'Companionship During Outings'
    ],
    unit: 'hour'
  },
  {
    id: 'shopping-support',
    name: 'Personal Task Assistant',
    description: 'Helping you complete important tasks when you are busy. Queue standing, courier pickup, document submission, government office visits and more.',
    pricePerHour: 299,
    image: '/assets/personal_errand.jpeg',
    badgeText: 'Task Pro',
    icon: 'support_agent',
    features: [
      'Queue Standing',
      'Courier Pickup/Drop',
      'Document Submission',
      'Government Office Visits & Bill Payments'
    ],
    unit: 'task'
  }
];

export const marketsData: Market[] = [
  {
    id: 'dadar-market',
    name: 'Dadar Market',
    description: 'One of Mumbai\'s busiest markets. Known for fresh produce, flowers, clothing, and household essentials. Great footfall throughout the day.',
    statusText: 'Premium Slots Available',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0Ool2mQM_h9i6fxUDGCiZihq57UbGBn4lQMCS01z_Y3Zp-lrCt4aVWkY3PHPTxtI-xdTaptlrTqCzj5n9eqPzW5v9pIL0wye-o3yHamtj05713F8OQb6iYX8rETnKIthhBBSV5kchFXFngFv7I9z0W8Y-aNbHCSn62nYADRVZFOm2HPmIt4ROe9V2WhhPQ7_dFHSRZEIth2xItUCKuOakg6t6tKi8dt2puIm_vqu5ognGgiHOnrEt22VycA70cHe66hvzIxVGab-v',
    coordinates: { x: 42, y: 58 }
  },
  {
    id: 'crawford-market',
    name: 'Crawford Market',
    description: 'Historic wholesale market in South Mumbai. Famous for spices, dry fruits, fresh produce, and a wide variety of goods at wholesale prices.',
    statusText: 'High-Traffic Zone',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbzfX6JJ9mkJ8m_a-4XEMBnmLllZfn1X7iPn3fBGZlNOxHgmFFqvsARBKQr1_WUeXuPOKiqw2IpKhkrJni2nFn2-HaQ2zG67Wqd4cbsfSAm3tbG0N1DbfsB_vXMltqcmPvh1g3v5WVprocMNeSmYsvqW8NulZDhuKdZT4-zz-0e4amd5n1w86vJY4eqwy4r_DLRymki6z-GB2d_rh-bvP7aSDdXXabgAyOudzxMIrVWeIIraNH3gOknLkU5otnu0bdlxk3J7z66-N8',
    coordinates: { x: 28, y: 45 }
  },
  {
    id: 'linking-road',
    name: 'Linking Road, Bandra',
    description: 'Mumbai\'s prime shopping street in Bandra West. Famous for trendy clothes, footwear, accessories, and street-side fashion at great prices.',
    statusText: 'Active & Buzzing',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_jR537xzgYswhZYwHsR3KOmuqr2k3ipXy_OP7nUjOYHcXRhJrxiYyNtPugolBStK3zOtv2z0uiCdHbERIhmEkUGQm7AABv2f0hyBBQfmIp8ossKcUG0yJQhbWaziCceNlOkPgWaovXxTHtRP-oRsoTVwZqf_IcMGgwYjj1zLrY43_Nx9SKRWcEJkmxc4F_BEfcYMvBlIxNClRX_yulDrkw60C0SS8P-UBcdeELFlkHdRWriAc21ITslQNfBtLrCibOBgu2hufSuZ0',
    coordinates: { x: 65, y: 32 }
  }
];

export const assistantsPool: Assistant[] = [
  {
    name: 'Rohan Sharma',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFlGqg1DtZHWNDPJaWSqDnpf52WfyE120dfszrQRzk_GfI8SPruSN-KPs3Xc6g8_2Tg784ESQ4a5uBO93OWFHQhMan6Q7aSyJICYo9MwvjRYnN1lp8pn58nVElsIiDUo3x7QQfmSIIpXfkfb5c8QmWYKyTAbpj8xpIGgrdMuABSS1HUIUeOzV51pLf6U-7pvgMh_McAAsPoZtvtzpkTuo-3U6SiPLatRj5X0LXRQjkGUxU6DC_ct53grD_LxgCQy9B0ZvVI-UkO6pi',
    rating: 4.9,
    tripsCount: 1240,
    phone: '+91 82919-19829',
    status: 'Ready at market',
    quote: 'Our goal is to turn every shopping trip into a delightful stroll.'
  },
  {
    name: 'Sunil Kumar',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOe45TfI6U0NbM-77b1u7NA4THelvDMc24S5ExPTHjCOq0PEC-wXZfQ3SQE0e1gceVR0uR8ctgqyFIJNdoRgIyL_jyCkuLGhcr7LP9oMvVXp1I5csTJNYclr2Th85vmElrhav16NExbl7CVTgv5EC0XL3ZltSMrspU1WeAj-GPMHqVnq6hQ2ibq7myEEZ6m7z-nc0POUKKhhQsknMInYky2kCGCJn36rtMNFnFcDSBg6w8dvur5-gEJHiLKymizirQCendkdvB7iB',
    rating: 4.85,
    tripsCount: 890,
    phone: '+91 82919-19829',
    status: 'Verified Carry Expert',
    quote: 'I take pride in handling your bags carefully while you explore Mumbai\'s vibrant markets.'
  }
];

export const faqsData = [
  {
    question: 'What happens after I book?',
    answer: 'Once submitted, our system instantly coordinates with our on-field captains in Mumbai. You will be matched with a verified, uniform-clad Diblo assistant who will rendezvous at your selected market entrance within 10-15 minutes, or exactly at your scheduled time.'
  },
  {
    question: 'Can I book for my parents?',
    answer: 'Absolutely! Our Senior Citizen Assistant service is specifically designed for parents and elders. You can book on their behalf and our trained assistant will provide respectful, compassionate companionship and assistance.'
  },
  {
    question: 'Are the assistants police verified?',
    answer: 'Yes! Every Diblo assistant is thoroughly Police Verified, Aadhaar Verified, and Background Checked before induction. They are also trained professionals in uniform so you can identify them easily.'
  },
  {
    question: 'Are my bags insured and secure?',
    answer: 'Yes! Every Diblo carry includes an insured security bag with serial seals, backed by live GPS location tracking. Your bags are fully insured up to ₹15,000 for ultimate peace of mind.'
  },
  {
    question: 'Can I change my date or location?',
    answer: 'Yes, absolutely. You can easily reschedule or cancel your active booking free of charge up to 2 hours before the scheduled session directly through your active booking hub or by contacting us on WhatsApp.'
  }
];
