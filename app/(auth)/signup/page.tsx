'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';


export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });


  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token');
    if (jwtToken) {
      router.push('/account');
    }
  }, [router]);
  
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.status == 200) {
      alert(data.message);
      router.push('/login')
    }
    else {
      alert(data.message);
    }

  };


  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
            <input 
              type="username"
              placeholder="Username"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <input type="password"
              placeholder="Password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            <button type="submit" style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>Register</button>
        </form>
        <p>Already have an account?</p>
        <a href="/login"><button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Login</button></a>
    </main>
  );
}