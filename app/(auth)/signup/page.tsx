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
    <div className = "centered-page-div">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} className = "login-signup-form">
            <input placeholder="Username" className = "login-signup-form-item"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <input type="password" placeholder="Password" className = "login-signup-form-item"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <input type="password" placeholder="Confirm Password" className = "login-signup-form-item"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            <button type="submit">Register</button>
        </form>
        <p>Already have an account?</p>
        <a href="/login"><button type="submit">Login</button></a>
    </div>
  );
}