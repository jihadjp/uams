import { motion } from 'framer-motion';
import {
  Tags,
  Chrome,
  Github,
  Code2,
  Cloud,
  Send,
  Leaf,
  Palette,
  Compass,
  BarChart3,
  Layout,
  ListTodo,
  CheckCircle2,
  BookOpen,
  Bot,
  ShoppingBag,
  Music,
  Smartphone,
  Layers,
  Box
} from 'lucide-react';
import Card from '../../components/common/Card';

const benefits = [
  {
    title: "Discount Partners",
    description: "Exclusive student discounts",
    icon: Tags,
    color: "#10b981",
    link: "#"
  },
  {
    title: "Google Workspace",
    description: "Email, Drive, Docs & Meet",
    icon: Chrome,
    color: "#ea4335",
    link: "https://workspace.google.com/"
  },
  {
    title: "Microsoft 365",
    description: "Office Apps & OneDrive",
    icon: Box,
    color: "#00a4ef",
    link: "https://www.microsoft.com/en-us/microsoft-365"
  },
  {
    title: "GitHub Student Pack",
    description: "Developer tools & offers",
    icon: Github,
    color: "#24292e",
    link: "https://education.github.com/pack"
  },
  {
    title: "JetBrains License",
    description: "Professional IDEs",
    icon: Code2,
    color: "#fd3168",
    link: "https://www.jetbrains.com/academy/student-pack/?var=1"
  },
  {
    title: "Azure for Students",
    description: "Free cloud credits",
    icon: Cloud,
    color: "#0078d4",
    link: "https://azure.microsoft.com/en-us/free/students/"
  },
  {
    title: "Postman",
    description: "API Development",
    icon: Send,
    color: "#ff6c37",
    link: "https://www.postman.com/learn/"
  },
  {
    title: "MongoDB Atlas",
    description: "Cloud Database",
    icon: Leaf,
    color: "#00ed64",
    link: "https://www.mongodb.com/students"
  },
  {
    title: "Figma Education",
    description: "UI/UX Design",
    icon: Layers,
    color: "#f24e1e",
    link: "https://www.figma.com/education/"
  },
  {
    title: "Canva Education",
    description: "Graphic Design",
    icon: Palette,
    color: "#00c4cc",
    link: "https://www.canva.com/education/students/"
  },
  {
    title: "Autodesk",
    description: "Engineering & CAD",
    icon: Compass,
    color: "#0696d7",
    link: "https://www.autodesk.com/education/edu-software/overview"
  },
  {
    title: "Tableau",
    description: "Data Visualization",
    icon: BarChart3,
    color: "#e8762d",
    link: "https://www.tableau.com/academic/students"
  },
  {
    title: "Miro",
    description: "Collaborative Whiteboard",
    icon: Layout,
    color: "#ffd02f",
    link: "https://miro.com/education-whiteboard/"
  },
  {
    title: "Asana",
    description: "Project Management",
    icon: ListTodo,
    color: "#f06579",
    link: "https://asana.com/industry/students"
  },
  {
    title: "ClickUp",
    description: "Task Management",
    icon: CheckCircle2,
    color: "#7b68ee",
    link: "https://clickup.com/teams/education"
  },
  {
    title: "Notion Plus",
    description: "Notes & Workspace",
    icon: BookOpen,
    color: "#000000",
    link: "https://www.notion.com/product/notion-for-education"
  },
  {
    title: "Perplexity AI",
    description: "AI Search Assistant",
    icon: Bot,
    color: "#22c55e",
    link: "https://www.perplexity.ai/"
  },
  {
    title: "Amazon Prime Student",
    description: "Student Membership",
    icon: ShoppingBag,
    color: "#ff9900",
    link: "https://www.amazon.com/Amazon-Student/b?ie=UTF8&node=668781011"
  },
  {
    title: "Apple Music",
    description: "Student Plan",
    icon: Smartphone,
    color: "#fa243c",
    link: "https://www.apple.com/apple-music/"
  },
  {
    title: "Spotify Student",
    description: "Premium Discount",
    icon: Music,
    color: "#1ed760",
    link: "https://www.spotify.com/bd-en/student/"
  }
];

const Facilities = () => {
  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit, idx) => (
              <motion.a
                  key={benefit.title}
                  href={benefit.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ y: -3 }}
                  className="block h-full"
              >
                <Card className="h-full border border-slate-200/80 dark:border-white/10 bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden cursor-pointer rounded-2xl sm:rounded-3xl !p-5 sm:!p-6 relative">
                  <div className="flex flex-col items-center text-center">
                    <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105 shadow-sm shrink-0"
                        style={{ backgroundColor: `${benefit.color}15`, color: benefit.color }}
                    >
                      <benefit.icon size={24} className="sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-emerald-400 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Decorative corner accent */}
                  <div
                      className="absolute -top-6 -right-6 w-12 h-12 rotate-45 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                      style={{ backgroundColor: benefit.color }}
                  />
                </Card>
              </motion.a>
          ))}
        </div>
      </div>
  );
};

export default Facilities;