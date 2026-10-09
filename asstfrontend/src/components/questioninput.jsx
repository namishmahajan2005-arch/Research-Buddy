import { useState } from "react";
import { ArrowUp } from "lucide-react";


function QuestionInput({ onSubmit, disabled }) {

    const [question, setQuestion] = useState("");


    const handleSubmit = () => {

        if (!question.trim() || disabled) {
            return;
        }


        onSubmit(question.trim());

        setQuestion("");
    };


    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            handleSubmit();
        }
    };


    return (
        <div className="p-4 border-t border-zinc-800">

            <div className="max-w-4xl mx-auto">

                <div className="flex items-end gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-3">

                    <textarea
                        value={question}
                        onChange={(e) =>
                            setQuestion(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        placeholder="Ask about your research papers..."
                        rows={1}
                        className="flex-1 bg-transparent outline-none resize-none text-white placeholder-zinc-500"
                    />


                    <button
                        onClick={handleSubmit}
                        disabled={
                            disabled || !question.trim()
                        }
                        className="p-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40"
                    >
                        <ArrowUp size={18} />
                    </button>

                </div>


                <p className="text-xs text-zinc-600 text-center mt-2">
                    ResearchAI can make mistakes. Verify important information.
                </p>

            </div>

        </div>
    );
}


export default QuestionInput;