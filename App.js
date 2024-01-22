import React from "react";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import UploadFiles from "./components/upload-files.component";
import LoginButton from './components/loginButton';
import LogoutButton from './components/logoutButton';
import UserProfile from './components/userProfile';

function App() {
  return (
    <div className="container" style={{ width: "600px" }}>
      <div className="my-2">
        <h3>React DropZone multiple Files upload</h3>
      </div>

      <UploadFiles/>
      <LoginButton/>
      <LogoutButton/>
      <UserProfile/>
    </div>

  );
}

export default App;
