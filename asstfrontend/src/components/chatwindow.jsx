import ChatMessage from "./chatmessage";
import EmptyState from "./emptystate";


function ChatWindow({ messages, loading }) {

    if (messages.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto">
                <EmptyState />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                    />
                ))}

                {loading && (
                    <div className="flex items-center gap-3 mt-6">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm">
                            AI
                        </div>
                        <div className="text-sm text-zinc-500">
                            Researching your documents...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


export default ChatWindow;