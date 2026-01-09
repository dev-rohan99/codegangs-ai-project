import Link from 'next/link';
import { ArrowRight, Code2, Rocket, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Building Digital
              <span className="block text-blue-600">Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              We transform ideas into powerful digital solutions. From web applications to complex platforms, CodeGangs delivers exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
              >
                View Our Work
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-600 transition-all hover:scale-105"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CodeGangs?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine technical expertise with creative innovation to deliver solutions that drive real results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                We pride ourselves on delivering high-quality projects on time, without compromising on excellence.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Clean Code</h3>
              <p className="text-gray-600 leading-relaxed">
                Our code is maintainable, scalable, and built with best practices to ensure long-term success.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Our talented developers bring years of experience across multiple technologies and industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Expertise</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We specialize in cutting-edge technologies to build modern, scalable applications.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'AWS'].map((tech) => (
              <div
                key={tech}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center hover:bg-white/20 transition-all"
              >
                <p className="font-semibold text-lg">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <Rocket className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Let's discuss how we can help bring your vision to life with cutting-edge technology and expert craftsmanship.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            Start a Conversation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
