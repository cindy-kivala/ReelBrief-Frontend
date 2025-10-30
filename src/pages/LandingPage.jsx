import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="navbar flex justify-between items-center px-8 py-4 border-b">
        <div className="text-2xl font-bold text-blue-700">ReelBrief</div>
        <div className="flex items-center gap-6">
          <a href="#features" className="nav-link text-gray-600">Features</a>
          <a href="#how-it-works" className="nav-link text-gray-600">How It Works</a>
          <a href="#reviews" className="nav-link text-gray-600">Reviews</a>
          <Link to="/login" className="btn-secondary">Sign In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero flex flex-col md:flex-row items-center justify-between px-10 py-16">
        <div className="max-w-lg">
          <p className="text-sm text-red-400 font-medium mb-3">🔥 Trusted by 1000+ Creatives</p>
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Connect Talent with <br /> Creative Projects
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The professional platform matching skilled freelancers with clients who need exceptional creative work.
            Secure payments, seamless collaboration.
          </p>

          <div className="flex gap-4">
            <button className="btn-primary">Start Free Trial</button>
            <button className="btn-outline">Watch Demo</button>
          </div>

          <div className="mt-8 text-gray-600 flex gap-8">
            <div>
              <p className="font-semibold">1,200+</p>
              <p className="text-sm">Active Freelancers</p>
            </div>
            <div>
              <p className="font-semibold">99.5%</p>
              <p className="text-sm">Success Rate</p>
            </div>
            <div>
              <p className="font-semibold">4.9/5</p>
              <p className="text-sm">Client Rating</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="hero-image mt-10 md:mt-0 md:w-1/2">
          <img
            src="/images/creative-office.jpg"
            alt="Creative workspace"
            className="rounded-lg shadow-md w-full h-auto object-cover"
          />
        </div>
      </section>
    </div>
  );
}

