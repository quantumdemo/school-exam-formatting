import { parseObjectives, parseTheory } from './parser.js';

document.getElementById('generateBtn').addEventListener('click', showDocument);
document.getElementById('backBtn').addEventListener('click', showEditor);
document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);
document.getElementById('downloadDocxBtn').addEventListener('click', downloadDocx);
document.getElementById('loadSampleBtn').addEventListener('click', loadSample);

function showDocument() {
    generatePreview();
    document.querySelector('.input-section').classList.add('hidden');
    document.getElementById('previewSection').classList.add('active');
    window.scrollTo({ top: document.getElementById('app-main').offsetTop - 20, behavior: 'smooth' });
}

function showEditor() {
    document.querySelector('.input-section').classList.remove('hidden');
    document.getElementById('previewSection').classList.remove('active');
}

function loadSample() {
    document.getElementById('schoolName').value = "ST. ANTHONY'S COLLEGE, LAGOS";
    document.getElementById('managementLine').value = "123 Academic Way, Yaba, Lagos State. P.O. Box 456";
    document.getElementById('examTitle').value = "FIRST TERM EXAMINATION 2023/2024 SESSION";
    document.getElementById('sessionTerm').value = "2023/2024 SESSION - FIRST TERM";
    document.getElementById('className').value = "SS 3";
    document.getElementById('subject').value = "PHYSICS";
    document.getElementById('timeAllowed').value = "2 HOURS 30 MINUTES";

    document.getElementById('sectionA').value = `1. Which of the following is a fundamental quantity?
A. Velocity B. Acceleration C. Mass D. Force
2. The SI unit of temperature is _______
A. Celsius B. Fahrenheit C. Kelvin D. Joule
3. What is the value of acceleration due to gravity on earth?
A. 10m/s B. 9.8m/s² C. 1.6m/s² D. 20m/s²`;

    document.getElementById('sectionB').value = `1. (a) Define a projectile. [2 marks]
(b) State two applications of projectiles in daily life. [4 marks]
2. (a) What is work done? [2 marks]
(b) A boy of mass 50kg climbs a staircase of height 5m. Calculate the work done. [take g = 10m/s²] [6 marks]`;

    generatePreview();
}

function getFormData() {
    return {
        schoolName: document.getElementById('schoolName').value.trim(),
        managementLine: document.getElementById('managementLine').value.trim(),
        examTitle: document.getElementById('examTitle').value.trim(),
        sessionTerm: document.getElementById('sessionTerm').value.trim(),
        className: document.getElementById('className').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        timeAllowed: document.getElementById('timeAllowed').value.trim(),
        objectives: parseObjectives(document.getElementById('sectionA').value),
        theory: parseTheory(document.getElementById('sectionB').value)
    };
}

function generatePreview() {
    const data = getFormData();
    renderPreview(data);
}

