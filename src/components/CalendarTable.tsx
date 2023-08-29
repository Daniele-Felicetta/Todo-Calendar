import {useState} from "react"
import {useStore} from './Controller'

export default function CalendarTable(props:any){

    const [addNote, setAddNote]=useState<string>("");
    const setCalendarObject =useStore((state)=> state.setCalendarObject);
    const calendarObject=useStore((state)=> state.calendarObject);
    const [modifyNote,setModifyNote]=useState<string>("");
    const [modifyMode,setModifyMode]=useState<boolean>(false)

    return (
        <div className="pt-3 pl-3">
            {calendarObject[props.dateFormat]
            ?
            <div className="flex">   
                <h2 className="text-green-700">Title: <span className="text-black uppercase">{calendarObject[props.dateFormat]}</span></h2>
                    
                    {modifyMode
                    ?   <>
                            <input type="text" onChange={(e)=>setModifyNote(e.target.value)} className="rounded-lg  border-solid border-gray-500 border-2 ml-2"/>
                            <button className="ml-5" onClick={()=>{setCalendarObject(props.dateFormat,modifyNote); setModifyMode(false)}}>Confirm</button> 
                        </>

                    :   <button className="ml-5" onClick={()=>setModifyMode(true)}>Modify</button>
                    }
            </div>  
            :
            <div className="flex">
                <input type="text" onChange={(e)=>setAddNote(e.target.value)} className="mr-2 rounded-lg  border-solid border-gray-500 border-2"/>
                <button onClick={()=>{setCalendarObject(props.dateFormat,addNote)}} >Add Note</button>
            </div>
        }
            <h2 className="text-yellow-500">Day: <span className="text-black">{props.dateValue}</span></h2>
        </div>

    )
}