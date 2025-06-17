import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Heart, Shield, Star, Users, Zap, Award, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-waffle-cream via-white to-waffle-syrup">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-6xl mb-6 animate-gentle-float">🧇</div>
          <h1 className="text-5xl md:text-7xl font-rounded font-bold text-waffle-ocean mb-6 leading-tight">
            Build trust,
            <br />
            <span className="text-waffle-teal">one review at a time</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect your wallet and create your decentralized reputation. Get reviewed by other
            wallets in the most adorable way possible.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <Link to="/explorer">
              <Button
                size="lg"
                className="bg-waffle-ocean hover:bg-waffle-teal text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">🔍</span>
                Explore Profiles
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button
                size="lg"
                variant="outline"
                className="border-waffle-ocean text-waffle-ocean hover:bg-waffle-ocean hover:text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">🏆</span>
                View Leaderboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { number: "10,000", label: "Early Access Spots", icon: "🎯" },
            { number: "5,247", label: "Active Wallets", icon: "👥" },
            { number: "23,891", label: "Reviews Given", icon: "⭐" },
            { number: "98.7%", label: "Trust Score", icon: "🛡️" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-rounded font-bold text-waffle-ocean mb-1">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-rounded font-bold text-waffle-ocean mb-6">
            Why Choose Waffle?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're reimagining trust in Web3 with cute design and serious security
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: <Heart className="w-8 h-8 text-waffle-coral" />,
              title: "Wallet-to-Wallet Reviews",
              description: "Get honest feedback from real people, backed by blockchain integrity",
            },
            {
              icon: <Shield className="w-8 h-8 text-waffle-ocean" />,
              title: "AI-Powered Moderation",
              description:
                "Smart filters keep reviews thoughtful and spam-free, like a fresh waffle",
            },
            {
              icon: <Star className="w-8 h-8 text-waffle-teal" />,
              title: "Trust Score Evolution",
              description: "Watch your reputation grow with beautiful syrup-filled meters",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-waffle-syrup/20 hover:shadow-lg transition-all duration-300 rounded-2xl h-full">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-rounded font-semibold text-waffle-ocean mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-16 bg-white/50 rounded-3xl mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-rounded font-bold text-waffle-ocean mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building trust has never been this sweet and simple
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: <Zap className="w-12 h-12 text-waffle-teal" />,
              title: "Connect Wallet",
              description: "Link your Web3 wallet and create your adorable profile in seconds",
            },
            {
              step: "02",
              icon: <Users className="w-12 h-12 text-waffle-coral" />,
              title: "Get Reviews",
              description: "Share your profile link and receive honest feedback from the community",
            },
            {
              step: "03",
              icon: <Award className="w-12 h-12 text-waffle-ocean" />,
              title: "Build Reputation",
              description: "Watch your trust score grow and earn beautiful waffle badges",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              <div className="mb-6">
                <div className="text-6xl font-rounded font-bold text-waffle-syrup/30 mb-4">
                  {step.step}
                </div>
                <div className="flex justify-center mb-4">{step.icon}</div>
              </div>
              <h3 className="text-xl font-rounded font-semibold text-waffle-ocean mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
              {index < 2 && (
                <ArrowRight className="hidden md:block absolute top-20 -right-4 w-6 h-6 text-waffle-syrup" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-rounded font-bold text-waffle-ocean mb-6">
            What People Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real feedback from our early waffle enthusiasts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote:
                "Waffle made building trust in DeFi so much easier. The UI is absolutely adorable and the reviews actually matter!",
              author: "0x742d...3D1C",
              role: "DeFi Trader",
              rating: "⭐⭐⭐⭐⭐",
            },
            {
              quote:
                "Finally, a reputation system that feels human. The waffle theme is genius - it makes serious stuff approachable.",
              author: "0x8f4E...5e7",
              role: "NFT Creator",
              rating: "⭐⭐⭐⭐⭐",
            },
            {
              quote:
                "The AI moderation is spot-on. No more spam reviews, just genuine feedback that helps me improve.",
              author: "0x1a2B...7g8",
              role: "Web3 Builder",
              rating: "⭐⭐⭐⭐⭐",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-waffle-syrup/20 hover:shadow-lg transition-all duration-300 rounded-2xl h-full">
                <div className="mb-4 text-2xl">{testimonial.rating}</div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="border-t border-waffle-syrup/20 pt-4">
                  <div className="font-rounded font-semibold text-waffle-ocean">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-rounded font-bold text-waffle-ocean mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about building trust with Waffle
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "How does Waffle ensure review authenticity?",
              answer:
                "Every review is tied to a wallet address with transaction history. Our AI moderation flags suspicious patterns, and blockchain immutability prevents tampering.",
            },
            {
              question: "What makes Waffle different from traditional review platforms?",
              answer:
                "We're decentralized, wallet-native, and designed for Web3. No central authority can delete reviews, and your reputation follows you across the entire ecosystem.",
            },
            {
              question: "How is the trust score calculated?",
              answer:
                "Trust scores consider review quality, reviewer credibility, transaction patterns, and time. It's like PageRank but for Web3 reputation!",
            },
            {
              question: "Can I get bad reviews removed?",
              answer:
                "Reviews are immutable once posted, but you can respond to them. This transparency is what makes the system trustworthy for everyone.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-waffle-syrup/20 rounded-2xl">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-waffle-teal flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-rounded font-semibold text-waffle-ocean mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-waffle-ocean to-waffle-teal rounded-3xl p-12 text-white"
        >
          <div className="text-5xl mb-6">🧇✨</div>
          <h2 className="text-3xl md:text-4xl font-rounded font-bold mb-6">
            Ready to Build Your Reputation?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join the sweetest community in Web3. Connect your wallet and start building trust today!
          </p>
          <Link to="/profile">
            <Button
              size="lg"
              className="bg-white text-waffle-ocean hover:bg-waffle-cream px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">🚀</span>
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-waffle-ocean text-white py-12 mt-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  🧇
                </div>
                <span className="text-xl font-rounded font-bold">Waffle</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Building trust in the decentralized world, one review at a time.
              </p>
            </div>

            <div>
              <h4 className="font-rounded font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-white/80">
                <Link to="/explorer" className="block hover:text-white transition-colors">
                  Explorer
                </Link>
                <Link to="/leaderboard" className="block hover:text-white transition-colors">
                  Leaderboard
                </Link>
                <Link to="/profile" className="block hover:text-white transition-colors">
                  Profile
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-rounded font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-white/80">
                <a href="#" className="block hover:text-white transition-colors">
                  Discord
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  GitHub
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-rounded font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-white/80">
                <a href="#" className="block hover:text-white transition-colors">
                  Documentation
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  API
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <div className="flex justify-center gap-6 text-sm text-white/60 mb-4">
              <span>Early Access: 10,000 wallets</span>
              <span>•</span>
              <span>Built for Web3</span>
              <span>•</span>
              <span>AI-Moderated</span>
            </div>
            <p className="text-white/60 text-sm">© 2024 Waffle. Made with 🧇 and lots of love.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
