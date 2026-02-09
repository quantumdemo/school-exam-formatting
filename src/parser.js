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
        // We look for all potential markers and then find the best sequence.
        // We also check whitespace before the marker to avoid false positives like "Point A. is..."
        const optionsRegex = /(\s+|^)\(?([A-E])[\.\)\s]\s+/g;
        let allPotentialMatches = [];
        let optMatch;
        while ((optMatch = optionsRegex.exec(fullContent)) !== null) {
            const prefix = optMatch[1];
            const score = prefix.includes('\n') ? 10 : (prefix.length > 1 ? 5 : 1);
            allPotentialMatches.push({
                index: optMatch.index,
                label: optMatch[2].toUpperCase(),
                fullMatch: optMatch[0],
                score: score
            });
        }

        // Find the sequence A, B, C, D... that has the best score/length
        let bestSequence = [];
        let bestScore = -1;

        for (let j = 0; j < allPotentialMatches.length; j++) {
            if (allPotentialMatches[j].label === 'A') {
                let currentSeq = [allPotentialMatches[j]];
                let currentScore = allPotentialMatches[j].score;
                let lastLabel = 'A';
                for (let k = j + 1; k < allPotentialMatches.length; k++) {
                    const nextLabel = String.fromCharCode(lastLabel.charCodeAt(0) + 1);
                    if (allPotentialMatches[k].label === nextLabel) {
                        currentSeq.push(allPotentialMatches[k]);
                        currentScore += allPotentialMatches[k].score;
                        lastLabel = nextLabel;
                    }
                }

                // Heuristic: Prioritize longer sequences.
                // If lengths are equal, pick the one with the higher score.
                // If scores are also equal, pick the one that starts LATER (higher index)
                // as false positives like "Point A." usually appear early in the question.
                if (currentSeq.length > bestSequence.length ||
                   (currentSeq.length === bestSequence.length && currentScore > bestScore) ||
                   (currentSeq.length === bestSequence.length && currentScore === bestScore && currentSeq[0].index > (bestSequence[0]?.index || -1))) {
                    bestSequence = currentSeq;
                    bestScore = currentScore;
                }
            }
        }

        // If we found a sequence of at least 2 options, we treat them as the options
        // Otherwise, we might have false positives or just no options
        const optionMatches = bestSequence.length >= 2 ? bestSequence : [];
        const options = [];

        let questionText = "";
        if (optionMatches.length > 0) {
            questionText = fullContent.substring(0, optionMatches[0].index).trim();
            for (let j = 0; j < optionMatches.length; j++) {
                const oStart = optionMatches[j].index + optionMatches[j].fullMatch.length;
                const oEnd = (j + 1 < optionMatches.length) ? optionMatches[j+1].index : fullContent.length;
                options.push({
                    label: optionMatches[j].label,
                    text: fullContent.substring(oStart, oEnd).trim().replace(/[^\S\r\n]+/g, ' ')
                });
            }
        } else {
            questionText = fullContent;
        }

        questions.push({
            number: markers[i].number,
            text: questionText.replace(/[^\S\r\n]+/g, ' ').trim(),
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
        const subRegex = /(?:\s+|^)\(?([a-h])[\.\)]\s+/g;
        let allPotentialSubs = [];
        let sMatch;
        while ((sMatch = subRegex.exec(fullContent)) !== null) {
            allPotentialSubs.push({
                index: sMatch.index,
                label: sMatch[1].toLowerCase(),
                fullMatch: sMatch[0]
            });
        }

        let bestSubSeq = [];
        for (let j = 0; j < allPotentialSubs.length; j++) {
            if (allPotentialSubs[j].label === 'a') {
                let currentSeq = [allPotentialSubs[j]];
                let lastLabel = 'a';
                for (let k = j + 1; k < allPotentialSubs.length; k++) {
                    const nextLabel = String.fromCharCode(lastLabel.charCodeAt(0) + 1);
                    if (allPotentialSubs[k].label === nextLabel) {
                        currentSeq.push(allPotentialSubs[k]);
                        lastLabel = nextLabel;
                    }
                }
                if (currentSeq.length > bestSubSeq.length) {
                    bestSubSeq = currentSeq;
                }
            }
        }

        // For theory, even a single (a) is often a sub-question if it's at start or has space
        const subMatches = bestSubSeq;

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
                    text: textWithoutMarks.replace(/[^\S\r\n]+/g, ' '),
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
            text: mainText.replace(/[^\S\r\n]+/g, ' ').trim(),
            subQuestions,
            marks
        });
    }
    return questions;
}
