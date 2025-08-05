import JobParaphraser from '@/components/job-paraphraser';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start bg-background p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
            Job Paraphraser
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Paste a job description below to get an AI-powered summary and extract key terms.
          </p>
        </header>
        <JobParaphraser />
      </div>
    </main>
  );
}
