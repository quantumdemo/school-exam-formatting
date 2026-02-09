# Exam Formatter

A professional web application for secondary school teachers to format examination papers into a standard academic layout (WAEC style).

## Visionary Idea
This project was brought to life based on a visionary idea by **Afeez Alomi Olalekan**, aimed at empowering teachers and simplifying academic administration.

## Features
- **Pasted Text Parsing:** Automatically transforms raw, poorly spaced text into a structured exam document.
- **Section A (Objectives):** Auto-numbered questions with aligned options (A-E).
- **Section B (Theory):** Questions labeled as "QUESTION ONE", "QUESTION TWO", etc., with sub-questions (a, b, c) and aligned marks.
- **Academic Styling:** Professional header, metadata line, and Times New Roman font.
- **Preview & Export:** Real-time preview with PDF and DOCX download options.
- **Landing Page:** Includes an "About" section explaining the mission and a "Contact" section for support.

## How to Run Locally

Due to the use of Modern JavaScript (ES Modules), opening `index.html` directly in your browser (`file://`) may be blocked by security settings (CORS). Please use one of the following methods:

### Method 1: Using Python (Easiest)
1. Open your terminal or command prompt in the project folder.
2. Run: `python -m http.server 8000` (or `python3` on Mac/Linux).
3. Open your browser and go to: `http://localhost:8000`

### Method 2: Using VS Code Live Server
1. Open the folder in VS Code.
2. If you have the "Live Server" extension installed, click **"Go Live"** at the bottom right.

### Method 3: Using Node.js
1. Run: `npx serve .`
2. Open the URL provided (usually `http://localhost:3000`).

## Tech Stack
- HTML, CSS (Tailwind CSS for UI), JavaScript
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for PDF generation
- [docx](https://github.com/dolanmiu/docx) for DOCX generation
