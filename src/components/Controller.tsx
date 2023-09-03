import NotesRender from "./NotesRender"
import Calendar from "./Calendar";
import {create} from 'zustand'

interface CalendarObject {
    [date: string]: string[]; 
}

interface Store{
    notesStore: string[]
    calendarStore: string[]
    calendarObject:CalendarObject
    setCalendarObject(calendarDate:string,calendarNote:string):void
    modifyCalendarObject(calendarDate:string,calendarNote:string,i:number):any
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
        return JSON.parse(calendarStorage)
    }
    else{
        return[];
    }
}
function getCalendarObject(){
    const calendarObject=localStorage.getItem('calendarObject');
    if(calendarObject){
        return JSON.parse(calendarObject)
    }
    else{
        return[];
    }
} 

export const useStore = create<Store>((set) => ({
    notesStore: getNotesStorage(),
    calendarStore: getCalendarStorage(),
    calendarObject:getCalendarObject(),
    setCalendarObject: (calendarDate, calendarNote) => set((state) => {
        const existingNotes = state.calendarObject[calendarDate] || [];
        const updatedNotes = [...existingNotes, calendarNote];
        return {
            calendarObject: {
                ...state.calendarObject,
                [calendarDate]: updatedNotes
            }
        };
    }),
    modifyCalendarObject: (calendarDate, calendarNote,i) => set((state) => {
        const existingDayNotes = [...(state.calendarObject[calendarDate] || [])];
        existingDayNotes[i]= calendarNote;
        return {
            calendarObject: {
                ...state.calendarObject,
                [calendarDate]: existingDayNotes,
            }
        };
    }),
}));

  
export default function Controller(){
    return (
        <>
            <div className="RootTool">
                <NotesRender/>
                <Calendar />
                <hr />
            </div>

            <footer>
                <p>Made by <a href="https://danielefelicetta.it">Daniele Felicetta</a></p>
            </footer>
        </>
    )
}