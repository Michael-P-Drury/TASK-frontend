'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

export default function ChatPage() {

    const router = useRouter()

    const [userPrompt, setUserPrompt] = useState('');

    useEffect(() => {
        const jwtToken = Cookies.get('jwt_token');
        if (!jwtToken) {
            router.push('/login');
        }

    }, [router]);


    const handleChatEnter = async () => {
        const jwtToken = Cookies.get('jwt_token');
        
        const response = await fetch('http://127.0.0.1:8000/chat/send_chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jwt_token: jwtToken, user_prompt: userPrompt }),
        });

        const data = await response.json();

        location.reload()
        
    };

    return (
    <div>
        <div className = "centered-page-div">
            <h1>Chat Page</h1>
        </div>

        <div className = "chat-input-div">
            <input className="chat-bar-input" type="text" placeholder="Chat..." onChange={(e) => setUserPrompt(e.target.value)} />
            <button className="chat-input-button" onClick={handleChatEnter}>Send</button>
        </div>
    </div>
  );

}

