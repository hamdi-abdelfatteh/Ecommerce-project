import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, RefreshCw, Headphones } from 'lucide-react'

const features = [
  { icon: Zap,         title: 'Fast Delivery',    desc: 'Same-day dispatch on orders before 3pm' },
  { icon: Shield,      title: 'Buyer Protection', desc: '100% secure payments, always' },
  { icon: RefreshCw,   title: 'Easy Returns',     desc: 'Free 30-day returns, no questions' },
  { icon: Headphones,  title: '24/7 Support',     desc: 'Real humans, ready to help anytime' },
]

const categories = [
  { name: 'Electronics',  emoji: '💻', color: 'from-blue-500 to-cyan-400' },
  { name: 'Fashion',      emoji: '👗', color: 'from-rose-500 to-pink-400' },
  { name: 'Home & Living',emoji: '🏠', color: 'from-amber-500 to-yellow-400' },
  { name: 'Sports',       emoji: '⚽', color: 'from-green-500 to-emerald-400' },
]

export default function Home() {
  return (
    <div className="fade-up">
      {/* Hero */}
      <section className="relative bg-[#0f0e17] rounded-3xl overflow-hidden mb-14 min-h-[480px] flex items-center">
        {/* Glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] bg-violet-600 opacity-20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-60px] left-[20%] w-[300px] h-[300px] bg-fuchsia-500 opacity-15 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 px-12 py-16 max-w-xl">
          <span className="inline-block bg-violet-600/30 text-violet-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5 border border-violet-500/30">
            New Season Drop
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
            Shop What<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Moves You
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Thousands of products, unbeatable prices, delivered to your door.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/products"
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-7 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-900/50">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/register"
              className="text-gray-300 hover:text-white font-medium px-5 py-3.5 rounded-full border border-white/10 hover:border-white/30 transition-all">
              Join Free
            </Link>
          </div>
        </div>

        {/* Floating badge */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="bg-white/5 border border-white/10 backdrop-blur rounded-3xl p-6 text-center">
            <p className="text-4xl font-black text-white mb-1">Our goal is to reach 50K+</p>
            <p className="text-gray-400 text-sm">Happy Customers</p>
            <div className="mt-3 flex justify-center -space-x-2">
              {['🧑', '👩', '🧔', '👩‍🦱', '🧑‍🦰'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-violet-800 border-2 border-violet-900 flex items-center justify-center text-sm">{e}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/products" className="text-violet-600 text-sm font-medium hover:text-violet-700 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(({ name, emoji, color }) => (
            <Link key={name} to={`/products?search=${encodeURIComponent(name)}`}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100 transition-all">
              <div className={`h-28 bg-gradient-to-br ${color} flex items-center justify-center text-5xl group-hover:scale-110 transition-transform`}>
                {emoji}
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-violet-600 font-medium mt-0.5">Browse →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-violet-200 hover:shadow-md transition-all group">
            <div className="w-11 h-11 rounded-xl bg-violet-50 group-hover:bg-violet-100 flex items-center justify-center mb-4 transition-colors">
              <Icon size={20} className="text-violet-600" />
            </div>
            <p className="font-semibold mb-1">{title}</p>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl px-10 py-12 text-center text-white">
        <h2 className="text-3xl font-black mb-3">Ready to start shopping?</h2>
        <p className="text-violet-200 mb-7">Create a free account and get access to exclusive deals.</p>
        <Link to="/register"
          className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-3.5 rounded-full hover:bg-violet-50 transition-all hover:scale-105">
          Create Free Account <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