function renderPreview(data) {
    const preview = document.getElementById('examPreview');
    preview.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'exam-header';

    const sName = document.createElement('div');
    sName.className = 'school-name';
    sName.textContent = data.schoolName || 'NAME OF SCHOOL';
    header.appendChild(sName);

    const mLine = document.createElement('div');
    mLine.className = 'management-line';
    mLine.textContent = data.managementLine || 'Management Line / Address';
    header.appendChild(mLine);

    const eTitle = document.createElement('div');
    eTitle.className = 'exam-title';
    eTitle.textContent = (data.examTitle || 'EXAMINATION TITLE').toUpperCase();
    header.appendChild(eTitle);

    const sTerm = document.createElement('div');
    sTerm.className = 'session-term';
    sTerm.textContent = data.sessionTerm || 'SESSION / TERM';
    header.appendChild(sTerm);

    preview.appendChild(header);

    const meta = document.createElement('div');
    meta.className = 'exam-meta';

    const mClass = document.createElement('div');
    mClass.textContent = `CLASS: ${data.className || '________'}`;
    meta.appendChild(mClass);

    const mSubj = document.createElement('div');
    mSubj.textContent = `SUBJECT: ${data.subject || '________'}`;
    meta.appendChild(mSubj);

    const mTime = document.createElement('div');
    mTime.textContent = `TIME: ${data.timeAllowed || '________'}`;
    meta.appendChild(mTime);

    preview.appendChild(meta);

    // Section A
    if (data.objectives.length > 0) {
        const secAHeader = document.createElement('div');
        secAHeader.className = 'section-heading';
        secAHeader.textContent = 'SECTION A: OBJECTIVE QUESTIONS';
        preview.appendChild(secAHeader);

        const secAInst = document.createElement('div');
        secAInst.className = 'instruction';
        secAInst.textContent = 'Instruction: Answer all questions in this section.';
        preview.appendChild(secAInst);

        data.objectives.forEach((q, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'objective-question';

            const qText = document.createElement('div');
            qText.textContent = `${index + 1}. ${q.text}`;
            qDiv.appendChild(qText);

            if (q.options.length > 0) {
                const optGrid = document.createElement('div');
                optGrid.className = 'options-grid';
                q.options.forEach(opt => {
                    const optDiv = document.createElement('div');
                    optDiv.textContent = `(${opt.label}) ${opt.text}`;
                    optGrid.appendChild(optDiv);
                });
                qDiv.appendChild(optGrid);
            }
            preview.appendChild(qDiv);
        });
    }

    // Section B
    if (data.theory.length > 0) {
        const secBHeader = document.createElement('div');
        secBHeader.className = 'section-heading';
        secBHeader.textContent = 'SECTION B: THEORY';
        preview.appendChild(secBHeader);

        const secBInst = document.createElement('div');
        secBInst.className = 'instruction';
        secBInst.textContent = 'Instruction: Answer all questions in this section unless otherwise stated.';
        preview.appendChild(secBInst);

        const numberWords = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN", "TWENTY"];

        data.theory.forEach((q, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'theory-question';

            const qTitle = document.createElement('div');
            qTitle.className = 'theory-q-title';
            qTitle.textContent = `QUESTION ${numberWords[index] || (index + 1)}`;
            qDiv.appendChild(qTitle);

            if (q.text) {
                const qContent = document.createElement('div');
                qContent.className = 'flex justify-between items-start';

                const qMainText = document.createElement('span');
                qMainText.className = 'flex-grow';
                qMainText.textContent = q.text;
                qContent.appendChild(qMainText);

                if (q.marks) {
                    const qMarks = document.createElement('span');
                    qMarks.className = 'marks ml-4';
                    qMarks.textContent = `[${q.marks}]`;
                    qContent.appendChild(qMarks);
                }
                qDiv.appendChild(qContent);
            }

            q.subQuestions.forEach(sub => {
                const subDiv = document.createElement('div');
                subDiv.className = 'sub-question flex justify-between items-start';

                const subText = document.createElement('span');
                subText.className = 'flex-grow';
                subText.textContent = `(${sub.label}) ${sub.text}`;
                subDiv.appendChild(subText);

                if (sub.marks) {
                    const subMarks = document.createElement('span');
                    subMarks.className = 'marks ml-4';
                    subMarks.textContent = `[${sub.marks}]`;
                    subDiv.appendChild(subMarks);
                }
                qDiv.appendChild(subDiv);
            });

            preview.appendChild(qDiv);
        });
    }
}

