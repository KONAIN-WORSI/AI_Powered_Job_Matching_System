import PyPDF2 as pdf

def parse_pdf(file_Obj):
    extracted_text = ""
    try:
        reader = pdf.PdfReader(file_Obj)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to parse PDF, ", {str(e)})

    return extracted_text.strip()
