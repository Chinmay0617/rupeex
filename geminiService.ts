import { Transaction, AdvisorMessage } from "./types";

const API_BASE_URL = 'http://localhost:5000/api/gemini';

// Helper to get token
const getToken = () => {
    const session = localStorage.getItem('fintrack_session');
    return session ? JSON.parse(session).token : '';
};

export async function parseNaturalLanguageTransaction(text: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/parse-transaction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': getToken()
        },
        body: JSON.stringify({ text }),
    });
    if (!response.ok) {
        throw new Error('Failed to parse transaction');
    }
    return response.json();
}

export async function askAdvisor(query: string, history: Transaction[], messages: AdvisorMessage[]): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/ask-advisor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': getToken()
        },
        body: JSON.stringify({ query, history, messages }),
    });
    if (!response.ok) {
        throw new Error('Failed to get advice');
    }
    return response.text();
}

export async function scanReceipt(base64WithHeader: string, mimeType: string = 'image/jpeg'): Promise<any> {
    const base64Data = base64WithHeader.split(',')[1];
    const response = await fetch(`${API_BASE_URL}/scan-receipt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': getToken()
        },
        body: JSON.stringify({ image: base64Data, mimeType }),
    });

    if (!response.ok) {
        const text = await response.text();
        try {
            const errorData = JSON.parse(text);
            throw new Error(errorData?.error || 'Failed to scan receipt');
        } catch (e: any) {
            // If it's not JSON, it might be an HTML error page or raw text
            // If we already parsed it as JSON successfully, throw that error (re-throw)
            if (e.message !== 'Unexpected token' && e.message.indexOf('JSON') === -1) {
                throw e;
            }
            throw new Error(`Server Error (${response.status}): ${text.slice(0, 100)}...`);
        }
    }
    return response.json();
}