function downloadPdf() {
    const element = document.getElementById('examPreview');
    const data = getFormData();

    if (!data.schoolName && data.objectives.length === 0 && data.theory.length === 0) {
        alert('Please fill in the exam details and generate a preview first!');
        return;
    }

    const filename = `${data.subject || 'Exam'}_${data.className || ''}_Paper.pdf`.replace(/\s+/g, '_');

    const opt = {
        margin:       [12.7, 12.7, 12.7, 12.7],
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

async function downloadDocx() {
    const data = getFormData();
    if (!data.schoolName && data.objectives.length === 0 && data.theory.length === 0) {
        alert('Please fill in the exam details and generate a preview first!');
        return;
    }

    if (!window.docx) {
        alert('Word document library not loaded. Please check your internet connection and refresh.');
        return;
    }

    const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, UnderlineType, TabStopType } = window.docx;

    try {
        const children = [];

    // Header
    children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: data.schoolName || 'NAME OF SCHOOL', bold: true, size: 32, font: "Times New Roman" })],
    }));
    children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: data.managementLine || 'Management Line / Address', italics: true, size: 20, font: "Times New Roman" })],
    }));
    children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [new TextRun({ text: (data.examTitle || 'EXAMINATION TITLE').toUpperCase(), bold: true, size: 28, font: "Times New Roman" })],
    }));
    children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: data.sessionTerm || 'SESSION / TERM', size: 24, font: "Times New Roman" })],
    }));

    // Meta line
    children.push(new Paragraph({
        border: { bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 300, after: 300 },
        children: [
            new TextRun({
                text: `CLASS: ${data.className || '________'}    SUBJECT: ${data.subject || '________'}    TIME: ${data.timeAllowed || '________'}`,
                bold: true,
                size: 24,
                font: "Times New Roman"
            })
        ],
    }));

    // Section A
    if (data.objectives.length > 0) {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            children: [new TextRun({ text: "SECTION A: OBJECTIVE QUESTIONS", bold: true, underline: { type: UnderlineType.SINGLE }, size: 26, font: "Times New Roman" })],
        }));
        children.push(new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun({ text: "Instruction: Answer all questions in this section.", italics: true, size: 22, font: "Times New Roman" })],
        }));

        data.objectives.forEach((q, index) => {
            const textLines = q.text.split('\n');
            const textRuns = [new TextRun({ text: `${index + 1}. `, size: 24, font: "Times New Roman" })];
            textLines.forEach((line, i) => {
                textRuns.push(new TextRun({ text: line, size: 24, font: "Times New Roman", break: i > 0 ? 1 : 0 }));
            });

            children.push(new Paragraph({
                spacing: { before: 150 },
                children: textRuns,
            }));

            if (q.options.length > 0) {
                for (let i = 0; i < q.options.length; i += 2) {
                    const opt1 = q.options[i];
                    const opt2 = q.options[i+1];
                    let lineText = `(${opt1.label}) ${opt1.text}`;
                    if (opt2) {
                        lineText += " ".repeat(20) + `(${opt2.label}) ${opt2.text}`;
                    }
                    children.push(new Paragraph({
                        indent: { left: 720 },
                        children: [new TextRun({ text: lineText, size: 24, font: "Times New Roman" })],
                    }));
                }
            }
        });
    }

    // Section B
    if (data.theory.length > 0) {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 500 },
            children: [new TextRun({ text: "SECTION B: THEORY", bold: true, underline: { type: UnderlineType.SINGLE }, size: 26, font: "Times New Roman" })],
        }));
        children.push(new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun({ text: "Instruction: Answer all questions in this section unless otherwise stated.", italics: true, size: 22, font: "Times New Roman" })],
        }));

        const numberWords = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN", "TWENTY"];

        data.theory.forEach((q, index) => {
            children.push(new Paragraph({
                spacing: { before: 300 },
                children: [new TextRun({ text: `QUESTION ${numberWords[index] || (index+1)}`, bold: true, size: 24, font: "Times New Roman" })],
            }));

            if (q.text) {
        const textLines = q.text.split('\n');
        const textRuns = [];
        textLines.forEach((line, i) => {
            textRuns.push(new TextRun({ text: line, size: 24, font: "Times New Roman", break: i > 0 ? 1 : 0 }));
        });

                children.push(new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
                    children: [
                ...textRuns,
                        ...(q.marks ? [
                            new TextRun({ text: "\t", size: 24 }),
                            new TextRun({ text: `[${q.marks}]`, bold: true, size: 24, font: "Times New Roman" })
                        ] : [])
                    ],
                }));
            }

            q.subQuestions.forEach(sub => {
        const textLines = sub.text.split('\n');
        const textRuns = [new TextRun({ text: `(${sub.label}) `, size: 24, font: "Times New Roman" })];
        textLines.forEach((line, i) => {
            textRuns.push(new TextRun({ text: line, size: 24, font: "Times New Roman", break: i > 0 ? 1 : 0 }));
        });

                children.push(new Paragraph({
                    indent: { left: 720 },
            tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
                    children: [
                ...textRuns,
                        ...(sub.marks ? [
                            new TextRun({ text: "\t", size: 24 }),
                            new TextRun({ text: `[${sub.marks}]`, bold: true, size: 24, font: "Times New Roman" })
                        ] : [])
                    ],
                }));
            });
        });
    }

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 720,
                        right: 720,
                        bottom: 720,
                        left: 720,
                    },
                },
            },
            children: children,
        }],
    });

        const blob = await Packer.toBlob(doc);
        const filename = `${data.subject || 'Exam'}_${data.className || ''}_Paper.docx`.replace(/\s+/g, '_');

        if (typeof saveAs !== 'undefined') {
            saveAs(blob, filename);
        } else {
            // Fallback for saving blob
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Error generating Word document:', error);
        alert('An error occurred while generating the Word document. Please try again.');
    }
}
