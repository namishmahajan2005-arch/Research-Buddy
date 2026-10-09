const API_URL = "http://127.0.0.1:8000";


export async function askQuestion(question) {
    const response = await fetch(`${API_URL}/ask`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            question: question,
        }),
    });


    if (!response.ok) {
        throw new Error(
            `Request failed with status ${response.status}`
        );
    }


    const data = await response.json();

    return data;
}

export async function uploadDocument(file) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {

        const error = await response.json();

        throw new Error(
            error.detail || "Upload failed"
        );
    }

    const data=await response.json()

    return data;
}

export async function getDocuments() {

    const response = await fetch(
        `${API_URL}/documents`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch documents");
    }

    const data=await response.json()

    return data;
}