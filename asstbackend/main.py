import os
import shutil

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

from rag import ask_question, process_pdf

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://research-buddy-nu.vercel.app/",
        "https://research-buddy-2.onrender.com/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "Research Assistant API is running"}


@app.post("/ask")
def ask(request: QuestionRequest):

    question = request.question
    result=ask_question(question)

    return result


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    os.makedirs("data", exist_ok=True)

    file_path = os.path.join("data", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer )

    try:
        result = process_pdf(file_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "pages": result["pages"],
        "chunks": result["chunks"]
    }

@app.get("/documents")
def get_documents():

    documents = []

    data_path = "data"

    if os.path.exists(data_path):

        for filename in os.listdir(data_path):

            if filename.lower().endswith(".pdf"):

                documents.append(filename)


    return {
        "documents": documents
    }