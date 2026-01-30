'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function AccountPage() {

  const router = useRouter();

  const [userData, setUserData] = useState({ username: '', year_group: '' });

  const [newYear, setNewYear] = useState('');

  const handleUpdateYear = async () => {
    const jwtToken = Cookies.get('jwt_token');
    
    const response = await fetch('http://127.0.0.1:8000/users/update_year_group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        jwt_token: jwtToken, 
        year_group: newYear 
      }),
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
        body: JSON.stringify({ 
          jwt_token: jwtToken
        }),
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

        const respone_json = await response.json();

        if (respone_json.status === 200) {
          setUserData({
            username: respone_json.user_data.username,
            year_group: respone_json.user_data.year_group,
          });
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();

  }, [router]);

  return(
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Account</h1>
      <p>Username: {userData.username}</p>
      <p>Year Group: {userData.year_group}</p>
      <div style = {{padding:20}}>
        <input type="text" placeholder="Enter number for new year (e.g. 5)" onChange={(e) => setNewYear(e.target.value)} />
        <button onClick={handleUpdateYear}>Update Year</button>
      </div>
      <button onClick={() => {Cookies.remove('jwt_token'); router.push('/login');}}>
        Logout
      </button>
      <button onClick={handleDeleteAccount} style = {{marginTop:20, backgroundColor:'red', color:'white'}}>
        DELETE ACCOUNT
      </button>
    </main>
  );
};