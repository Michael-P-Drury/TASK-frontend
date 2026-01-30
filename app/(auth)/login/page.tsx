'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({ username: '', password: '' });

  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token');
    if (jwtToken) {
      router.push('/account');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    const response = await fetch('http://127.0.0.1:8000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.status == 200) {
      Cookies.set('jwt_token', data.jwt_token, { expires: 1 });
  
      alert(data.message);
      router.push('/account');
    }
    else {
      alert(data.message);
    }

  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
            <input 
              type="username" 
              placeholder="Username" 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button type="submit" style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>Sign In</button>
        </form>
        <p>Need an account?</p>
        <a href="/signup"><button type="button" style={{ padding: '10px', cursor: 'pointer' }}>Create account</button></a>
    </main>
  );
}