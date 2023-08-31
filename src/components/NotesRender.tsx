import {useRef,useEffect,useState} from 'react'
import { v4 as uuidv4 } from 'uuid'; 
import  {useStore} from './Controller';

function getActualDate(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yy = today.getFullYear()
    return yy + '-' + mm + '-' + dd;
}
export default function NotesRender(){
    const [notes, setNotes]=useState<string[]>(useStore((state)=> state.notesStore));
    const setCalendarObject =useStore((state)=> state.setCalendarObject);
    const [modifyValue, setModifyValue]=useState<string>("");
    const [modifyMode,setModifyMode]=useState<number>(-1)
    const [newNote, setNewNote] = useState<string>('');
    const [error,setError]= useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const refInputNoteToCalendar = useRef<Record<string, HTMLInputElement>>({});
    
    const renderNotes=notes.map((x:string,i:number) => {
        const id=uuidv4();
        return(
            <div key={id} className="CompleteNotes flex items-center flex-col ">
                <div className='DivisionToCalendar flex items-center '>
                    <div className="WindowNote mr-10 item rounded-lg mt-10 w-96 h-20 uppercase">
                        {(modifyMode==i)
                        ? 
                            <>
                                <input 
                                    className="rounded-lg  border-solid border-gray-500 border-2"
                                    ref={inputRef}
                                    type="textarea" 
                                    value={modifyValue}
                                    placeholder={x} 
                                    onKeyDown={(e)=>e.key==="Enter"&& confirmHandler(i)} 
                                    onChange={(e)=>{setModifyValue(e.target.value)}}
                                    autoFocus  
                                />
                                <button onClick={()=>confirmHandler(i)}className='mr-2 mt-1 rounded-lg w-20 text-xs bg-emerald-200'>Confirm?</button>
                            </>

                        :
                            <>
                                <p className="List">{x}</p>
                                <div>
                                    <button className='mr-2 mt-1 rounded-lg w-20 text-xs bg-emerald-200' onClick={()=>modifyHandler(i)}>Modify</button>
                                    <button className='mr-2 mt-1 rounded-lg w-20 text-xs bg-red-400' onClick={()=>deleteHandler(i)} >Delete</button>
                                </div>
                            </>
                        }
                    </div>
                    <div className='addToCalendar flex flex-col '>
                        <input type="date" 
                            min={getActualDate()} 
                            ref={(e)=>{if(e!=null) refInputNoteToCalendar.current[id]=e}}
                        />
                        <button onClick={()=>{addToCalendarHandler(x,id)}}>Add to calendar</button>
                    </div>
                </div>
            </div>
        )
    });

    function addToCalendarHandler(x:string,id:string) {
        if(refInputNoteToCalendar.current[id]?.value){
            const dateString:string = refInputNoteToCalendar.current[id]?.value;
            setCalendarObject(dateString,x);
            
        }
    }
    
    function deleteHandler(i:number) {
        let newArray=[...notes];
        newArray.splice(i, 1);
        setNotes(newArray);
    }
    
    function modifyHandler(i:number){
        setModifyMode(i);
    }
    
    function confirmHandler(i:number){
        const newArray=[...notes];
        newArray.splice(i,1,modifyValue)
        setNotes(newArray);
        //Clear states
        setModifyMode(-1)
        setModifyValue("")
    }

    function addHandler(){
        if(newNote){
            setNotes([...notes, newNote])
            setNewNote("");
            setError(false);
        }
        else{
            setError(true);
        }
    }

    useEffect(()=>{
        console.log("Setting notes in localStorage...")
        localStorage.setItem("notes",JSON.stringify([...notes]));
    },[notes]);

    return (
        <div>
            <div className='CompleteNotes flex items-center flex-col flex-container-center'>
                <div>{renderNotes}</div>
                <div className='Add mt-5'>
                    <div>
                        <input 
                            className="rounded-lg  border-solid border-gray-500 border-2 
                            "type="text" 
                            value={newNote} 
                            placeholder={"Add note"} 
                            onKeyDown={(e)=>e.key==="Enter"&&addHandler()} 
                            onChange={(e)=>{setNewNote(e.target.value)}}
                        />
                    </div>
                    <button className="addButton ml-5 rounded-lg px-1 bg-emerald-500" onClick={addHandler}>Add</button>
                </div>
            </div>
            <div className='mt-5'>
                {error && <p className='text-red-500'>Inserire un valore corretto</p>}
            </div>
        </div>
    )
}