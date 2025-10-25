import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { CheckCircle2, Briefcase, Users, Shield, Zap, TrendingUp, Star, Quote } from "lucide-react";

export function LandingPage({ onGetStarted, onLogin, onWatchDemo }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 cursor-pointer">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-gray-900 font-semibold">ReelBrief</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-900 transition-all duration-200 hover:-translate-y-0.5">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-900 transition-all duration-200 hover:-translate-y-0.5">How It Works</a>
              <a href="#reviews" className="text-gray-600 hover:text-blue-900 transition-all duration-200 hover:-translate-y-0.5">Reviews</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="transition-transform duration-200 hover:scale-105">
                <Button variant="ghost" onClick={onLogin} className="text-blue-900">
                  Sign In
                </Button>
              </div>
              <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                <Button onClick={onGetStarted} className="bg-blue-900 hover:bg-blue-800">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full mb-6 animate-pulse">
                <Zap className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500 font-medium">Trusted by 1000+ Creatives</span>
              </div>
              <h1 className="text-5xl lg:text-6xl mb-6 text-gray-900 font-semibold leading-tight">
                Connect Talent with Creative Projects
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The professional platform matching skilled freelancers with clients who need exceptional creative work. Secure payments, seamless collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                  <Button size="lg" onClick={onGetStarted} className="bg-blue-900 hover:bg-blue-800">
                    Start Free Trial
                  </Button>
                </div>
                <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                  <Button size="lg" onClick={onWatchDemo} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900/5">
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-8 mt-12">
                {[
                  { number: '1,200+', label: 'Active Freelancers' },
                  { number: '99.5%', label: 'Success Rate' },
                  { number: '4.9/5', label: 'Client Rating' }
                ].map((stat, index) => (
                  <div key={stat.label} className="text-center transition-transform duration-200 hover:scale-110">
                    <div className="text-3xl text-gray-900 font-semibold">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-900/20 to-red-500/20 rounded-2xl blur-2xl animate-pulse" />
              <div className="transition-transform duration-500 hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1666698809123-44e998e93f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHRlYW18ZW58MXx8fHwxNzYwODc0MzMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Creative Team Collaboration"
                  className="relative rounded-2xl shadow-2xl w-full transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900 font-semibold">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600">Professional tools for freelancers and clients</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Curated Talent Pool",
                description: "Access pre-vetted freelancers with proven track records in design, video, and creative work"
              },
              {
                icon: Shield,
                title: "Secure Escrow",
                description: "Protected payments held safely until project approval ensures trust for both parties"
              },
              {
                icon: TrendingUp,
                title: "Smart Matching",
                description: "AI-powered freelancer matching based on skills, availability, and project requirements"
              },
              {
                icon: Briefcase,
                title: "Project Management",
                description: "Built-in tools for deliverable uploads, version control, and structured feedback"
              },
              {
                icon: CheckCircle2,
                title: "Quality Assurance",
                description: "Structured review process with annotation tools and approval workflows"
              },
              {
                icon: Zap,
                title: "Fast Turnaround",
                description: "Streamlined processes get projects from brief to delivery faster than ever"
              }
            ].map((feature, index) => (
              <div key={index} className="transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-gray-300 h-full">
                  <div className="w-12 h-12 bg-blue-900/10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-200 hover:scale-110 hover:rotate-6">
                    <feature.icon className="w-6 h-6 text-blue-900" />
                  </div>
                  <h3 className="text-xl mb-2 text-gray-900 font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900 font-semibold">How It Works</h2>
            <p className="text-xl text-gray-600">Simple process, exceptional results</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Post Your Project",
                description: "Clients share project details, required skills, and budget. Freelancers upload portfolios and get verified."
              },
              {
                step: "2",
                title: "Get Matched",
                description: "Our admin team matches the perfect freelancer to your project based on skills, availability, and past performance."
              },
              {
                step: "3",
                title: "Collaborate & Deliver",
                description: "Work together with built-in tools. Review deliverables, provide feedback, and approve final work to release payment."
              }
            ].map((item, index) => (
              <div key={index} className="relative text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4 mx-auto transition-transform duration-200 hover:scale-110">
                  <span className="text-white text-xl font-semibold">{item.step}</span>
                </div>
                <h3 className="text-xl mb-3 text-gray-900 font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews / Testimonials Section */}
      <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900 font-semibold">Loved by Creatives & Clients</h2>
            <p className="text-xl text-gray-600">See what our community has to say</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Marketing Director at TechFlow",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                rating: 5,
                review: "ReelBrief transformed how we work with freelancers. The escrow system gives us peace of mind, and the quality of talent is consistently excellent."
              },
              {
                name: "Marcus Rodriguez",
                role: "Video Editor & Motion Designer",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                rating: 5,
                review: "As a freelancer, this platform has been a game-changer. Protected payments mean I can focus on creative work without worrying about getting paid."
              },
              {
                name: "Emily Parker",
                role: "Founder at Bloom Studios",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                rating: 5,
                review: "The matching system is incredibly smart. We got paired with the perfect designer for our rebrand, and the collaboration tools made feedback seamless."
              },
              {
                name: "David Kim",
                role: "Creative Director",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                rating: 5,
                review: "I've tried many platforms, but ReelBrief stands out. The admin team actually vets projects and matches thoughtfully. Quality over quantity."
              },
              {
                name: "Lisa Thompson",
                role: "Brand Manager at Innovate Co",
                avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
                rating: 5,
                review: "The version comparison tool alone is worth it. We can review iterations side-by-side and provide precise feedback. Our projects ship faster."
              },
              {
                name: "Alex Martinez",
                role: "Graphic Designer & Illustrator",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
                rating: 5,
                review: "Finally, a platform that respects creative professionals. Fair pricing, secure payments, and clients who actually value quality work."
              }
            ].map((testimonial, index) => (
              <div key={index} className="transition-all duration-300 hover:-translate-y-2">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-gray-300 relative h-full">
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-900/10" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden transition-transform duration-200 hover:scale-110">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-red-500 text-red-500 transition-transform duration-200 hover:scale-125" />
                    ))}
                  </div>
                  <p className="text-gray-600">{testimonial.review}</p>
                </Card>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900/5 rounded-full transition-all duration-300 hover:scale-105">
              <Star className="w-5 h-5 fill-red-500 text-red-500" />
              <span className="text-gray-900 font-semibold">4.9 out of 5</span>
              <span className="text-gray-600">from 500+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6 text-gray-900 font-semibold">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of freelancers and clients already creating amazing work together
          </p>
          <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
            <Button size="lg" onClick={onGetStarted} className="bg-blue-900 hover:bg-blue-800">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-300 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl text-gray-900 font-semibold">ReelBrief</span>
              </div>
              <p className="text-gray-600">Professional creative collaboration platform</p>
            </div>
            
            {['Product', 'Company', 'Support'].map((category) => (
              <div key={category}>
                <h4 className="mb-4 text-gray-900 font-semibold">{category}</h4>
                <div className="space-y-2 text-gray-600">
                  {category === 'Product' && ['Features', 'Pricing', 'Security'].map((item) => (
                    <div key={item} className="transition-all duration-200 hover:translate-x-1 hover:text-blue-900 cursor-pointer">
                      {item}
                    </div>
                  ))}
                  {category === 'Company' && ['About', 'Blog', 'Careers'].map((item) => (
                    <div key={item} className="transition-all duration-200 hover:translate-x-1 hover:text-blue-900 cursor-pointer">
                      {item}
                    </div>
                  ))}
                  {category === 'Support' && ['Help Center', 'Contact', 'Terms of Service'].map((item) => (
                    <div key={item} className="transition-all duration-200 hover:translate-x-1 hover:text-blue-900 cursor-pointer">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-600">
            © 2025 ReelBrief. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;