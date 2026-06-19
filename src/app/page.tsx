import Link from "next/link";
import { Leaf, UtensilsCrossed, TrendingUp, MessageSquare, ShoppingBag, CheckCircle } from "lucide-react";

const features = [
  { icon: UtensilsCrossed, title: "AI Meal Planning", desc: "Get personalized 7-day meal plans based on your goals, allergies, and preferences." },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Monitor your weight, calories, and water intake with beautiful charts." },
  { icon: MessageSquare, title: "AI Nutrition Assistant", desc: "Chat with your personal AI nutritionist anytime, anywhere." },
  { icon: ShoppingBag, title: "Nutrition Shop", desc: "Browse AI-recommended supplements and fitness products." },
];

const benefits = [
  "Personalized calorie and macro calculation",
  "Weekly meal plans with recipes",
  "Automatic shopping list generation",
  "PDF export for your meal plans",
  "Dropshipping nutrition products",
  "Progress analytics and insights",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">NutriAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <Leaf className="w-4 h-4" />
          Powered by Claude AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          Your Personal AI{" "}
          <span className="text-green-500">Nutrition</span>{" "}
          Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Get AI-powered meal plans, track your progress, chat with a nutrition assistant, and shop for recommended supplements — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-colors"
          >
            Start for Free
          </Link>
          <Link
            href="/auth/signin"
            className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Everything you need</h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            A complete nutrition platform to help you reach your health goals faster
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why choose NutriAI?</h2>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/auth/register"
              className="mt-8 inline-block bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600"
            >
              Get Started Today
            </Link>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-8 text-white">
            <p className="text-green-100 text-sm font-medium mb-2">AI-Generated Example</p>
            <h3 className="text-xl font-bold mb-4">Monday Meal Plan</h3>
            {[
              { meal: "Breakfast", name: "Greek Yogurt Parfait", cal: "420 kcal" },
              { meal: "Lunch", name: "Grilled Chicken Salad", cal: "580 kcal" },
              { meal: "Dinner", name: "Salmon with Quinoa", cal: "650 kcal" },
              { meal: "Snack", name: "Apple with Almond Butter", cal: "230 kcal" },
            ].map(({ meal, name, cal }) => (
              <div key={meal} className="flex items-center justify-between py-3 border-b border-green-500/30 last:border-0">
                <div>
                  <p className="text-green-200 text-xs">{meal}</p>
                  <p className="font-medium">{name}</p>
                </div>
                <span className="text-green-100 text-sm">{cal}</span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-green-500/30 flex justify-between">
              <span className="text-green-100">Total</span>
              <span className="font-bold">1,880 kcal</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        <p>&copy; 2025 NutriAI. Built with Next.js and Claude AI.</p>
      </footer>
    </div>
  );
}
