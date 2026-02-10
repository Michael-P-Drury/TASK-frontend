'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function AccountPage() {

  const router = useRouter();

  const [userData, setUserData] = useState({ username: '', yearGroup: '', classContext: '' });

  const [newYear, setNewYear] = useState('');
  const [newClassContext, setClassContext] = useState('');

  const handleUpdateYear = async () => {
    const jwtToken = Cookies.get('jwt_token');
    
    const response = await fetch('http://127.0.0.1:8000/users/update_year_group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt_token: jwtToken, year_group: newYear }),
    });

    const data = await response.json();

    location.reload()

    alert(data.message);
    
  };

  const handleUpdateClassContext = async () => {
    const jwtToken = Cookies.get('jwt_token');
    
    const response = await fetch('http://127.0.0.1:8000/users/update_class_context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt_token: jwtToken, class_context: newClassContext }),
    });

    const data = await response.json();

    location.reload()

    alert(data.message);
    
  };

  const handleDeleteAccount = async () => {

    if (window.confirm("Are you sure you want to delete your account?")) {
      const jwtToken = Cookies.get('jwt_token');
      
      const response = await fetch('http://127.0.0.1:8000/users/delete_account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt_token: jwtToken }),
      });

      const data = await response.json();

      Cookies.remove('jwt_token');

      router.push('/login');

      alert(data.message);
    }

  };


  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token');
    if (!jwtToken) {
      router.push('/login');
    }

    const getUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/get_user_info', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ jwt_token: jwtToken }),
        });

        const data = await response.json();

        if (data.status === 200) {
          setUserData({
            username: data.user_data.username,
            yearGroup: data.user_data.year_group,
            classContext: data.user_data.class_context
          });
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();

  }, [router]);

  return(
    <div className = "centered-page-div">
      <h1>Account</h1>
      <p className = "account-items">Username: {userData.username}</p>
      <p className = "account-items">Year Group: {userData.yearGroup}</p>
      <p className = "account-items">Class Context: {userData.classContext}</p>
      <div className = "account-items">
        <input type="text" placeholder="Enter number for year group" onChange={(e) => setNewYear(e.target.value)} />
        <button onClick={handleUpdateYear}>Update Year</button>
      </div>
      <div className = "account-items">
        <input type="text" placeholder="Enter new class context" onChange={(e) => setClassContext(e.target.value)} />
        <button onClick={handleUpdateClassContext}>Update Class Context</button>
      </div>
      <button onClick={() => {Cookies.remove('jwt_token'); router.push('/login');}} className = "account-items"> Logout </button>
      <button onClick={handleDeleteAccount} className = "delete-account-button"> DELETE ACCOUNT </button>
    </div>
  );
};