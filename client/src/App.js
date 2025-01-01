import { useEffect , useState, useMemo} from 'react';
import FileUploadComponent from "./components/FileUploadComponent"
import {io} from "socket.io-client"

//receive handler yahi daaldeta hun


function App() {
 const [target,setTarget] = useState("");
 const [file,setFile] = useState(null);
 const [binfile,setBinFile] = useState([]);
 const [socketId,setSocketId] = useState("");
//  const [fileName,setFileName] = useState("");
 
 
  const socket = useMemo(
    () =>
      io("http://localhost:5000", {
        withCredentials: true,
      }),
    []
  );



  
  useEffect(()=>{
    socket.on("connect",()=>{
      setSocketId(socket.id);
      console.log(`Your SockedID : ${socketId}`);
    })
   
   socket.on("receive",(chunk)=>{
     setBinFile((prev)=>[...prev,chunk]);
     console.log(`${binfile? "True" : "False"}`)
   })

   socket.on("exit",()=>{
     binFileHandler();
   })


   return () => {
    socket.disconnect();
  };
  },[])
 
 async function binFileHandler(){
  const blob = new Blob(binfile);
  const url = URL.createObjectURL(blob);
  fileDownloadHanlder(url,"data.pdf")
 }
 

 function fileDownloadHanlder(url,name){
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
 }


 async function submitHandler(event){
  event.preventDefault();
  if(!file)return;
   const CHUNK_SIZE = 64*1024;
   const totalChunks = Math.ceil(file.size/CHUNK_SIZE);

   console.log(`File size: ${file.size} bytes, Total chunks: ${totalChunks}`);

   for (let start = 0; start < file.size; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

     socket.emit("send",{target,chunk});
  }

  console.log("File Sent completed.");

   socket.emit("exit",target);
 }



  return (
    <div className="flex flex-col self-center gap-[10px] items-center" onSubmit={submitHandler}>
      <p className='text-xl font-bold'>WarpShare</p>
      <input type="text" placeholder='Enter RecieverID : ' onChange={(e)=>{setTarget(e.target.value)}}>
      </input>

      <input type="file" placeholder='Choose file' onChange={(e)=>{setFile(e.target.files[0])}}>
      </input>

      <button onClick={submitHandler}>
       { file ? ("Send File") : ("Select a File")}
      </button>
    </div>
  );
}

export default App;
