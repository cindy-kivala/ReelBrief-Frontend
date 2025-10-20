/**CONFIRM IF WE KEEP THIS OR NOT */
import React, { useState } from 'react';
import { Menu, X, Play, CheckCircle, Users, Briefcase, Shield, Zap, ChevronRight, Star } from 'lucide-react';

export default function ReelBriefLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Play className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">ReelBrief</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-purple-400 transition">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-purple-400 transition">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-purple-400 transition">Pricing</a>
              <button className="px-4 py-2 text-purple-400 hover:text-purple-300 transition">Login</button>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition shadow-lg shadow-purple-500/50">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-purple-500/20">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-purple-400">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-purple-400">How It Works</a>
              <a href="#pricing" className="block text-gray-300 hover:text-purple-400">Pricing</a>
              <button className="w-full px-4 py-2 text-purple-400 border border-purple-400 rounded-lg">Login</button>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
            ✨ Trusted by 500+ Creative Agencies
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Creative Projects,<br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Delivered with Precision
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Match vetted freelancers to your projects in minutes. Track deliverables with version control. 
            Release payments only when you approve. All in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-2xl shadow-purple-500/50 flex items-center space-x-2">
              <span>Start Free Trial</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 text-white rounded-full text-lg font-semibold hover:bg-white/20 transition backdrop-blur-sm border border-white/20">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-400">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-gray-400">Avg. Match Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Vetted Freelancers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-400">{`From matching to payment, we've got you covered`}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Vetted Talent Pool",
                description: "Every freelancer is pre-screened with CV review and skill verification"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Matching",
                description: "AI-powered matching based on skills, availability, and project requirements"
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Version Control",
                description: "Track every deliverable version with side-by-side comparisons"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Escrow Protection",
                description: "Payments held securely until client approves final deliverables"
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: "Portfolio Automation",
                description: "Approved projects automatically added to freelancer portfolios"
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Structured Feedback",
                description: "Priority-based revision requests with clear expectations"
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-purple-900/30 to-slate-900/30 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition backdrop-blur-sm">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Process
            </h2>
            <p className="text-xl text-gray-400">From brief to delivery in 4 easy steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Submit Brief", desc: "Tell us your project requirements and deadline" },
              { step: "02", title: "Get Matched", desc: "We confirm freelancer availability within 24h" },
              { step: "03", title: "Track Progress", desc: "Review deliverables with version control" },
              { step: "04", title: "Approve & Pay", desc: "Payment released instantly upon approval" }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-purple-500/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl shadow-purple-500/50">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join 500+ agencies delivering projects faster and safer
          </p>
          <button className="px-8 py-4 bg-white text-purple-600 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-xl">
            Start Your Free Trial
          </button>
          <p className="text-purple-200 mt-4 text-sm">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Play className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold text-white">ReelBrief</span>
              </div>
              <p className="text-gray-400 text-sm">
                The modern platform for creative project management
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">Features</a></li>
                <li><a href="#" className="hover:text-purple-400">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">About</a></li>
                <li><a href="#" className="hover:text-purple-400">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-400">Terms</a></li>
                <li><a href="#" className="hover:text-purple-400">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-purple-500/20 text-center text-gray-400 text-sm">
            © 2025 ReelBrief. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}