import os
from dotenv import load_dotenv

from pypdf import PdfReader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_chroma import Chroma

from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate


load_dotenv()

if not os.getenv("GEMINI_API_KEY"):
    raise ValueError("GEMINI_API_KEY not found in .env")

embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-2")

llm = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0.2)

conversation_history = []
max_size_history = 20

chroma_path="storage/chroma"

os.makedirs("storage", exist_ok=True)


vectorstore = Chroma(persist_directory=chroma_path, embedding_function=embeddings)

retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

prompt = ChatPromptTemplate.from_template(
    """
You are an AI research assistant.

Answer the user's question using the research context
and the conversation history.

Rules:
1. Use the research context as the primary source of factual information.
2. Use conversation history to understand references such as
   "it", "they", "this method", "the previous paper", etc.
3. Do not invent information that is not supported by the
   research context.
4. If the required information is not present in the research
   documents, clearly say that it is not available.
5. Give a concise and technically accurate answer.

Conversation History:
{history}

Research Context:
{context}

Current Question:
{question}

Answer:
"""
)

def delete_pdf(filename):
    results = vectorstore.get(
        where={"source": filename},
        include=["metadatas"]
    )
    ids = results["ids"]
    
    if ids:
        vectorstore.delete(ids=ids)
        print(f"Deleted {len(ids)} chunks for {filename}")

    file_path = os.path.join("data", filename)

    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Deleted PDF: {filename}")

def process_pdf(file_path):
    data_path="data"
    os.makedirs(data_path, exist_ok=True)

    filename = os.path.basename(file_path)

    pdf_files = sorted(
        [
            f for f in os.listdir(data_path)
            if f.lower().endswith(".pdf")
        ],
        key=lambda f: os.path.getctime(os.path.join(data_path, f))
    )

    if filename not in pdf_files and len(pdf_files) >= 3:
        oldest_pdf = pdf_files[0]
        delete_pdf(oldest_pdf)

    documents = []

    reader = PdfReader(file_path)

    for page_number, page in enumerate(reader.pages):

        text = page.extract_text()

        if text and text.strip():

            documents.append(
                Document(
                    page_content=text,
                    metadata={
                        "source": os.path.basename(file_path),
                        "page": page_number
                    }
                )
            )


    print(f"Loaded {len(documents)} pages")

    if not documents:
        raise ValueError(
            "No usable text was extracted from the PDF."
        )

    chunks = text_splitter.split_documents(documents)

    print(f"Created {len(chunks)} chunks")

    if not chunks:
        raise ValueError(
            "No text chunks were created from the PDF."
        )

    vectorstore.add_documents(chunks)

    print("Document added to vector database")

    return {
        "pages": len(documents),
        "chunks": len(chunks)
    }

def ask_question(question):

    relevant_docs = retriever.invoke(question)

    context = "\n\n".join(doc.page_content for doc in relevant_docs)

    history=""

    for item in conversation_history:
        history+=f"""
        User: {item["question"]}
        Assistant: {item["answer"]}
        """
    
    formatted_prompt = prompt.invoke({"history":history,"context": context, "question": question})

    response = llm.invoke(formatted_prompt)

    conversation_history.append({"question":question,"answer":response.content})
    if len(conversation_history)>max_size_history:
        conversation_history.pop(0)

    return {"answer":response.text}