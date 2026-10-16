import React from 'react';
import AutoEvaluationForm from '@/components/AutoEvaluationForm';
import Head from 'next/head';

// -----------------------------------------------------------------------------
// Page component for the auto‑evaluation form (public view)
// -----------------------------------------------------------------------------
export const metadata = {
  title: 'Auto‑evaluación del programa – Academia de Formación Líderes del Mérito',
  description: 'Complete la auto‑evaluación del programa para medir su nivel de satisfacción y contribuir al mejoramiento continuo.',
};

export default async function AutoEvaluationPage({ params }: { params: { id: string } }) {
  const programId = decodeURIComponent(params.id);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Open Graph tags for SEO */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/formacion-academica/${programId}/auto-evaluacion`} />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
        <AutoEvaluationForm />
        <footer className="text-center py-6 text-sm bg-white dark:bg-gray-900 mt-12">
          <a
            href="https://www.kytcode.lat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800"
          >
            Desarrollado por K&T{' '}
            <span
              className="heart"
              style={{
                display: 'inline-block',
                color: 'inherit',
                filter: 'invert(1)', // will be overridden by CSS based on background
              }}
            >
              ❤️
            </span>
          </a>{' '}
          © {new Date().getFullYear()}
        </footer>
      </main>
      <style jsx>{`
        footer {
          background: #f8f9fa;
        }
        .heart {
          /* If footer background is light, use black heart; if dark, white */
          color: #000;
        }
        @media (prefers-color-scheme: dark) {
          footer {
            background: #212529;
          }
          .heart {
            color: #fff;
          }
        }
        .auto-eval .title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
        }
        .section-title {
          font-size: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }
        .item-text {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .options {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 1rem;
        }
        .option-label input {
          margin-right: 0.25rem;
        }
        .submit-btn {
          display: block;
          margin: 2rem auto;
          padding: 0.75rem 1.5rem;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .submit-btn:hover {
          background: #4338ca;
        }
        .results-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 2rem;
        }
        .results-table th,
        .results-table td {
          border: 1px solid #ddd;
          padding: 0.5rem;
          text-align: center;
        }
        .overall-row td {
          font-weight: bold;
        }
      `}</style>
    </>
  );
}
