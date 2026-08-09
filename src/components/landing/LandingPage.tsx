'use client'

import { useState } from 'react'
import { Mail, FileText, Clock, Shield, CheckCircle, ArrowRight, Menu, X, Target, Zap } from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Resume Analysis",
      description: "Extract key information from your resume to personalize every application automatically."
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "AI Cover Letters",
      description: "Generate tailored cover letters based on job descriptions in seconds."
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Outreach",
      description: "Send professional emails directly to recruiters with your SMTP configuration."
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Application Tracking",
      description: "Monitor every email sent and manage your job search pipeline efficiently."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Private",
      description: "Your data and SMTP credentials are encrypted with industry-standard security."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Fast Execution",
      description: "Complete applications from draft to send in under 30 seconds."
    }
  ]

  const steps = [
    {
      title: "Upload Resume",
      description: "Upload your resume PDF and let AI analyze your experience and skills."
    },
    {
      title: "Configure Email",
      description: "Connect your email using SMTP. Credentials are encrypted and secure."
    },
    {
      title: "Generate & Send",
      description: "Add a job description, generate the cover letter, and send instantly."
    }
  ]

  const pricing = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      features: [
        "10 AI cover letters/month",
        "Email sending",
        "Application history",
        "Resume analysis"
      ],
      cta: "Start Free"
    },
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      features: [
        "Unlimited AI cover letters",
        "Priority email delivery",
        "Advanced analytics",
        "Priority support"
      ],
      cta: "Start Pro",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Dedicated support"
      ],
      cta: "Contact Sales"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-black">
                ReachOutAI
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-gray-700 hover:text-black transition text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-black transition text-sm font-medium">How it Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-black transition text-sm font-medium">Pricing</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a href="/login" className="text-gray-700 hover:text-black transition text-sm font-medium">
                Sign In
              </a>
              <a
                href="/register"
                className="bg-black text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-black"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-6 pb-6 space-y-4 border-t border-gray-200 mt-5">
              <a href="#features" className="block text-gray-700 hover:text-black text-sm font-medium">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-black text-sm font-medium">How it Works</a>
              <a href="#pricing" className="block text-gray-700 hover:text-black text-sm font-medium">Pricing</a>
              <div className="pt-4 space-y-3">
                <a href="/login" className="block text-center py-2.5 border border-gray-300 text-sm font-medium hover:border-black transition">
                  Sign In
                </a>
                <a href="/register" className="block text-center py-2.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition">
                  Get Started
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight tracking-tight">
              Automate Your Job
              <br />
              Applications
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              AI-powered cover letters, direct email outreach, and application tracking in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-black text-white px-8 py-4 text-base font-medium hover:bg-gray-800 transition inline-flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="bg-white border border-gray-300 text-black px-8 py-4 text-base font-medium hover:border-black transition"
              >
                See How It Works
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-8">
              No credit card required · 10 free applications · Cancel anytime
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-black"></div>
                <div className="w-3 h-3 bg-gray-400"></div>
                <div className="w-3 h-3 bg-gray-400"></div>
              </div>
              <div className="bg-gray-50 h-80 flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-black mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-900 font-medium text-lg">Application Dashboard</p>
                  <p className="text-sm text-gray-500 mt-1">Track and manage all your applications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
              Built for Job Seekers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your application process and land interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 bg-black flex items-center justify-center text-white mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
              Three Steps to Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Set up your account and start sending applications in minutes.
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-xl font-bold">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-2xl font-semibold text-black mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href="/register"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-base font-medium hover:bg-gray-800 transition"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
              Simple Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white border-2 p-8 transition hover:border-black ${
                  plan.highlighted
                    ? 'border-black'
                    : 'border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-black text-white text-xs font-semibold px-3 py-1 inline-block mb-4">
                    RECOMMENDED
                  </div>
                )}
                <h3 className="text-xl font-semibold text-black mb-2">{plan.name}</h3>
                <div className="mb-8 mt-4">
                  <span className="text-4xl font-bold text-black">{plan.price}</span>
                  <span className="text-gray-600 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/register"
                  className={`block text-center py-3 font-medium transition text-sm ${
                    plan.highlighted
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Start Applying Smarter Today
          </h2>
          <p className="text-lg mb-10 text-gray-300">
            Join professionals using AI to land more interviews and advance their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-black px-8 py-4 text-base font-medium hover:bg-gray-100 transition"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-black">ReachOutAI</span>
              </div>
              <p className="text-sm text-gray-600">
                AI-powered job application platform for modern professionals.
              </p>
            </div>
            <div>
              <h4 className="text-black font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="text-gray-600 hover:text-black transition">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-black transition">Pricing</a></li>
                <li><a href="#how-it-works" className="text-gray-600 hover:text-black transition">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-black font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-black transition">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-black font-semibold mb-4 text-sm">Connect</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-black transition">Twitter</a></li>
                <li><a href="https://www.linkedin.com/in/sanket-adsare-573659257/" className="text-gray-600 hover:text-black transition">LinkedIn</a></li>
                <li><a href="" className="text-gray-600 hover:text-black transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">© 2025 ReachOutAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}