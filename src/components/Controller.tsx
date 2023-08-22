import NotesRender from "./NotesRender"
import Calendar from "./Calendar";
import {create} from 'zustand'

interface Store  {
    notesStore: string[]
    calendarStore: string[]
}

function getNotesStorage(){
    const notesStorage=localStorage.getItem('notes');
    if(notesStorage){

        return JSON.parse(notesStorage);
    }
    else{
        return[];
    }
}
function getCalendarStorage(){
    const calendarStorage=localStorage.getItem('calendar');
    if(calendarStorage){
        return [calendarStorage]
    }
    else{
        return[];
    }
}

export const useStore = create<Store>((set) => ({
    notesStore: getNotesStorage(),
    calendarStore: getCalendarStorage()
  }))




export default function Controller(){
    return (
        <div className="RootTool">
            <NotesRender/>
            <Calendar />
        </div>
    )
}