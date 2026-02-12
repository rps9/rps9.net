import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import Header from '../components/Header';
import federatedDiagramImage from '../assets/federated_diagram.jpg';
import stocksImage from '../assets/stocks.jpg';
import hudiniImage from '../assets/hudini.jpg';
import p2pDeviceImage from '../assets/p2p_device.jpg';
import osImage from '../assets/os.jpg';
import mgbImage from '../assets/mgb.jpg';
import superiorImage from '../assets/superior.jpg';
import buImage from '../assets/bu.jpg';
import websiteImage from '../assets/website.jpg';

function Home() {

  return (
    <div className="bg-gray-900">
      <Header />
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center relative px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Hi, I'm <span className="text-blue-400">Ryan</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Welcome To My Website !
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <a href="https://github.com/rps9" className="text-gray-400 hover:text-blue-400 transition-colors" target="_blank">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/rps9/" className="text-gray-400 hover:text-blue-400 transition-colors" target="_blank">
              <Linkedin size={24} />
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ryans6892@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors" target="_blank">
              <Mail size={24} />
            </a>
          </div>
        </div>
        <a
          className="group inline-flex items-center rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1 text-gray-300 transition hover:bg-gray-700 hover:text-white"
          aria-label="Scroll down" href="#experience"
        >
          <ArrowDown className="h-4 w-4 group-hover:animate-bounce" />
        </a>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 bg-gray-800" id="experience">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">My Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            <ExperienceCard
              title="Integration Intern at Mass General Brigham"
              description="Collaborated with the Software Integration team, handled API-related requests, and built automated API regression and baseline testing workflows in ReadyAPI/TestEngine with SQL-parameterized cases and reusable XML suites."
              image={mgbImage}
              tags={['APIs', 'ReadyAPI', 'TestEngine', 'SQL', 'ServiceNow']}
            />
            <ExperienceCard
              title="Software Developer at Superior Packaging and Finishing"
              description="Built client storefronts, internal REST APIs, and automation scripts. Managed Azure VMs and developed Python tooling that reduced new storefront setup time from one week to less than one day."
              image={superiorImage}
              tags={['Python', 'REST APIs', 'Azure', 'Nginx', 'Apache']}
            />
            <ExperienceCard
              title="IT Consultant at Boston University Engineering IT"
              description="Imaged and configured Windows/Linux lab machines, resolved network and IAM issues (DNS/DHCP, 802.1X, VPN, MFA/SSO), and wrote internal guides that reduced repeat support tickets."
              image={buImage}
              tags={['Linux', 'Windows', 'Networking', 'VPN', 'IAM']}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 bg-gray-800" id="projects">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">My Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            <ExperienceCard
              title="Federated Learning in ChRIS"
              description="Built Dockerized ChRIS plugins for federated medical imaging workflows, including orchestration and hospital-site execution, with reverse-SSH and single-machine deployment options."
              image={federatedDiagramImage}
              tags={['Docker', 'ChRIS', 'Flower', 'gRPC']}
              sourceType="open"
              sourceUrl="https://github.com/EC528-Fall-2025/FedMed-ChRIS"
            />
            <ExperienceCard
              title="Stock Tracking Website"
              description="Constructed an event-driven architecture using Finnhub WebSockets, AWS SQS, and analytics services to power real-time stock metrics, with CI/CD and full test coverage."
              image={stocksImage}
              tags={['React', 'TypeScript', 'Java', 'AWS SQS', 'CI/CD']}
              sourceType="closed"
            />
            <ExperienceCard
              title="Personal Website"
              description="Built a full-stack app with JWT auth, role-based access control, FastAPI REST services, email verification, and OpenAI/Spotify integrations; deployed with Docker, Render, and Neon Postgres."
              image={websiteImage}
              tags={['FastAPI', 'PostgreSQL', 'Docker', 'OpenAI API', 'Spotify API']}
              sourceType="open"
              sourceUrl="https://github.com/rps9/rps9.github.io"
            />
            <ExperienceCard
              title="HUDini Translation Glasses"
              description="Developed the iOS app in Swift/SwiftUI for translation glasses, including Bluetooth communication, live transcription, translation pipelines, and a FastAPI + SQL backend."
              image={hudiniImage}
              tags={['Swift', 'SwiftUI', 'CoreBluetooth', 'FastAPI', 'SQL']}
              sourceType="closed"
            />
            <ExperienceCard
              title="Point-to-Point IR Communication Device"
              description="Engineered a high-speed infrared communication system in C on Arduino UNO with PS/2 keyboard input, NEC IR transmission, I2C LCD output, and servo control mode."
              image={p2pDeviceImage}
              tags={['C', 'Arduino', 'IRremote', 'I2C', 'Embedded']}
              sourceType="open"
              sourceUrl="https://github.com/rps9/point-to-point-IR"
            />
            <ExperienceCard
              title="Pintos Operating System Labs"
              description="Implemented scheduling, synchronization, syscall/process handling, and virtual memory subsystems including supplemental page tables, frame/swap management, and page-fault handling."
              image={osImage}
              tags={['C', 'Operating Systems', 'Virtual Memory', 'Concurrency']}
              sourceType="closed"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 bg-gray-900">
        <p>© {new Date().getFullYear()} Ryan Smith. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
