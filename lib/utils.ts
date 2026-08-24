import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getQualitativeEquivalence(scorePercentage: number): { grade: number, label: string } {
  const grade = scorePercentage / 20;
  let label = "Desempeño no aprobado";
  if (grade >= 4.6) {
    label = "Desempeño superior";
  } else if (grade >= 4.0) {
    label = "Desempeño alto";
  } else if (grade >= 3.0) {
    label = "Desempeño satisfactorio";
  }
  return { grade, label };
}
