'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {

    const router = useRouter()

    const [userPrompt, setUserPrompt] = useState('');

    const [chatHistory, setChatHistory] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const getChatHistory = async () => {
        try {
            const jwtToken = Cookies.get('jwt_token');

            const seeFullChatHistory = Cookies.get('seeFullChatHistory');

            const endpoint = (seeFullChatHistory === 'true') ? 'http://127.0.0.1:8000/chat/get_full_chat_history' : 'http://127.0.0.1:8000/chat/get_condensed_chat_history';
            
            const response = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ jwt_token: jwtToken }),
            });

            const data = await response.json();

            if (data.status === 200) {
                setChatHistory(data.chat_history);
            }

        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };


    useEffect(() => {
        const jwtToken = Cookies.get('jwt_token');
        if (!jwtToken) {
            router.push('/login');
        }

        const seeFullChatHistory = Cookies.get('seeFullChatHistory');
        if (!seeFullChatHistory) {
            Cookies.set('seeFullChatHistory', 'true');
        }

        getChatHistory();

    }, [router]);


    const handleChatEnter = async () => {
        const jwtToken = Cookies.get('jwt_token');

        setIsLoading(true);
        
        const response = await fetch('http://127.0.0.1:8000/chat/send_chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jwt_token: jwtToken, user_prompt: userPrompt }),
        });

        const data = await response.json();

        setIsLoading(false);

        location.reload()
        
    };


    const handleToggleFullChat = async () => {
        
        const seeFullChatHistory = Cookies.get('seeFullChatHistory');
        if (seeFullChatHistory === 'true') {
            Cookies.set('seeFullChatHistory', 'false');
        }
        else {
            Cookies.set('seeFullChatHistory', 'true');
        }
        
        location.reload()
    };


    const handleClearChat = async () => {
        const jwtToken = Cookies.get('jwt_token');
        
        const response = await fetch('http://127.0.0.1:8000/chat/clear_chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jwt_token: jwtToken }),
        });

        const data = await response.json();

        location.reload()
        
    };

    return (
        <div className="centered-page-div">
            <div className="chat-header">
                <h1>Chat Page</h1>
                <button onClick={handleClearChat}>Clear Chat</button>
                <button onClick={handleToggleFullChat}>Toggle Full Chat</button>
            </div>

            <div className="chat-history">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {chatHistory}
                </ReactMarkdown>
            </div>

            <div className="chat-input-div">
                <input className="chat-bar-input" type="text" placeholder="Chat..." onChange={(e) => setUserPrompt(e.target.value)}/>
                <button  className="chat-input-button" onClick={handleChatEnter} disabled={isLoading}> Send </button>
            </div>
        </div>
    );

}

