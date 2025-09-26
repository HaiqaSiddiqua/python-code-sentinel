
import { GoogleGenAI, Type } from "@google/genai";
import type { BugReportItem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const bugDetectionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            line_number: {
                type: Type.STRING,
                description: 'The line number where the bug is located, or a range (e.g., "10-15"). Can be "N/A" for general issues.'
            },
            severity: {
                type: Type.STRING,
                enum: ['Critical', 'High', 'Medium', 'Low', 'Information'],
                description: 'The severity of the potential bug.'
            },
            bug_description: {
                type: Type.STRING,
                description: 'A clear and concise description of the bug or code smell.'
            },
            suggested_fix: {
                type: Type.STRING,
                description: 'A detailed explanation of how to fix the bug, with code examples if necessary.'
            }
        },
        required: ['line_number', 'severity', 'bug_description', 'suggested_fix']
    }
};

export const detectBugs = async (code: string): Promise<BugReportItem[]> => {
    const systemInstruction = `You are a world-class expert in Python static analysis and code review. Your task is to analyze the provided Python code for bugs, security vulnerabilities, performance issues, and deviations from best practices (PEP 8). Provide a detailed report in a structured JSON format. Identify logical errors, potential runtime exceptions, and unsafe coding patterns.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please analyze the following Python code:\n\n\`\`\`python\n${code}\n\`\`\``,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: bugDetectionSchema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as BugReportItem[];

    } catch (error) {
        console.error("Error in detectBugs:", error);
        throw new Error("Failed to communicate with the Gemini API for bug detection.");
    }
};

export const generateTests = async (code: string): Promise<string> => {
    const systemInstruction = `You are a Senior Software Engineer in Test (SDET) specializing in Python. Your task is to write a comprehensive suite of unit tests for the provided Python code using the built-in 'unittest' library.
    - Cover all public functions and methods.
    - Include test cases for normal operation (happy path), edge cases, and error conditions (e.g., invalid input).
    - Ensure the tests are self-contained and can be run directly.
    - The output must be a single, complete, and runnable Python script. Do not include any explanatory text outside of the code comments.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please generate unit tests for the following Python code:\n\n\`\`\`python\n${code}\n\`\`\``,
            config: {
                systemInstruction,
            }
        });
        
        const rawText = response.text;
        // Clean up markdown code block fences if they exist
        const cleanedText = rawText.replace(/^```python\n/, '').replace(/\n```$/, '').trim();
        return cleanedText;

    } catch (error) {
        console.error("Error in generateTests:", error);
        throw new Error("Failed to communicate with the Gemini API for test generation.");
    }
};
