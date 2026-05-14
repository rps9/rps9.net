import { Download } from 'lucide-react';
import Header from '../components/Header';

const resumePdfPath = '/resume/Ryan_Smith_resume_software.pdf';

export default function Resume() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="px-3 py-6 sm:px-6">
        <div className="mx-auto mb-3 flex w-full max-w-[8.5in] justify-end">
          <a
            href={resumePdfPath}
            download
            aria-label="Download resume PDF"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 text-sm font-medium text-gray-200 transition hover:border-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>

        <div className="mx-auto w-full max-w-[8.5in] overflow-hidden bg-white shadow-2xl">
          <iframe
            title="Ryan Smith Resume"
            src={`${resumePdfPath}#toolbar=0&navpanes=0&scrollbar=0`}
            className="block h-[calc((100vw-1.5rem)*1.294)] max-h-[11in] min-h-[640px] w-full border-0 sm:h-[calc((100vw-3rem)*1.294)]"
          />
        </div>
      </main>
    </div>
  );
}
