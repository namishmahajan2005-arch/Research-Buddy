import {FileSearch, GitCompare, Lightbulb, BookOpen,} from "lucide-react";

function EmptyState() {
  const suggestions = [
    {
      icon: FileSearch,
      title: "Ask about a concept",
      text: "What is PPLN and how does it work?",
    },
    {
      icon: GitCompare,
      title: "Compare research",
      text: "Compare the approaches used in the papers.",
    },
    {
      icon: BookOpen,
      title: "Find information",
      text: "What experimental setup was used?",
    },
    {
      icon: Lightbulb,
      title: "Explore findings",
      text: "What are the key conclusions?",
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-6">

      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20">
        <FileSearch
          size={30}
          className="text-violet-400"
        />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight">
        Research, without the noise.
      </h2>

      <p className="mt-2 max-w-lg text-center text-sm leading-6 text-zinc-500">
        Ask questions about your research papers and get
        context-aware answers backed by your documents.
      </p>

      <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">

        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-violet-500/30 hover:bg-white/[0.04]"
            >

              <Icon
                size={19}
                className="mb-3 text-zinc-500 transition group-hover:text-violet-400"
              />

              <p className="text-sm font-medium">
                {item.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                {item.text}
              </p>

            </button>
          );
        })}

      </div>

    </div>
  );
}

export default EmptyState;