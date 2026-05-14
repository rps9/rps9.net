import { Download } from 'lucide-react';
import Header from '../components/Header';

const resumePdfPath = '/resume/ryan_smith_resume.pdf';
const resumePdfViewPath = `${resumePdfPath}#toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit`;

export default function Resume() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="flex min-h-[calc(100dvh-4rem)] flex-col px-3 py-3 sm:px-6">
        <div
          className="mx-auto mb-2 flex justify-end"
          style={{ width: 'min(100%, calc((100dvh - 8rem) * 8.5 / 11), 8.5in)' }}
        >
          <a
            href={resumePdfPath}
            download
            aria-label="Download resume PDF"
            className="inline-flex h-8 items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 text-sm font-medium text-gray-200 transition hover:border-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            <Download className="h-4 w-4" />
            PDF
          </a>
        </div>

        <div
          className="mx-auto overflow-hidden bg-white shadow-2xl"
          style={{
            aspectRatio: '8.5 / 11',
            width: 'min(100%, calc((100dvh - 8rem) * 8.5 / 11), 8.5in)',
          }}
        >
          <iframe
            title="Ryan Smith Resume"
            src={resumePdfViewPath}
            className="block h-full w-full border-0"
          />
        </div>
      </main>
    </div>
  );
}
