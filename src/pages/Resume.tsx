import { Download } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ClipboardToast } from '../components/ClipboardToast';
import Header from '../components/Header';
import { useClipboardToast } from '../hooks/useClipboardToast';
import { contactLinks, experience, projects, resumePdfPath } from './resumeContent';

const PAGE_WIDTH = 816;
const PAGE_HEIGHT = 1056;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Entry({
  leftTop,
  rightTop,
  leftBottom,
  rightBottom,
  bullets,
}: {
  leftTop: string;
  rightTop: string;
  leftBottom?: string;
  rightBottom?: string;
  bullets?: string[];
}) {
  return (
    <article className="resume-entry">
      <div className="resume-entry-grid">
        <strong>{leftTop}</strong>
        <strong className="resume-right">{rightTop}</strong>
        {leftBottom && <strong>{leftBottom}</strong>}
        {rightBottom && <strong className="resume-right">{rightBottom}</strong>}
      </div>
      {bullets && (
        <ul>
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function Resume() {
  const pageAreaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { copy, visible } = useClipboardToast();

  useEffect(() => {
    const updateScale = () => {
      const pageArea = pageAreaRef.current;
      if (!pageArea) return;

      const nextScale = Math.min(
        pageArea.clientWidth / PAGE_WIDTH,
        pageArea.clientHeight / PAGE_HEIGHT,
        1
      );
      setScale(nextScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (pageAreaRef.current) observer.observe(pageAreaRef.current);
    window.addEventListener('orientationchange', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);

  return (
    <div className="site-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:wght@400;700&display=swap');

        .resume-paper {
          width: ${PAGE_WIDTH}px;
          height: ${PAGE_HEIGHT}px;
          padding: 72px;
          background: #fff;
          color: #000;
          font-family: 'Spectral', Georgia, serif;
          font-size: 13.4px;
          line-height: 18.4px;
          box-sizing: border-box;
          transform-origin: top left;
        }

        .resume-paper a {
          color: #000;
          text-decoration: none;
        }

        .resume-contact-button {
          border: 0;
          margin: 0;
          padding: 0;
          background: transparent;
          color: #000;
          font: inherit;
          cursor: pointer;
        }

        .resume-paper header {
          text-align: center;
        }

        .resume-paper h1 {
          margin: 0 0 4px;
          font-size: 20px;
          line-height: 22px;
          font-weight: 700;
        }

        .resume-paper address {
          font-style: normal;
        }

        .resume-paper p {
          margin: 0;
        }

        .resume-section {
          margin-top: 11px;
        }

        .resume-section h2 {
          margin: 0 0 6px;
          border-bottom: 1px solid #000;
          padding-bottom: 1px;
          font-size: 16.6px;
          line-height: 19px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .resume-entry {
          margin-bottom: 6px;
        }

        .resume-entry:last-child {
          margin-bottom: 0;
        }

        .resume-entry-grid {
          display: grid;
          grid-template-columns: 1fr 25%;
          column-gap: 16px;
        }

        .resume-right {
          text-align: right;
        }

        .resume-paper ul {
          margin: 2px 0 0;
          padding-left: 20px;
          list-style: disc outside;
        }

        .resume-paper li {
          display: list-item;
          margin: 0;
        }

        .resume-gpa {
          margin-top: -5px;
        }
      `}</style>

      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col px-2 py-4">
        <div className="mx-auto mb-4 flex w-full max-w-[816px] items-center justify-between border-b border-black pb-3">
          <div>
            <p className="editorial-kicker mb-1">Resume</p>
            <h1 className="text-2xl font-black text-black">Ryan Smith</h1>
          </div>
          <a
            href={resumePdfPath}
            download
            aria-label="Download resume PDF"
            className="btn-primary min-h-9 px-3 py-2"
          >
            <Download className="h-4 w-4" />
            PDF
          </a>
        </div>

        <div
          ref={pageAreaRef}
          className="flex min-h-0 flex-1 items-start justify-center overflow-hidden"
        >
          <div
            className="shadow-2xl"
            style={{
              width: PAGE_WIDTH * scale,
              height: PAGE_HEIGHT * scale,
            }}
          >
            <article
              className="resume-paper"
              style={{ transform: `scale(${scale})` }}
            >
              <header>
                <h1>Ryan P. Smith</h1>
                <address>
                  {contactLinks.map((contact, index) => (
                    <span key={contact.label}>
                      {index > 0 && ' | '}
                      {contact.copyValue ? (
                        <button
                          type="button"
                          className="resume-contact-button"
                          onClick={() => void copy(contact.copyValue)}
                        >
                          {contact.label}
                        </button>
                      ) : contact.href ? (
                        <a href={contact.href} target="_blank" rel="noopener noreferrer">
                          {contact.label}
                        </a>
                      ) : (
                        contact.label
                      )}
                    </span>
                  ))}
                </address>
              </header>

              <Section title="Education">
                <Entry
                  leftTop="BOSTON UNIVERSITY COLLEGE OF ENGINEERING"
                  rightTop="Boston, MA"
                  leftBottom="Bachelor of Science in Computer Engineering"
                  rightBottom="May 2026"
                />
                <p className="resume-gpa">GPA: 3.68, Dean's List</p>
              </Section>

              <Section title="Professional Experience">
                {experience.map((item) => (
                  <Entry
                    key={item.company}
                    leftTop={item.company}
                    rightTop={item.location}
                    leftBottom={item.role}
                    rightBottom={item.date}
                    bullets={item.bullets}
                  />
                ))}
              </Section>

              <Section title="Projects">
                {projects.map((project) => (
                  <Entry
                    key={project.name}
                    leftTop={project.name}
                    rightTop={project.date}
                    bullets={project.bullets}
                  />
                ))}
              </Section>

              <Section title="Skills">
                <p>
                  <strong>Coding Languages:</strong> Python, Java, SQL, C, C++, CSS, HTML,
                  JavaScript, MATLAB, Swift
                </p>
                <p>
                  <strong>Frameworks/Tools:</strong> React, FastAPI, PostgreSQL, Docker,
                  AWS, GitHub Actions, Linux, Postman
                </p>
              </Section>
            </article>
          </div>
        </div>
      </main>
      <ClipboardToast visible={visible} />
    </div>
  );
}
