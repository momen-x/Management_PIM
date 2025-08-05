// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import IPM from "@/app/images/PIM.png";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      {/* Hero */}
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Management Your Products
        </h1>

        {/* CTA */}
        <Link
          href="/management"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg text-lg font-semibold transition"
        >
          Get Started
        </Link>
      </div>

      {/* Hero Image */}
      <div className="mt-10">
        <Image
          src={IPM}
          alt="Hero"
          width={400}
          height={450}
          className="rounded-xl shadow-2xl"
          priority
        />
      </div>

      {/* Features */}
      <section className="mt-20 grid gap-8 md:grid-cols-3 max-w-5xl">
        {[
          {
            title: "⚡ Blazing Fast",
            text: "Built on Next.js 14 with App Router & Server Actions.",
          },
          {
            title: "🔒 Secure",
            text: "Edge runtime, TypeScript & fully typed APIs.",
          },
          {
            title: "🎨 Beautiful",
            text: "Tailwind CSS + shadcn/ui for pixel-perfect UI.",
          },
        ].map((f) => (
          <div key={f.title} className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-400">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-24 text-sm text-slate-500">
        © {new Date().getFullYear()} [Your-Name-or-Company] •{" "}
        <a
          href="https://github.com/your-org/[project-name]"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </footer>
    </main>
  );
}
