from skill_extractor import extract_skills
from sentence_transformers import SentenceTransformer
from .parsers.pdf_parser import parse_pdf
from .parsers.docx_parser import parse_docx

print('Loading Sentence Transformer Model.....')
embedder = SentenceTransformer('all-MiniLM-L6-v2')


def process_resume_file(file_obj):
    file_name = file_obj.name.lower()

    if file_name.endswith('.pdf'):
        text = parse_pdf(file_obj)
    elif file_name.endswith('.docx'):
        text = parse_docx(file_obj)
    else:
        raise ValueError("Unsupported file support. Please upload files in PDF or DOCX format.")

    if not text:
        raise ValueError("Could not extract text from the document. It might be an empty or image-based file.")

    raw_skills = extract_skills(text)
    extracted_skills = list(set([skill.strip().lower() for skill in raw_skills]))
    embedding = embedder.encode(text).tolist()

    return {
        "raw_text": text,
        "extracted_skills": extracted_skills,
        "embeddings": embedding,
        "embedding_version": 'all-MiniLM-L6-v2'
    }