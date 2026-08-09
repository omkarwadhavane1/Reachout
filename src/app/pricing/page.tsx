'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    tier: 'FREE',
    description: 'Perfect for trying out',
    icon: Sparkles,
    features: [
      '5 cover letters per month',
      'Role-based generation',
      'Basic templates',
      '30-day history',
      'Email support',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    tier: 'PRO',
    description: 'Best for job seekers',
    icon: Zap,
    features: [
      '50 cover letters per month',
      'Role + JD-based generation',
      'Premium templates',
      'Full history',
      'Priority support',
      'Custom branding',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Unlimited',
    price: '$29.99',
    period: 'per month',
    tier: 'UNLIMITED',
    description: 'For power users',
    icon: Crown,
    features: [
      'Unlimited cover letters',
      'All Pro features',
      'AI resume optimization',
      'Bulk generation',
      'API access',
      'Advanced analytics',
      'White-label options',
    ],
    cta: 'Go Unlimited',
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    if (status !== 'authenticated') {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (tier === 'FREE') {
      return; // Already on free plan
    }

    setLoading(tier);

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
      <AppLayout>
    <div className="min-h-screen  py-16 px-4">
     

      {/* coomming soon
       */}
       <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Pricing Coming Soon</h2>
        <p className="text-slate-400">
          We are working hard to bring you flexible pricing plans. Stay tuned!
        </p>
      </div>
    </div>
    </AppLayout>
  );
}


//  {/* Header
//       <div className="max-w-6xl mx-auto text-center mb-16">
//         <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
//           Choose Your Plan
//         </h1>
//         <p className="text-slate-400 text-xl">
//           Unlock the full power of AI-generated cover letters
//         </p>
//       </div>

//       {/* Pricing Cards */}
//       <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
//         {plans.map((plan) => {
//           const Icon = plan.icon;
//           return (
//             <div
//               key={plan.tier}
//               className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:scale-105 ${
//                 plan.popular
//                   ? 'border-blue-500 shadow-2xl shadow-blue-500/20'
//                   : 'border-slate-700/50'
//               }`}
//             >
//               {/* Popular Badge */}
//               {plan.popular && (
//                 <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
//                   MOST POPULAR
//                 </div>
//               )}

//               <div className="p-8">
//                 {/* Icon */}
//                 <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
//                   <Icon className="w-7 h-7 text-white" />
//                 </div>

//                 {/* Plan Name */}
//                 <h3 className="text-2xl font-bold text-white mb-2">
//                   {plan.name}
//                 </h3>
//                 <p className="text-slate-400 mb-6">{plan.description}</p>

//                 {/* Price */}
//                 <div className="mb-6">
//                   <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                     {plan.price}
//                   </span>
//                   <span className="text-slate-400 ml-2">/{plan.period}</span>
//                 </div>

//                 {/* CTA Button */}
//                 <button
//                   onClick={() => handleSubscribe(plan.tier)}
//                   disabled={loading === plan.tier || (plan.tier === 'FREE' && status === 'authenticated')}
//                   className={`w-full py-3 rounded-xl font-semibold transition-all mb-6 ${
//                     plan.popular
//                       ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
//                       : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                   } disabled:opacity-50 disabled:cursor-not-allowed`}
//                 >
//                   {loading === plan.tier ? 'Processing...' : plan.cta}
//                 </button>

//                 {/* Features */}
//                 <ul className="space-y-3">
//                   {plan.features.map((feature, idx) => (
//                     <li key={idx} className="flex items-start gap-3">
//                       <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
//                       <span className="text-slate-300">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* FAQ or Additional Info */}
//       <div className="max-w-4xl mx-auto mt-20 text-center">
//         <p className="text-slate-400 mb-4">
//           All plans include secure email integration and data privacy
//         </p>
//         <p className="text-slate-500 text-sm">
//           Cancel anytime. No hidden fees. Pro-rated refunds available.
//         </p>
//       </div> */
//       }