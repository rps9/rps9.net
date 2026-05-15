import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { ClipboardToast } from '../components/ClipboardToast';
import ExperienceCard from '../components/ExperienceCard';
import Header from '../components/Header';
import { useClipboardToast } from '../hooks/useClipboardToast';
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
  const { copy, visible, message } = useClipboardToast();
  const email = 'ryans6892@gmail.com';
  const copyProjectEmail = () =>
    void copy(email, 'Email copied to clipboard. Email me for details.');

  return (
    <div className="site-shell">
      <Header />
      {/* Hero Section */}
      <section className="site-section flex min-h-[calc(100vh-4rem)] items-center !border-b-0">
        <div className="site-container">
          <p className="editorial-kicker">Developer Portfolio</p>
          <h1 className="editorial-title mb-8">
            Hi, I'm <span className="text-[#b21f2d]">Ryan</span> Smith.
          </h1>
          <div className="mb-12 flex flex-wrap items-center gap-3 text-sm text-neutral-700 md:text-base">
            <a
              href="https://github.com/rps9"
              className="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              github.com/rps9
            </a>
            <a
              href="https://www.linkedin.com/in/rps9/"
              className="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-4 w-4" />
              linkedin.com/in/rps9
            </a>
            <button
              type="button"
              aria-label="Copy email address"
              className="btn-secondary"
              onClick={() => void copy(email)}
            >
              <Mail className="h-4 w-4" />
              {email}
            </button>
          </div>
          <a
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#b21f2d] transition hover:text-black"
            aria-label="Scroll down"
            href="#experience"
          >
            <ArrowDown className="h-4 w-4" />
            Experience
          </a>
        </div>
      </section>

      {/* Experience Section */}
      <section className="site-section" id="experience">
        <div className="site-container">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="editorial-kicker">Work</p>
              <h2 className="section-title">Experience</h2>
            </div>
            <p className="max-w-xl text-neutral-600">
              Client systems, healthcare integration, and IT support work with emphasis on automation and maintainability.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            <ExperienceCard
              title="Software Developer at Superior Packaging and Finishing"
              description="Built client storefronts, internal REST APIs, and automation scripts. Managed Azure VMs and developed Python tooling that reduced new storefront setup time from one week to less than one day."
              image={superiorImage}
              tags={['Python', 'REST APIs', 'Azure', 'Nginx', 'Apache']}
              href="https://superiorpackagingandfinishing.com/"
            />
            <ExperienceCard
              title="Integration Intern at Mass General Brigham"
              description="Collaborated with the Software Integration team, handled API-related requests, and built automated API regression and baseline testing workflows in ReadyAPI/TestEngine with SQL-parameterized cases and reusable XML suites."
              image={mgbImage}
              tags={['APIs', 'ReadyAPI', 'TestEngine', 'SQL', 'ServiceNow']}
              href="https://www.massgeneralbrigham.org/"
            />
            <ExperienceCard
              title="IT Consultant at Boston University Engineering IT"
              description="Imaged and configured Windows/Linux lab machines, resolved network and IAM issues (DNS/DHCP, 802.1X, VPN, MFA/SSO), and wrote internal guides that reduced repeat support tickets."
              image={buImage}
              tags={['Linux', 'Windows', 'Networking', 'VPN', 'IAM']}
              href="https://www.bu.edu/engit/"
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="site-section" id="projects">
        <div className="site-container">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="editorial-kicker">Builds</p>
              <h2 className="section-title">Projects</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            <ExperienceCard
              title="Federated Learning in ChRIS"
              description="Built Dockerized ChRIS plugins for federated medical imaging workflows, including orchestration and hospital-site execution, with reverse-SSH and single-machine deployment options."
              image={federatedDiagramImage}
              tags={['Docker', 'ChRIS', 'Flower', 'gRPC']}
              sourceType="open"
              sourceUrl="https://github.com/EC528-Fall-2025/FedMed-ChRIS"
              expandableImage
            />
            <ExperienceCard
              title="Stock Tracking Website"
              description="Constructed an event-driven architecture using Finnhub WebSockets, AWS SQS, and analytics services to power real-time stock metrics, with CI/CD and full test coverage."
              image={stocksImage}
              tags={['React', 'TypeScript', 'Java', 'AWS SQS', 'CI/CD']}
              sourceType="closed"
              onClick={copyProjectEmail}
            />
            <ExperienceCard
              title="Personal Website"
              description="Built a full-stack app with JWT auth, role-based access control, FastAPI REST services, email verification, and OpenAI/Spotify integrations; deployed with Docker, Render, and Neon Postgres."
              image={websiteImage}
              tags={['FastAPI', 'PostgreSQL', 'Docker', 'OpenAI API', 'Spotify API']}
              sourceType="open"
              sourceUrl="https://github.com/rps9/rps9.net"
            />
            <ExperienceCard
              title="HUDini Translation Glasses"
              description="Developed the iOS app in Swift/SwiftUI for translation glasses, including Bluetooth communication, live transcription, translation pipelines, and a FastAPI + SQL backend."
              image={hudiniImage}
              tags={['Swift', 'SwiftUI', 'CoreBluetooth', 'FastAPI', 'SQL']}
              sourceType="closed"
              onClick={copyProjectEmail}
              expandableImage
            />
            <ExperienceCard
              title="Point-to-Point IR Communication Device"
              description="Engineered a high-speed infrared communication system in C on Arduino UNO with PS/2 keyboard input, NEC IR transmission, I2C LCD output, and servo control mode."
              image={p2pDeviceImage}
              tags={['C', 'Arduino', 'IRremote', 'I2C', 'Embedded']}
              sourceType="open"
              sourceUrl="https://github.com/rps9/point-to-point-IR"
              expandableImage
            />
            <ExperienceCard
              title="Pintos Operating System Labs"
              description="Implemented scheduling, synchronization, syscall/process handling, and virtual memory subsystems including supplemental page tables, frame/swap management, and page-fault handling."
              image={osImage}
              tags={['C', 'Operating Systems', 'Virtual Memory', 'Concurrency']}
              sourceType="closed"
              onClick={copyProjectEmail}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        data-site-footer="true"
        className="bg-black py-8 text-center text-sm font-semibold uppercase tracking-wide text-white"
      >
        <p>© {new Date().getFullYear()} Ryan Smith. All rights reserved.</p>
      </footer>
      <ClipboardToast visible={visible} message={message} />
    </div>
  );
}

export default Home;
