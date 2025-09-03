#!/usr/bin/env python3

import pdfplumber
import sys

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using pdfplumber"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = ""
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
            return full_text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_resume.py <pdf_path>")
        print("Example: python extract_resume.py /path/to/resume.pdf")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    text = extract_text_from_pdf(pdf_path)
    if text:
        print(text)
    else:
        print("Failed to extract text from PDF")
