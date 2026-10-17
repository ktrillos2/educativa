import React from 'react';
import AutoEvaluationForm from '@/components/AutoEvaluationForm';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Award } from '@/components/ui/icons';
import { getSession } from '@/lib/auth';
import { createAdminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Auto‑evaluación del programa – Academia de Formación Líderes del Mérito',
  description: 'Complete la auto‑evaluación del programa para medir su nivel de satisfacción y contribuir al mejoramiento continuo de la calidad formativa.',
};

export default async function AutoEvaluationPage(props: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const rawParams = await props.params;
  const programId = decodeURIComponent(rawParams.id);

  const session = await getSession();
  let existingEval = null;

  if (session?.userId) {
    const adminSupabase = createAdminClient();
    const { data } = await adminSupabase
      .from('auto_evaluation_responses')
      .select('id, created_at')
      .eq('user_id', session.userId)
      .eq('program_id', programId)
      .maybeSingle();

    existingEval = data;
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
      <div className="container mx-auto max-w-4xl mb-6">
        <Link
          href={`/formacion-academica/${programId}`}
          className="inline-flex items-center text-sm font-semibold text-[#006838] bg-[#006838]/10 hover:bg-[#006838]/20 px-3.5 py-1.5 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Programa
        </Link>
      </div>

      {existingEval ? (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-green-200 p-8 md:p-12 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
            Autoevaluación Ya Completada
          </h1>
          <p className="text-gray-600 text-base mb-6 max-w-xl mx-auto leading-relaxed">
            Ya has diligenciado satisfactoriamente el instrumento de percepción y calidad formativa para este programa académico. Solo se realiza una única vez por participante.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-8 text-emerald-800 text-sm max-w-lg mx-auto">
            ✅ <strong>Estado:</strong> Registrada y confirmada el{' '}
            {new Date(existingEval.created_at).toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
            .
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/formacion-academica/${programId}/certificado`}
              className="inline-flex items-center justify-center gap-2 bg-[#006838] hover:bg-[#00522c] text-white text-base font-bold px-8 py-3.5 rounded-lg shadow-md transition-all hover:shadow-lg"
            >
              <Award className="w-5 h-5" />
              Ir a mi Certificado
            </Link>
            <Link
              href={`/formacion-academica/${programId}`}
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-base font-semibold px-6 py-3.5 rounded-lg transition-colors"
            >
              Volver al Programa
            </Link>
          </div>
        </div>
      ) : (
        <AutoEvaluationForm programId={programId} />
      )}

      <footer className="text-center py-8 text-sm mt-16 border-t border-gray-200">
        <a
          href="https://www.kytcode.lat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-gray-700 hover:text-black font-medium transition-colors"
        >
          <span>Desarrollado por K&T</span>
          <span className="text-black dark:text-white" aria-label="amor">
            ❤️
          </span>
        </a>{' '}
        <span className="text-gray-500">© {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
