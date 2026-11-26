import type { Metadata } from "next";
import Link from "next/link";
import { verifyUnsubscribe } from "@/lib/mailing";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

// The page an email's "Unsubscribe" link opens. It asks first: link scanners in mail systems open
// every link, and a plain visit must not take anyone off the list.
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; t?: string; done?: string; bad?: string; failed?: string }>;
}) {
  const p = await searchParams;
  const email = p.done ? null : verifyUnsubscribe(p.e, p.t);

  let title: string;
  let body: React.ReactNode;
  if (p.done) {
    title = "You're unsubscribed";
    body = <p>You won&apos;t get any more emails from me. If you sign up again on the site, you&apos;ll be back on the list.</p>;
  } else if (!email) {
    title = "This link doesn't work";
    body = (
      <p>
        It may have been cut off when it was copied. Open the Unsubscribe link from the email again, or just reply to the
        email and I&apos;ll take you off the list.
      </p>
    );
  } else {
    title = "Unsubscribe?";
    body = (
      <>
        <p>
          You&apos;ll stop getting emails at <strong className="text-foreground">{email}</strong>.
        </p>
        {p.failed ? <p className="text-[#c2415a]">That didn&apos;t go through. Please try again.</p> : null}
        <form method="post" action="/api/unsubscribe" className="mt-8">
          <input type="hidden" name="e" value={p.e} />
          <input type="hidden" name="t" value={p.t} />
          <input type="hidden" name="from" value="page" />
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-foreground text-background text-sm font-semibold transition-opacity active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39FF14]"
          >
            Unsubscribe
          </button>
        </form>
      </>
    );
  }

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-32">
      <div className="w-full max-w-md rounded-2xl border border-foreground/15 bg-card-bg/60 p-8 sm:p-10">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <div className="space-y-3 font-inter text-[15px] leading-relaxed text-foreground/70">{body}</div>
        <Link href="/" className="mt-8 inline-block text-sm text-foreground/60 underline underline-offset-4 hover:text-foreground">
          Back to taberickson.com
        </Link>
      </div>
    </main>
  );
}
