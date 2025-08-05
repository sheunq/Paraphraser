'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing job descriptions.
 *
 * - summarizeJobDescription - A function that takes a job description as input and returns a summarized version.
 * - SummarizeJobDescriptionInput - The input type for the summarizeJobDescription function.
 * - SummarizeJobDescriptionOutput - The return type for the summarizeJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description to summarize.'),
});
export type SummarizeJobDescriptionInput = z.infer<typeof SummarizeJobDescriptionInputSchema>;

const SummarizeJobDescriptionOutputSchema = z.object({
  jobTitle: z.string().describe('The job title.'),
  location: z.string().describe('The job location.'),
  department: z.string().describe('The department or team.'),
  jobType: z.string().describe('The employment type (e.g., Contract, Full-time).'),
  rate: z.string().optional().describe('The compensation or pay rate, if available.'),
  aboutCompany: z.string().describe('A summary about the company.'),
  roleOverview: z.string().describe('An overview of the job role.'),
  keyResponsibilities: z.array(z.string()).describe('A list of key responsibilities.'),
  qualifications: z.array(z.string()).describe('A list of qualifications and required skills.'),
  keyTerms: z.array(z.string()).describe('The list of key terms extracted from the job post.'),
});

export type SummarizeJobDescriptionOutput = z.infer<typeof SummarizeJobDescriptionOutputSchema>;

export async function summarizeJobDescription(input: SummarizeJobDescriptionInput): Promise<SummarizeJobDescriptionOutput> {
  return summarizeJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeJobDescriptionPrompt',
  input: {schema: SummarizeJobDescriptionInputSchema},
  output: {schema: SummarizeJobDescriptionOutputSchema},
  prompt: `You are an expert at summarizing job descriptions into a structured and easy-to-read format. You also extract key terms and technologies. Given the job description below, extract the key information and format it according to the output schema.

Use emojis to make the output more engaging.

If a field like 'rate' is not mentioned in the job description, you can omit it.

Job Description:
{{{jobDescription}}}`,
});

const summarizeJobDescriptionFlow = ai.defineFlow(
  {
    name: 'summarizeJobDescriptionFlow',
    inputSchema: SummarizeJobDescriptionInputSchema,
    outputSchema: SummarizeJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
