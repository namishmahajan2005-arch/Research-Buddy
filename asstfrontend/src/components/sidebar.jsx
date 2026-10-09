import { Plus, FileText, Upload, Loader2 } from "lucide-react";

function Sidebar({ documents = [], recentChats=[], onUpload, uploading, onNewChat }) {

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (file) {
            onUpload(file);
        }
        event.target.value = "";
    };

    return (
        <aside className="w-64 shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col">

            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className= "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium transition">
                    <Plus size={17} />
                    New Chat
                </button>
            </div>

            <div className="px-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs uppercase tracking-wider text-zinc-500">
                        Research Papers
                    </h2>

                    <label
                        htmlFor="pdf-upload"
                        className="cursor-pointer p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300" title="Upload PDF">
                        {uploading ? (
                            <Loader2
                                size={16}
                                className="animate-spin"
                            />
                        ) : (
                            <Upload size={16} />
                        )}
                    </label>

                    <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </div>

                {documents.length === 0 ? (
                    <div className="border border-dashed border-zinc-800 rounded-lg p-4 text-center">
                        <FileText
                            size={20}
                            className="mx-auto text-zinc-700 mb-2"
                        />
                        <p className="text-xs text-zinc-600">
                            No research papers
                        </p>
                        <p className="text-xs text-zinc-700 mt-1">
                            Upload a PDF to get started
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {documents.map(
                            (document, index) => (
                                <div
                                    key={`${document}-${index}`}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-900">

                                    <FileText
                                        size={16}
                                        className=" text-violet-400 shrink-0"
                                    />
                                    <span className="text-sm text-zinc-400 truncate">
                                        {document}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
              <div className="px-4 mt-8">
                  <h2 className=" text-xs uppercase tracking-wider text-zinc-500 mb-3">Recent Chats</h2>
                  {recentChats.length === 0 ? (
                      <p className=" text-xs text-zinc-700 px-3">No recent chats</p>
                  ) : (
                      <div className="space-y-1">
                          {recentChats.map((chat, index) => (
                              <button
                                  key={`${chat}-${index}`}
                                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-900 transition">
                                  <p className="text-sm text-zinc-400 truncate">
                                      {chat}
                                  </p>
                              </button>
                          ))}
                      </div>
                  )}
              </div>

            <div className="mt-auto p-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-600">
                    ResearchAI
                </p>
                <p className="text-xs text-zinc-700 mt-1">
                    AI Research Assistant
                </p>
            </div>
        </aside>
    );
}


export default Sidebar;