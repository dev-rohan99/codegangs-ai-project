import { ExternalLink, Sparkles } from 'lucide-react';

const projects = [
    { url: 'https://rehabit.us', name: 'Rehabit' },
    { url: 'https://app.rehabit.us', name: 'Rehabit App' },
    { url: 'https://affirmations.rehabit.us', name: 'Rehabit Affirmations' },
    { url: 'https://meditations.rehabit.us', name: 'Rehabit Meditations' },
    { url: 'https://music.rehabit.us', name: 'Rehabit Music' },
    { url: 'https://scene.rehabit.us', name: 'Rehabit Scene' },
    { url: 'https://shot.rehabit.us', name: 'Rehabit Shot' },
    { url: 'https://cover.rehabit.us', name: 'Rehabit Cover' },
    { url: 'https://rebuild.app.rehabit.us', name: 'Rehabit Rebuild' },
    { url: 'https://owners.bayside.vacations', name: 'Bayside Vacations Owners' },
    { url: 'https://subscriptions.latticecode.pro/', name: 'LatticeCode Subscriptions' },
    { url: 'https://toptrackercsv.latticecode.pro', name: 'TopTracker CSV' },
    { url: 'https://www.digitalgregg.com', name: 'Digital Gregg' },
    { url: 'https://www.gregghosting.com', name: 'Gregg Hosting' },
    { url: 'https://latticecode.pro', name: 'LatticeCode' },
    { url: 'https://codeforsite.com', name: 'CodeForSite' },
    { url: 'https://www.foreseeaicoaching.com', name: 'Foresee AI Coaching' },
    { url: 'https://clw-solutions.vercel.app', name: 'CLW Solutions' },
    { url: 'https://syndic.us', name: 'Syndic' },
    { url: 'https://defi-app-jet.vercel.app', name: 'DeFi App' },
    { url: 'https://result-application.netlify.app', name: 'Result Application' },
];

export default function Projects() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Our Projects
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explore our portfolio of successful projects spanning multiple industries and technologies. Each project represents our commitment to excellence and innovation.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <a
                            key={index}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-600 transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    {project.name.charAt(0)}
                                </div>
                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {project.name}
                            </h3>

                            <p className="text-sm text-gray-500 break-all line-clamp-2">
                                {project.url}
                            </p>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform rounded-b-xl" />
                        </a>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Have a Project in Mind?
                        </h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            We're always excited to work on new challenges. Let's create something amazing together.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
                        >
                            Start Your Project
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
