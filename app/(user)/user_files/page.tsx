'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

export default function ChatPage() {

    const router = useRouter()

    const [userFiles, setUserFiles] = useState({ userFilesList: [] });

    console.log(userFiles)

    const [file, setFile] = useState <File | undefined>('ready');

    useEffect(() => {
        const jwtToken = Cookies.get('jwt_token');
        if (!jwtToken) {
          router.push('/login');
        }

        const getWorkingFiles = async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/users/get_working_files', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ jwt_token: jwtToken }),
            });

            const data = await response.json();

            if (data.status === 200) {
              setUserFiles({
                userFilesList: data.working_files,
              });
            }

          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };

        getWorkingFiles();

    }, [router]);


    function handleFileUplaod(e: React.FormEvent<HTMLInputElement>) {
      const target = e.target as HTMLInputElement & {
        files: FileList;
      }

      setFile(target.files[0]);
    }


    async function handleFileUploadSubmit(e: React.SyntheticEvent) {
      e.preventDefault();

      if (!file || typeof file === 'string') return;

      const jwtToken = Cookies.get('jwt_token') || "";

      const formData = new FormData();
      
      formData.append('jwt_token', jwtToken);
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:8000/users/upload_working_file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      location.reload()

      if (data.status == 200) {
        alert(data.message);
      }
      else {
        alert(data.message);
      }
    }


    async function handleFileDelete(delete_filename: string) {

      const jwtToken = Cookies.get('jwt_token') || "";

      console.log(delete_filename)

      const response = await fetch('http://127.0.0.1:8000/users/delete_working_file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt_token: jwtToken, filename: delete_filename }),
      });

      const data = await response.json();

      location.reload()

      if (data.status == 200) {
        alert(data.message);
        location.reload()
      }
      else {
        alert(data.message);
      }
    }


    return (
    <div className = "centered-page-div">
      <h1>User Files</h1>
      <p>Upload new File:</p>
      <form onSubmit={handleFileUploadSubmit}>
        <input type = "file" onChange = {handleFileUplaod}></input>
        <button type="submit">Submit File</button>
      </form>
      <div>
        {userFiles.userFilesList.length > 0 ? (
          userFiles.userFilesList.map((filename, index) => (
            <div key={index}>
              <p>{filename}</p>
              <button onClick={() => handleFileDelete(filename)}>delete file</button>
            </div>
          ))
        ) : (
          <p>No user files yet</p>
        )}
      </div>
    </div>
  );
}