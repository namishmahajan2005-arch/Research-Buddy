import { useEffect, useState } from "react";

import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import ChatWindow from "../components/chatwindow";
import QuestionInput from "../components/questioninput";

import {askQuestion, uploadDocument, getDocuments } from "../services/api";

function ResearchAssistant() {

    const [messages, setMessages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [recentChats, setRecentChats] = useState(() => {
        const savedChats =
            localStorage.getItem("recentChats");
        return savedChats
            ? JSON.parse(savedChats)
            : [];
    });

    useEffect(() => {
        localStorage.setItem(
            "recentChats",
            JSON.stringify(recentChats)
        );
    }, [recentChats]);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const data = await getDocuments();
                setDocuments(data.documents || []);
            } catch (error) {
                console.error(
                    "Failed to load documents:",
                    error
                );
            }
        };

        loadDocuments();
    }, []);

    const handleQuestion = async (question) => {
        if (!question.trim() || loading) {
            return;
        }

        setRecentChats((prev) => {
            const updated = [
                question,
                ...prev.filter((chat) => chat !== question)
            ];
            return updated.slice(0, 8);
        });

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: question,
            },
        ]);

        setLoading(true);

        try {
            const data = await askQuestion(question);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.answer,
                    sources: data.sources || [],
                },
            ]);

        } catch (error) {
            console.error("Question error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I couldn't process your question. Please try again.",
                    sources: [],
                },
            ]);

        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        if (!file) {
            return;
        }

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.");
            return;
        }

        setUploading(true);

        try {
            const data = await uploadDocument(file);

            setDocuments((prev) => {

                if (prev.includes(data.filename)) {
                    return prev;
                }

                return [
                    ...prev,
                    data.filename
                ];
            });

        } catch (error) {
            console.error("Upload error:", error);

            alert(error.message || "Failed to upload document.");

        } finally {
            setUploading(false);
        }
    };

    const handleNewChat = () => {
        setMessages([]);
    };

    return (

        <div className="h-screen bg-zinc-950 text-white">
            <Navbar
                documentCount={documents.length}
            />

            <div className="flex h-[calc(100vh-64px)]">

                <Sidebar
                    documents={documents}
                    recentChats={recentChats}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onNewChat={handleNewChat}
                />

                <main className="flex-1 flex flex-col min-w-0">
                    <ChatWindow
                        messages={messages}
                        loading={loading}
                    />

                    <QuestionInput
                        onSubmit={handleQuestion}
                        disabled={loading}
                    />
                </main>
            </div>
        </div>
    );
}


export default ResearchAssistant;