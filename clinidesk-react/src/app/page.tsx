import ThemeToggle from "@/components/ui/ThemeToogle";
export default function Home() {
  return (
    <main className="bg-[--color-background] text-[--color-text-primary] min-h-screen flex flex-col items-center justify-center">
      <ThemeToggle />
      <div className="bg-[--color-primary] text-[--color-text-secondary] p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Next.js + Tailwind com 3 temas 🎨</h1>
      </div>
    </main>
  );
}
