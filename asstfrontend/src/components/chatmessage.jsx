import { User, Bot } from "lucide-react";

function ChatMessage({ message }) {

    const isUser = message.role === "user";


    return (
        <div
            className={`flex gap-4 mb-8 ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >

            {!isUser && (
                <div className="w-8 h-8 shrink-0 rounded-full bg-violet-600 flex items-center justify-center">
                    <Bot size={17} />
                </div>
            )}


            <div
                className={`max-w-3xl ${
                    isUser
                        ? "bg-violet-600 rounded-2xl px-4 py-3"
                        : ""
                }`}
            >

                <p className="text-sm leading-7 whitespace-pre-wrap text-zinc-200">
                    {message.content}
                </p>

            </div>


            {isUser && (
                <div className="w-8 h-8 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User size={17} />
                </div>
            )}

        </div>
    );
}


export default ChatMessage;