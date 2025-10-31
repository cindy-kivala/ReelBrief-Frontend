import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Simple & Clean */}
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <div className="text-2xl font-bold text-blue-700">ReelBrief</div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-blue-700">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-blue-700">How It Works</a>
          <a href="#reviews" className="text-gray-600 hover:text-blue-700">Reviews</a>
          <Link to="/login" className="text-blue-700 px-4 py-2 hover:text-blue-600">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section - Minimal & Clear */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-red-500">🔥</span>
              <span className="text-red-500 text-sm font-medium">Trusted by 1000+ Creatives</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Connect Talent with Creative Projects
            </h1>
            
            <p className="text-gray-600 text-lg mb-8">
              The professional platform matching skilled freelancers with clients who need exceptional creative work.
            </p>

            <div className="flex gap-4 mb-12">
              <Link 
                to="/register" 
                className="bg-blue-700 text-white px-6 py-3 rounded hover:bg-blue-600"
              >
                Start Free Trial
              </Link>
              <button className="border border-blue-700 text-blue-700 px-6 py-3 rounded hover:bg-blue-50">
                Watch Demo
              </button>
            </div>

            <div className="flex gap-8 text-gray-700">
              <div>
                <p className="text-2xl font-bold">1,200+</p>
                <p className="text-sm">Active Freelancers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">99.5%</p>
                <p className="text-sm">Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold">4.9/5</p>
                <p className="text-sm">Client Rating</p>
              </div>
            </div>
          </div>

          {/* Working Hero Image */}
          <div className="bg-gray-100 rounded-lg h-80 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Creative team collaboration" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback placeholder */}
            <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <div className="text-center text-white">
                <p className="text-2xl font-bold mb-2">Creative Workspace</p>
                <p className="text-blue-100">Team Collaboration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Simple Grid */}
      <section id="features" className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Everything You Need to Succeed</h2>
          <p className="text-gray-600 text-center mb-12">Professional tools for freelancers and clients</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Curated Talent Pool", desc: "Access pre-vetted freelancers with proven track records" },
              { title: "Secure Escrow", desc: "Protected payments held safely until project approval" },
              { title: "Smart Matching", desc: "AI-powered freelancer matching based on skills" },
              { title: "Project Management", desc: "Built-in tools for deliverables and feedback" },
              { title: "Quality Assurance", desc: "Structured review process with approval workflows" },
              { title: "Fast Turnaround", desc: "Streamlined processes from brief to delivery" }
            ].map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md">
                <div className="w-10 h-10 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-blue-700">✓</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Simple Steps */}
      <section id="how-it-works" className="px-8 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-12">Simple process, exceptional results</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Post Your Project", desc: "Share project details and budget" },
              { step: "2", title: "Get Matched", desc: "Find the perfect freelancer for your needs" },
              { step: "3", title: "Collaborate & Deliver", desc: "Work together and approve final work" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews - Simple Testimonials */}
      <section id="reviews" className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Loved by Creatives & Clients</h2>
          <p className="text-gray-600 text-center mb-12">See what our community has to say</p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Sarah Chen", role: "Marketing Director", review: "ReelBrief transformed how we work with freelancers. The quality of talent is consistently excellent." },
              { name: "Marcus Rodriguez", role: "Video Editor", review: "As a freelancer, this platform has been a game-changer. Protected payments mean I can focus on creative work." },
              { name: "Emily Parker", role: "Studio Founder", review: "The matching system is incredibly smart. We got paired with the perfect designer for our rebrand." },
              { name: "David Kim", role: "Creative Director", review: "I've tried many platforms, but ReelBrief stands out. Quality over quantity - that's what makes this special." }
            ].map((testimonial, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-2">★★★★★</div>
                <p className="text-gray-600">{testimonial.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Simple & Clear */}
      <section className="px-8 py-20 bg-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join hundreds of freelancers and clients already creating amazing work together
          </p>
          <Link 
            to="/register" 
            className="bg-white text-blue-700 px-8 py-3 rounded font-bold hover:bg-gray-100 inline-block"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="px-8 py-12 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4">ReelBrief</div>
          <p className="text-gray-400 mb-8">Professional creative collaboration platform</p>
          <div className="text-gray-400">
            © 2025 ReelBrief. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}