
'use server';

import { summarizeJobDescription, type SummarizeJobDescriptionOutput } from '@/ai/flows/summarize-job-description';

export interface ActionResult {
  summary?: SummarizeJobDescriptionOutput;
  keyTerms?: string[];
  error?: string;
}

export async function processJobDescription(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const jobDescription = formData.get('jobDescription') as string;

  if (!jobDescription || jobDescription.trim().length < 50) {
    return {
      error: 'Please provide a job description of at least 50 characters.',
    };
  }

  try {
    const result = await summarizeJobDescription({ jobDescription });

    if (!result || !result.keyTerms) {
      throw new Error('AI failed to generate a valid response.');
    }

    return {
      summary: result,
      keyTerms: result.keyTerms,
    };
  } catch (e) {
    console.error(e);
    // Return a user-friendly error message
    return {
      error:
        'An unexpected error occurred while processing the job description. Please try again later.',
    };
  }
}
