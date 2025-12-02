import { useState } from "react";
import {
  Mail,
  Linkedin,
  Github,
  Users,
  Target,
  Sparkles,
  Award,
} from "lucide-react";
import pavi from "../../assets/pavi.jpg";
import roshin from "../../assets/roshin.jpg";
import allen from "../../assets/allen.jpg";
import sidharth from "../../assets/sid.jpg";
import { useNavigate } from "react-router-dom";

const content = {
  title: "EduBuddy",
  introduction: `Welcome to EduBuddy, your ultimate companion in academic success! 
  Our platform is designed to empower students by providing innovative tools and 
  resources that make learning more accessible, efficient, and engaging.

  At EduBuddy, we understand the challenges students face in managing their academic journey. 
  That's why we've built a platform that combines essential features to streamline your study 
  routine, improve productivity, and ensure you're always on track.`,
  features: [
    {
      title: "A Repository of User-Uploaded Notes",
      details: `Access a vast collection of notes uploaded by fellow students.
          Notes are ranked by community votes for credibility and quality, ensuring you get 
          the best study materials. Share your own notes and contribute to the learning community!`,
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Grade Calculator",
      details: `Worried about your academic performance? Our grade calculator uses your 
          inputs to estimate your potential grades. Identify areas of improvement and stay ahead in your studies.`,
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: "Model Question Paper Generator",
      details: `Create tailored question papers from your syllabus and previous year questions (PYQ).
          Perfect for exam preparation and practice.`,
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      title: "Attendance Calculator",
      details: `Keep track of your attendance effortlessly. Calculate your total attendance and ensure 
          you maintain the required minimum to stay compliant with your institution's policies.`,
      icon: <Award className="w-6 h-6" />,
    },
    {
      title: "Access to Previous Year Question Papers",
      details: `Browse a collection of past question papers to understand exam patterns and frequently 
          asked questions. Use these as a guide to prepare effectively for your exams.`,
      icon: <Users className="w-6 h-6" />,
    },
  ],
  benefits: [
    "Student-Centric Design: Every feature is built with students' needs in mind.",
    "Community-Driven: Contribute, collaborate, and learn from a thriving community of students.",
    "Efficiency at Its Best: From predicting grades to managing attendance, EduBuddy saves you time and helps you focus on what truly matters—learning.",
    "Reliable Resources: All content is vetted by community voting to ensure quality and relevance.",
  ],
  callToAction: `Whether you're looking to ace your exams, stay on top of your attendance, or share 
  and discover valuable notes, EduBuddy is here to support your academic journey. Together, let's 
  make learning more effective and enjoyable!`,
  slogan: "Your education, your buddy—EduBuddy",
};

export default function About() {
  const [hoveredMember, setHoveredMember] = useState(null);
  const navigate = useNavigate();

  // Team members data array
  const teamMembers = [
    {
      name: "Allen Joseph Joy",
      role: "Backend Developer",
      image: allen,
      email: "allenalackaparambil@gmail.com",
      linkedin: "http://www.linkedin.com/in/allen-joseph-joy",
      github: "https://github.com/Allen-Josu",
      gradient: "from-blue-400 to-purple-600",
    },
    {
      name: "Roshin Sleeba C",
      role: "Frontend Developer",
      image: roshin,
      email: "roshinsleebac2002@gmail.com",
      linkedin: "https://www.linkedin.com/in/roshin-sleeba-c-112466320",
      github: "https://github.com/Roshinsleeba",
      gradient: "from-green-400 to-blue-600",
    },
    {
      name: "Sidharth P R",
      role: "AI Specialist",
      image: sidharth,
      email: "sidharthprsidhu@gmail.com",
      linkedin: "https://www.linkedin.com/in/sidharth-p-r-8088a0327",
      github: "https://github.com/Sidharthpr",
      gradient: "from-purple-400 to-pink-600",
    },
    {
      name: "Pavi Sankar N P",
      role: "UI/UX Designer",
      image: pavi,
      email: "pavisankarneelamana@gmail.com",
      linkedin: "https://www.linkedin.com/in/pavi-sankar-n-p-492518290",
      github: "https://github.com/pavi-sankar",
      gradient: "from-orange-400 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-6">
            {content.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Your ultimate companion in academic success
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Meet Our Core Team
            </h2>
            <p className="text-xl text-gray-400">
              The brilliant minds behind EduBuddy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredMember(index)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div
                  className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    hoveredMember === index ? "shadow-xl" : ""
                  }`}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Profile Image */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-600 group-hover:border-purple-400 transition-colors duration-300">
                      <img
                        src={member.image}
                        alt={`${member.name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    ></div>
                  </div>

                  {/* Member Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-purple-400 text-sm font-medium mb-4">
                      {member.role}
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-4">
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-full bg-gray-700/50 hover:bg-purple-600 transition-colors duration-300 group/icon"
                      >
                        <Mail className="w-4 h-4 text-gray-300 group-hover/icon:text-white" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-700/50 hover:bg-blue-600 transition-colors duration-300 group/icon"
                      >
                        <Linkedin className="w-4 h-4 text-gray-300 group-hover/icon:text-white" />
                      </a>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600 transition-colors duration-300 group/icon"
                      >
                        <Github className="w-4 h-4 text-gray-300 group-hover/icon:text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Content */}
        <section className="space-y-20">
          {/* Introduction */}
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed">
              {content.introduction}
            </p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-400 text-center mb-12">
              Comprehensive tools for your academic success
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white ml-4">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-3xl p-12 border border-purple-500/20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Why Choose EduBuddy?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="p-2 rounded-full bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Join Us Today!</h2>
            <p className="text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
              {content.callToAction}
            </p>
            <p className="text-2xl font-semibold italic mb-8">
              &quot;{content.slogan}&quot;
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <div className="text-gray-400">
            &copy; 2025 EduBuddy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
