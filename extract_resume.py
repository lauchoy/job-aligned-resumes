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
    pdf_path = "/Users/Apple/Documents/Resumes/Jimmy_Lau_Choy_Resumes_SWE.pdf"
    text = extract_text_from_pdf(pdf_path)
    if text:
        print(text)
    else:
        print("Failed to extract text from PDF")
