import fitz
from fastapi import UploadFile


async def extract_pdf_text(file: UploadFile) -> str:
    pdf_bytes = await file.read()
    if not pdf_bytes:
        return ""

    document = fitz.open(stream=pdf_bytes, filetype="pdf")
    try:
        pages = [page.get_text() for page in document]
        return "\n".join(pages).strip()
    finally:
        document.close()
