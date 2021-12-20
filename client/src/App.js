import './App.css';
import React, {useRef, useState} from 'react';
import "./index.css";
import axios from "axios";
import Alert from '@mui/material/Alert';
function App() {

  const [name, setname] = useState("");
  const [file, setfile] = useState("");
  const [display,setDisplay] = useState(false);
  const [alert,setalert] = useState(false);
  const ref = useRef();
  function Submit(){
    try{
      axios.post("/getFile",{
        name:name
      }).then((res)=>{
        setDisplay(true)
        setalert(true);
        setfile(res.data.path);
        setTimeout(()=>{
          setalert(false);
        },3000);

      });
    } catch(err){
      console.log(err)
    }

  }

  function changeHandler(e){
    setname(e.target.value);
  }
function Download(){
  ref.current.click();
}
  return (
    <>
    <div className="App">
      <div className='main_container'>
        <div className='first_section'>
        <div className='heading m-2'> 
          <h1>Website Scrapper</h1>
        </div>
          <div className='input_div m-2'>
            <input type="text" id='name' placeholder='Enter you Name' value={name} onChange={(e)=>changeHandler(e)}/>
          </div>
        </div>
        <div className='second_section'>
          <button className="Button_main" onClick={Submit} disabled={!name}>Get File</button> 
        </div>
        <div className='second_section' >
          <a href={`http://localhost:8080/${file}`} download="abc.xlsx" ref={ref} style={{display:  'none' }}> download</a>
          <button className="Button_main download" style={{display: !display ? 'none':'block' }} onClick={()=>Download()}>Download</button> 
        </div>
      </div>
    </div>
    <Alert severity="success" className="alert" style={{display: !alert ? 'none':'flex'}}>Successfully Scrapped!</Alert>
    </>
  );
}

export default App;
