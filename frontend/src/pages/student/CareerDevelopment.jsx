import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import { ExternalLink, Briefcase, GraduationCap, Globe, BookOpen, Search, UserPlus, Users } from 'lucide-react';

const HubCard = ({ title, description, icon: Icon, link, logoText, color }) => (
    <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:border-primary-500 transition-all duration-300"
    >
        <div className="p-8 flex flex-col items-center text-center space-y-4">
            {/* Logo Placeholder / Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-sm`} style={{ backgroundColor: `${color}15` }}>
                <Icon size={32} style={{ color: color }} />
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2 px-2">
                    {description}
                </p>
            </div>

            <div className="pt-2 flex items-center text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 group">
                Visit Portal <ExternalLink size={12} className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
            </div>
        </div>
    </motion.a>
);

const CareerDevelopment = () => {
    const careerServices = [
        {
            title: "Internship",
            description: "Find internship opportunities and manage your project/thesis portal.",
            icon: Users,
            link: "https://internship.rbu.edu.bd/",
            color: "#2563eb"
        },
        {
            title: "CDC",
            description: "Career Development Center - Guidance for your professional growth.",
            icon: Briefcase,
            link: "https://cdc.rbu.edu.bd/",
            color: "#0891b2"
        },
        {
            title: "Job Utsob",
            description: "Explore job fairs, recruitment events and networking opportunities.",
            icon: UserPlus,
            link: "#",
            color: "#e11d48"
        },
        {
            title: "Skill Jobs",
            description: "Search and apply for jobs based on your technical skills.",
            icon: Search,
            link: "https://skill.jobs/",
            color: "#0d9488"
        }
    ];

    const learningResources = [
        {
            title: "Library",
            description: "Access the digital library catalog, journals, and research papers.",
            icon: BookOpen,
            link: "https://library.rbu.edu.bd/",
            color: "#4f46e5"
        },
        {
            title: "BLC",
            description: "Blended Learning Center - Your primary online class and course material hub.",
            icon: Globe,
            link: "https://elearn.rbu.edu.bd/",
            color: "#16a34a"
        },
        {
            title: "Go Edu",
            description: "Study abroad & higher education services for international students.",
            icon: GraduationCap,
            link: "https://goedu.ac/",
            color: "#ea580c"
        },
        {
            title: "IOU",
            description: "International Online University - Global opportunities and collaborations.",
            icon: Globe,
            link: "#",
            color: "#1e293b"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 px-2">
            <div>
                <h1 className="text-3xl font-black text-[#2D2A4F] dark:text-white tracking-tight">Career & Learning Hub</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Resources for your future</p>
            </div>

            {/* Career Services Section */}
            <section className="space-y-6">
                <div className="flex items-center space-x-3 px-1 border-l-4 border-primary-500 pl-4">
                    <h2 className="text-xl font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">Career Services</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {careerServices.map((service, idx) => (
                        <HubCard key={idx} {...service} />
                    ))}
                </div>
            </section>

            {/* Learning Resources Section */}
            <section className="space-y-6">
                <div className="flex items-center space-x-3 px-1 border-l-4 border-indigo-500 pl-4">
                    <h2 className="text-xl font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">Learning Resources</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {learningResources.map((resource, idx) => (
                        <HubCard key={idx} {...resource} />
                    ))}
                </div>
            </section>

            {/* Support Alert */}
            <Card className="bg-[#2D2A4F] border-none text-white overflow-hidden relative p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-bold">Need Career Counseling?</h3>
                        <p className="text-indigo-200 text-sm max-w-lg">Our Career Development Center (CDC) offers one-on-one sessions to help you with resume building, interview prep, and career pathing.</p>
                    </div>
                    <a
                        href="https://cdc.rbu.edu.bd/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-white text-[#2D2A4F] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg"
                    >
                        Book a Session
                    </a>
                </div>
            </Card>
        </div>
    );
};

export default CareerDevelopment;
