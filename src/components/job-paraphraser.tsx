
'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Copy, Sparkles, LoaderCircle } from 'lucide-react';

import { processJobDescription, type ActionResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import type { SummarizeJobDescriptionOutput } from '@/ai/flows/summarize-job-description';

const initialState: ActionResult = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
          Paraphrasing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Paraphrase
        </>
      )}
    </Button>
  );
}

function formatSummaryToText(summary: SummarizeJobDescriptionOutput) {
  let text = '';
  text += `🔎 Job Title: ${summary.jobTitle}\n`;
  text += `📍 Location: ${summary.location}\n`;
  text += `💼 Department: ${summary.department}\n`;
  text += `📅 Type: ${summary.jobType}\n`;
  if (summary.rate) {
    text += `💰 Rate: ${summary.rate}\n`;
  }
  text += `\n🏢 About ${summary.aboutCompany.split(' ')[0]}\n${summary.aboutCompany}\n`;
  text += `\n🎯 Role Overview\n${summary.roleOverview}\n`;
  text += `\n🛠️ Key Responsibilities\n- ${summary.keyResponsibilities.join('\n- ')}\n`;
  text += `\n✅ What You Bring\n- ${summary.qualifications.join('\n- ')}\n`;
  return text;
}


export default function JobParaphraser() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(processJobDescription, initialState);

  const handleCopy = () => {
    if (state.summary) {
      const textToCopy = formatSummaryToText(state.summary);
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: 'Copied to Clipboard!',
        description: 'The paraphrased description has been copied.',
      });
    }
  };

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Enter Job Description</CardTitle>
          <CardDescription>
            Paste the full text of a job description you want to analyze.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Textarea
              name="jobDescription"
              placeholder="Paste job description here..."
              className="min-h-[200px] text-base"
              required
            />
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      <OutputCard result={state} onCopy={handleCopy} />
    </div>
  );
}

function OutputCard({ result, onCopy }: { result: ActionResult; onCopy: () => void }) {
  const { pending } = useFormStatus();

  const renderList = (items: string[]) => (
    <ul className="list-disc space-y-2 pl-5 text-base text-muted-foreground">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>AI-Generated Analysis</CardTitle>
          <CardDescription>
            Here is a summary and the key terms from the job post.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
          disabled={pending || !result.summary}
          aria-label="Copy results to clipboard"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {pending ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-4">
               <Skeleton className="h-6 w-1/4" />
               <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
               </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">
                Key Terms & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          result.summary && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-primary sm:text-3xl font-headline">
                  🔎 {result.summary.jobTitle}
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-base text-muted-foreground">
                    <span>📍 {result.summary.location}</span>
                    <span>💼 {result.summary.department}</span>
                    <span>📅 {result.summary.jobType}</span>
                    {result.summary.rate && <span>💰 {result.summary.rate}</span>}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold font-headline">🏢 About Company</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {result.summary.aboutCompany}
                </p>
              </div>

               <div className="space-y-3">
                <h3 className="text-xl font-semibold font-headline">🎯 Role Overview</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {result.summary.roleOverview}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold font-headline">🛠️ Key Responsibilities</h3>
                {renderList(result.summary.keyResponsibilities)}
              </div>

               <div className="space-y-3">
                <h3 className="text-xl font-semibold font-headline">✅ What You Bring</h3>
                 {renderList(result.summary.qualifications)}
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2 font-headline">
                  Key Terms & Technologies
                </h3>
                {result.summary.keyTerms && result.summary.keyTerms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.summary.keyTerms.map((term, index) => (
                      <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                        {term}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No key terms extracted.</p>
                )}
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
