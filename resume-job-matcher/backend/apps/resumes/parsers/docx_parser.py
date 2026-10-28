import docx

def parse_docx(file_Obj):
    extracted_text = ""
    try:
        reader = docx.Document(file_Obj)
        for para in reader.paragraphs:
            if para.text:
                extracted_text += para.text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to parse DOCX, ", {str(e)})

    return extracted_text.strip()
