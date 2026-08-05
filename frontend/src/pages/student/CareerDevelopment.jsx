import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import { ExternalLink, Briefcase, GraduationCap, Globe, BookOpen, Search, UserPlus, Users } from 'lucide-react';

const HubCard = ({ title, description, icon: Icon, link, color }) => (
    <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -3 }}
        className="block bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md hover:border-primary-500/50 transition-all duration-300 group"
    >
        <div className="p-5 sm:p-6 md:p-8 flex flex-col items-center text-center space-y-3 sm:space-y-4">
            {/* Logo Placeholder / Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1 shadow-sm transition-transform group-hover:scale-105" style={{ backgroundColor: `${color}15` }}>
                <Icon size={24} className="sm:w-8 sm:h-8" style={{ color: color }} />
            </div>

            <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2 px-1">
                    {description}
                </p>
            </div>

            <div className="pt-2 flex items-center text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-emerald-400">
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
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Career Services Section */}
            <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2.5">
                    <div className="w-1.5 h-5 bg-primary-500 rounded-full" />
                    <h2 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">
                        Career Services
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {careerServices.map((service, idx) => (
                        <HubCard key={idx} {...service} />
                    ))}
                </div>
            </section>

            {/* Learning Resources Section */}
            <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2.5">
                    <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                    <h2 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">
                        Learning Resources
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {learningResources.map((resource, idx) => (
                        <HubCard key={idx} {...resource} />
                    ))}
                </div>
            </section>

            {/* Support Alert Banner */}
            <Card className="bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 relative overflow-hidden p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex flex-col md:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
                    <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-[#2D2A4F] dark:text-indigo-200">Need Career Counseling?</h3>
                        <p className="text-xs sm:text-sm text-indigo-700/70 dark:text-indigo-400 font-medium max-w-lg mt-0.5">
                            Our Career Development Center (CDC) offers one-on-one sessions to help you with resume building, interview prep, and career pathing.
                        </p>
                    </div>
                    <a
                        href="https://cdc.rbu.edu.bd/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm shrink-0"
                    >
                        Book a Session
                    </a>
                </div>
            </Card>
        </div>
    );
};

export default CareerDevelopment;