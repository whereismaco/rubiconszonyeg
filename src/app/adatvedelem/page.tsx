import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { getSettings } from "@/lib/actions";

export const dynamic = 'force-dynamic';

export default async function AdatvedelemPage() {
  const settings = await getSettings();
  const filePath = path.join(process.cwd(), 'public', 'adatvedelmi-nyilatkozat.md');
  let markdownContent = '';
  
  try {
    markdownContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    markdownContent = '# Hiba történt\nAz Adatvédelmi Nyilatkozat fájl nem található a szerveren.';
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#181A2C] font-sans selection:bg-[#3AC2FE] selection:text-white">
      <PublicHeader settings={settings} />

      <main className="max-w-4xl mx-auto px-6 py-32 md:py-40">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-gray-100">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-black text-[#181A2C] mb-6" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-bold text-[#1D63B7] pt-6 mb-4" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-bold text-[#181A2C] mt-4 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-2 mb-6 text-gray-700" {...props} />,
              li: ({node, ...props}) => <li className="pl-1" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-[#181A2C]" {...props} />,
              a: ({node, ...props}) => <a className="text-[#3AC2FE] hover:text-[#1D63B7] transition-colors font-medium underline" {...props} />,
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </main>

      <PublicFooter settings={settings} />
    </div>
  );
}
