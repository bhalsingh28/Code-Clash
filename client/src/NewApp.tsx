import "./newStyles.css";
import Navbar from "./components/Navbar";

interface CardProps {
  icon: string;
  title: string;
  description: string;
}

const Card = ({ icon, title, description }: CardProps) => (
  <div className="bg-[#212328] rounded-lg px-4 py-3 hover:bg-gray-750 transition-colors">
    <div className="flex justify-items-start items-center gap-2">
      <div className="text-xl mb-3">{icon}</div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
    </div>
    <p className="text-gray-white text-sm">{description}</p>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b bg-primary-black text-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-20">
            <div className="mb-12 flex-col items-start">
              <h1 className="text-6xl font-bold mb-4">
                <span className="bg-clip-text text-red">CodeClash</span>
              </h1>
              <h2 className="text-4xl text-white font-bold mb-4">
                Solve. Practise. Compete.
              </h2>
              <p className="text-gray-white text-lg max-w-2xl">
                Solve coding challenges, compete in real-time contests, and
                sharpen your DSA skills with friends.
              </p>
            </div>

            {/* Buttons */}

            <div className="flex flex-wrap gap-3 mb-14">
              {" "}
              <button className="px-4 py-2 bg-red rounded-full font-medium text-[#fff] hover:shadow-lg hover:bg-[#ff5147] transition">
                Private Room
              </button>
              <button className="px-4 py-2 bg-secondary-black rounded-full font-medium hover:bg-gray-700 transition">
                Problems
              </button>
              <button className="px-4 py-2 bg-secondary-black rounded-full font-medium hover:bg-gray-700 transition">
                Practise
              </button>
            </div>

            {/* Cards Grid */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card
                icon="📚"
                title="Problem Library"
                description="Explore hundreds of coding challenges across arrays, graphs, dynamic programming and more."
              />

              <Card
                icon="🔒"
                title="Private Rooms"
                description="Challenge friends in private rooms with custom problems, timer window and live rankings."
              />

              <Card
                icon="📊"
                title="Topic Practise"
                description="Practise problems organised by topics, difficulty and interview patterns."
              />

              <Card
                icon="🔥"
                title="Daily Challenge"
                description="Solve a new coding problem every day to build consistency and maintain your streak."
              />

              <Card
                icon="⭐"
                title="Achievements"
                description="Earn badges, unlock milestones, and showcase your competitive programming journey."
              />

              <Card
                icon="💬"
                title="Live Chat"
                description="Chat with teammates and competitors in real time during contests and private coding rooms."
              />
            </div>

            {/* Early Access Banner */}
            <div className="bg-linear-to-r from-yellow-900/30 to-yellow-800/20 border border-yellow-700/50 rounded-lg px-6 py-4 flex items-center gap-4">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="text-yellow-400 font-bold mb-1">EarlyAccess</h3>
                <p className="text-gray-300">
                  CodeClash is currently in beta. Expect frequent updates, new
                  features, and occasional bugs as we continue improving the
                  platform.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
