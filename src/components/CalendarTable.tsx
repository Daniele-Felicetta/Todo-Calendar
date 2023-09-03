import {useState, useRef} from "react"
import {useStore} from './Controller'
import { v4 as uuidv4 } from 'uuid'; 

export default function CalendarTable(props:any){
    const setCalendarObject =useStore((state)=> state.setCalendarObject);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const calendarObject=useStore((state)=> state.calendarObject);
    const modifyCalendarObject=useStore((state)=> state.modifyCalendarObject);
    const [modifyMode,setModifyMode]=useState<number>(-1)
    const [newNote, setNewNote] = useState<string>('');
    const [modifyValue, setModifyValue]=useState<string>("");
    const [error,setError]= useState<boolean>(false);

    let renderNotes:React.ReactNode
    let renderNode:React.ReactNode
    
    if(calendarObject[props.dateFormat]){
        console.log(calendarObject[props.dateFormat] +"   "+ typeof calendarObject[props.dateFormat])
        let notes: string[]=[];
        if(typeof calendarObject[props.dateFormat]== 'string'){
            notes[0]=calendarObject[props.dateFormat][0];
            console.log(notes);
        }
        else{
            notes=calendarObject[props.dateFormat]
        }
        renderNotes=notes.map((x,i)=>{
            const id=uuidv4();
            return(
                <div className={"flex my-4 ml-4"}key={id}>
                    {modifyMode==i?
                        <>
                            <input 
                               ref={inputRef}
                               type="textarea" 
                               value={modifyValue}
                               placeholder={x} 
                               onChange={(e)=>{setModifyValue(e.target.value)}}
                               onKeyDown={(e)=>{e.key=="Enter" && modifyCalendarObject(props.dateFormat,modifyValue,i); setModifyMode(-1); setModifyValue("")}}
                               autoFocus  
                               className="rounded-lg  border-solid border-gray-500 border-2 ml-2"
                            />
                            <button className="ml-5" onClick={()=>{modifyCalendarObject(props.dateFormat,modifyValue,i); setModifyMode(-1); setModifyValue("")}}>Confirm</button> 
                        </>
                    :
                        <>
                            <h2>{x}</h2>
                            <button className="ml-5" onClick={()=>setModifyMode(i)}>Modify</button>
                        </>
                    }
                </div>
            )
        });
        notes=[];
    }
    function addHandler(date:string,value:string):void {
        if(newNote){
            setCalendarObject(date,value);
            setNewNote("");
            setError(false);
        }
        else{
            setError(true);
        }
    }

    return (
        <div className="pt-3 pl-3">
            <div className="flex justify-between">
                <div className=" text-green-700 capitalize">Notes:{renderNotes}</div>
                <h2 className="text-yellow-500 mr-5">Day: <span className="text-black">{props.dateValue}</span></h2>
                {renderNode}  
            </div>
            <div className="flex h-7">
                <input 
                  className="rounded-lg  border-solid border-gray-500 border-2 ml-4 mr-4" 
                  type="textarea" 
                  value={newNote} 
                  placeholder={"Add note"} 
                  onKeyDown={(e)=>e.key==="Enter" && addHandler(props.dateFormat,newNote)} 
                  onChange={(e)=>{setNewNote(e.target.value)}}
                />
                <button onClick={()=>{addHandler(props.dateFormat,newNote)}}>Add Note</button>
            </div>
            <div className='mt-5'>
                {error && <p className='text-red-500'>Inserire un valore corretto</p>}
            </div>
        </div>
    )
}