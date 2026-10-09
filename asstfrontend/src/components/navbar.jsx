import { Sparkles } from "lucide-react";

function Navbar() {
  return (
    <header className="h-16 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
            <Sparkles size={18} />
          </div>

          <div>
            <h1 className="text-sm font-semibold">
              ResearchAI
            </h1>

            <p className="text-xs text-zinc-500">
              AI Research Assistant
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;