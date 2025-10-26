import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { Briefcase, Users, Shield, CheckCircle2 } from "lucide-react";

export function LandingPage({ onGetStarted, onLogin, onWatchDemo }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">ReelBrief</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={onLogin}
                className="text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Button>
              <Button 
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Connect Talent with Creative Projects
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            The professional platform matching skilled freelancers with clients who need exceptional creative work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              onClick={onWatchDemo}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ReelBrief?</h2>
            <p className="text-gray-600">Simple, secure, and effective</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Curated Talent",
                description: "Access pre-vetted freelancers with proven track records"
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Protected escrow system ensures safe transactions"
              },
              {
                icon: CheckCircle2,
                title: "Quality Work",
                description: "Structured review process with approval workflows"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                step: "1",
                title: "Post Project",
                description: "Share your project details and requirements"
              },
              {
                step: "2",
                title: "Get Matched",
                description: "We find the perfect freelancer for your needs"
              },
              {
                step: "3",
                title: "Collaborate",
                description: "Work together and release payment upon approval"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-semibold">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join our community of freelancers and clients creating amazing work together
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">ReelBrief</span>
          </div>
          <p className="text-gray-600 text-sm">© 2025 ReelBrief. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;