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
    <div className = "centered-page-div">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className = "login-signup-form">
            <input placeholder="Username" className = "login-signup-form-item"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <input type="password" placeholder="Password" className = "login-signup-form-item"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button type="submit">Sign In</button>
        </form>
        <p>Need an account?</p>
        <a href="/signup"><button type="button">Create account</button></a>
    </div>
  );
}