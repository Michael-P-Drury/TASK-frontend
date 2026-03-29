'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

export default function ChatPage() {

    const router = useRouter()

    const [supportFilesLoading, setSupportFilesLoading] = useState(true);

    const [outputFilesLoading, setOutputFilesLoading] = useState(true);

    const [userSupportFiles, setUserSupportFiles] = useState({ userSupportFilesList: [] });

    const [userOutputFiles, setUserOutputFiles] = useState({ userOutputFilesList: [] });

    console.log(userSupportFiles)

    const [file, setFile] = useState <File | null>(null);

    useEffect(() => {
        const jwtToken = Cookies.get('jwt_token');
        if (!jwtToken) {
          router.push('/login');
        }

        const getSupportFiles = async () => {

          setSupportFilesLoading(true);
          try {
            const response = await fetch('http://127.0.0.1:8000/users/get_support_files', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ jwt_token: jwtToken }),
            });

            const data = await response.json();

            if (data.status === 200) {
              setUserSupportFiles({
                userSupportFilesList: data.support_files,
              });
              setSupportFilesLoading(false);
            }

          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };


        const getOutputFiles = async () => {
          try {
            setOutputFilesLoading(true);
            const response = await fetch('http://127.0.0.1:8000/users/get_output_files', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ jwt_token: jwtToken }),
            });

            const data = await response.json();

            if (data.status === 200) {
              setUserOutputFiles({
                userOutputFilesList: data.output_files,
              });
              setOutputFilesLoading(false);
            }

          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };

        getSupportFiles();
        getOutputFiles();

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

      const response = await fetch('http://127.0.0.1:8000/users/upload_support_file', {
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


    async function handleSupportFileDelete(delete_filename: string) {

      const jwtToken = Cookies.get('jwt_token') || "";

      console.log(delete_filename)

      const response = await fetch('http://127.0.0.1:8000/users/delete_support_file', {
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


    async function handleOutputFileDelete(delete_filename: string) {

      const jwtToken = Cookies.get('jwt_token') || "";

      console.log(delete_filename)

      const response = await fetch('http://127.0.0.1:8000/users/delete_output_file', {
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

    async function handleOutputFileDownload(download_filename: string) {

      const jwtToken = Cookies.get('jwt_token') || "";

      const response = await fetch('http://127.0.0.1:8000/users/download_output_file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt_token: jwtToken, filename: download_filename }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', download_filename);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    }


    return (
    <div className = "centered-page-div">

      <h1 className = "page-header">User Files</h1>
      
      <p className = "user-files-subheading">Upload new File:</p>

      <form onSubmit={handleFileUploadSubmit}>
        <input  type = "file" onChange = {handleFileUplaod}></input>
        <button type="submit" className = "general-button">Submit File</button>
      </form>

      <div className = "general-page-section">
        <div className = "centering-div">
          <p className = "user-files-subheading">Support Files:</p>
        </div>

        {supportFilesLoading ? (
          <span className="loader"></span>
        ) : (
          userSupportFiles.userSupportFilesList.length > 0 ? (
            userSupportFiles.userSupportFilesList.map((filename, index) => (
              <div key={index} className = "individual-user-file">
                <p>{filename}</p>
                <button className = "general-button" onClick={() => handleSupportFileDelete(filename)}>delete file</button>
              </div>
            ))
          ) : (
            <p>No user support files yet</p>
          )
        )}
      </div>

      <div className = "general-page-section">
        <div className = "centering-div">
          <p className = "user-files-subheading" >Output Files:</p>
        </div>
        
        {outputFilesLoading ? (
          <span className="loader"></span>
          ) : (
            userOutputFiles.userOutputFilesList.length > 0 ? (
            userOutputFiles.userOutputFilesList.map((filename, index) => (
              <div key={index} className = "individual-user-file">
                <p>{filename}</p>
                <button className = "general-button" onClick={() => handleOutputFileDelete(filename)}>delete file</button>
                <button className = "general-button" onClick={() => handleOutputFileDownload(filename)}>download file</button>
              </div>
            ))
          ) : (
            <p>No Output files</p>
          )
        )}
      </div>

    </div>
  );
}

