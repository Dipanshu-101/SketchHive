import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import {
  Pencil,
  Users2,
  Share2,
  Download,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function App() {
  return (
    
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Pencil className="h-4 w-4" />
            </div>

            <span className="text-xl font-bold">SketchHive</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="primary" size = "sm">Sign In</Button>
            </Link>

            <Link href="/signup">
              <Button variant="primary" size = "sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full border bg-muted px-4 py-1 text-sm text-muted-foreground">
          Collaborative Whiteboard
        </span>

        <h1 className="mt-8 text-5xl font-bold leading-tight md:text-7xl">
          Draw ideas,
          <br />
          <span className="text-primary">together.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          SketchHive is a collaborative whiteboard where teams brainstorm,
          design diagrams, and work together in real time.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" variant="primary">
              Start Drawing
            </Button>
          </Link>

          <Button variant="outline" size="lg">
            <BookOpen className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        {/* Canvas Preview */}
        
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <Card className="p-6">
            <Share2 className="mb-4 h-6 w-6 text-primary" />

            <h3 className="font-semibold">
              Realtime Sync
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Everyone sees updates instantly.
            </p>
          </Card>

          <Card className="p-6">
            <Users2 className="mb-4 h-6 w-6 text-primary" />

            <h3 className="font-semibold">
              Multiplayer
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Collaborate with your whole team.
            </p>
          </Card>

          <Card className="p-6">
            <Pencil className="mb-4 h-6 w-6 text-primary" />

            <h3 className="font-semibold">
              Infinite Canvas
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Keep drawing without limits.
            </p>
          </Card>

          <Card className="p-6">
            <Download className="mb-4 h-6 w-6 text-primary" />

            <h3 className="font-semibold">
              Export
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Save your work as PNG or SVG.
            </p>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">

          <p>
            © {new Date().getFullYear()} SketchHive. Built with Next.js,
            WebSockets & Prisma.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-foreground"
            >
              <BookOpen className="h-5 w-5" />
            </a>

            <Link
              href="/signin"
              className="transition hover:text-foreground"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="transition hover:text-foreground"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </footer>
    </div>
  );
}