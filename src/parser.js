/**
 * Parses objective questions from raw text.
 * Expected format: 1. Question? A. Option 1 B. Option 2...
 */
export function parseObjectives(text) {
    if (!text.trim()) return [];

    // Improved regex to find question starts at the beginning of lines or after newline
    // Supports "1.", "1)", "1 " and optional "Question 1"
    const questionRegex = /(?:^|\n)\s*(?:Question\s+)?(\d+)[\.\)\s]/gi;
    const markers = [];
    let match;
    while ((match = questionRegex.exec(text)) !== null) {
        markers.push({
            index: match.index,
            number: match[1],
            fullMatch: match[0]
        });
    }

    if (markers.length === 0) return [];

    const questions = [];
    for (let i = 0; i < markers.length; i++) {
        const start = markers[i].index + markers[i].fullMatch.length;
        const end = (i + 1 < markers.length) ? markers[i+1].index : text.length;
        const fullContent = text.substring(start, end).trim();

        // Find options A, B, C, D, E
        // Look for (A) or A. or A)
        const optionsRegex = /(?:\s+|^)\(?([A-E])[\.\)\s]\s+/g;
        const options = [];
        let optMatch;
        const optionMatches = [];
        while ((optMatch = optionsRegex.exec(fullContent)) !== null) {
            optionMatches.push({
                index: optMatch.index,
                label: optMatch[1],
                fullMatch: optMatch[0]
            });
        }

        let questionText = "";
        if (optionMatches.length > 0) {
            questionText = fullContent.substring(0, optionMatches[0].index).trim();
            for (let j = 0; j < optionMatches.length; j++) {
                const oStart = optionMatches[j].index + optionMatches[j].fullMatch.length;
                const oEnd = (j + 1 < optionMatches.length) ? optionMatches[j+1].index : fullContent.length;
                options.push({
                    label: optionMatches[j].label,
                    text: fullContent.substring(oStart, oEnd).trim().replace(/\s+/g, ' ')
                });
            }
        } else {
            questionText = fullContent;
        }

        questions.push({
            number: markers[i].number,
            text: questionText.replace(/\s+/g, ' '),
            options: options
        });
    }
    return questions;
}

/**
 * Parses theory questions from raw text.
 * Expected format: 1. Question (a) Sub 1 (b) Sub 2 [10 marks]
 */
export function parseTheory(text) {
    if (!text.trim()) return [];

    const questionRegex = /(?:^|\n)\s*(?:Question\s+)?(\d+)[\.\)\s]/gi;
    const markers = [];
    let match;
    while ((match = questionRegex.exec(text)) !== null) {
        markers.push({
            index: match.index,
            number: match[1],
            fullMatch: match[0]
        });
    }

    if (markers.length === 0) return [];

    const questions = [];
    for (let i = 0; i < markers.length; i++) {
        const start = markers[i].index + markers[i].fullMatch.length;
        const end = (i + 1 < markers.length) ? markers[i+1].index : text.length;
        const fullContent = text.substring(start, end).trim();

        // Split by sub-questions (a), (b), (c)... or a. b. c.
        const subRegex = /(?:\s+|^)\(([a-h])\)\s+|(?:\s+|^)([a-h])[\.\)]\s+/g;
        const subMatches = [];
        let sMatch;
        while ((sMatch = subRegex.exec(fullContent)) !== null) {
            subMatches.push({
                index: sMatch.index,
                label: sMatch[1] || sMatch[2],
                fullMatch: sMatch[0]
            });
        }

        const subQuestions = [];
        let mainText = "";

        // Regex for marks like [10 marks], (5m), [2marks]
        const marksRegex = /[\[\(]\s*(\d+\s*marks?|marks?:\s*\d+|[\d\s]+m)\s*[\]\)]$/i;

        if (subMatches.length > 0) {
            mainText = fullContent.substring(0, subMatches[0].index).trim();
            for (let j = 0; j < subMatches.length; j++) {
                const sStart = subMatches[j].index + subMatches[j].fullMatch.length;
                const sEnd = (j + 1 < subMatches.length) ? subMatches[j+1].index : fullContent.length;
                const content = fullContent.substring(sStart, sEnd).trim();

                const marksMatch = content.match(marksRegex);
                const marks = marksMatch ? marksMatch[1] : null;
                const textWithoutMarks = marks ? content.replace(marksRegex, '').trim() : content;

                subQuestions.push({
                    label: subMatches[j].label,
                    text: textWithoutMarks.replace(/\s+/g, ' '),
                    marks
                });
            }
        } else {
            mainText = fullContent;
        }

        let marks = null;
        if (subQuestions.length === 0) {
            const marksMatch = mainText.match(marksRegex);
            marks = marksMatch ? marksMatch[1] : null;
            mainText = marks ? mainText.replace(marksRegex, '').trim() : mainText;
        }

        questions.push({
            number: markers[i].number,
            text: mainText.replace(/\s+/g, ' '),
            subQuestions,
            marks
        });
    }
    return questions;
}
