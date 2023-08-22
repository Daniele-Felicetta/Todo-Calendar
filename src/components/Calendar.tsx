import { useState,useEffect } from "react";
import {useStore} from './Controller'
import React from 'react';

function daysInMonth(year:number, month:number) {
    const newDate= new Date(year, month+1, 0).getDate();
    console.log("newDate"+newDate);
    return newDate;
}
function getNumberMonthByName(monthName:string){
    const numberMonth:number = new Date(Date.parse(monthName +" 1, 2012")).getMonth()+1;
    return numberMonth;
}
function getMonthName(monthNumber:number) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'long' });
}
function getActualMonth(){
    const date = new Date(); 
    let month= date.getMonth()+1; 
    return month;
}
function getActualYear(){
    const date = new Date(); 
    const year= date.getFullYear(); 
    return year;
}

export default function Calendar(){
    const initialNotes = useStore(state=>state.calendarStore)
    const [calendarNotes,setCalendarNotes] = useState(initialNotes);
    const [month,setMonth]= useState<string>("September");
    const [howMuchDaysInMonth, setHowMuchDaysInMonth]=useState(0)
    const [year,setYear]= useState<number>(getActualYear());
    const [tempCalendarNotes,setTempCalendarNotes] = useState([]);
    const [modifyValue, setModifyValue]=useState<string>("");
    const [modifyMode,setModifyMode]=useState<number>(-1)
    const [newNote, setNewNote] = useState<string>('');
    const [error,setError]= useState<boolean>(false);
    const [sentinella,setSentinella]=useState(false);
    
        useEffect(()=>{
        const calendarDays=daysInMonth(year,getNumberMonthByName(month));
        setHowMuchDaysInMonth(calendarDays);
        console.log("CalendarDays:"+calendarDays);
        const tempCalendar:string[]=[...calendarNotes];
        for(let i=0;i<calendarDays;i++){
            console.log(tempCalendar+" :CALENDARRRRRR");
            if(tempCalendar[i] && tempCalendar[i]!="void"){
                tempCalendar[i]="";
            }
            else{
                tempCalendar[i]="";

            }
        }
        console.log(tempCalendar.length+ "CIAOOOOOOOOOOOOo");
        console.log("month:"+ month+ "   month number:"+getNumberMonthByName(month)+ "   dayInMonth:"+ daysInMonth(year,getNumberMonthByName(month)));
        tempCalendar[3]="cadwoao"
        setCalendarNotes(tempCalendar)
    },[month]);
    

    if(sentinella==false){
    
        setSentinella(true);
    }
    
    const renderCalendarNotes= calendarNotes.map((x:string, i:number)=> {
        return (
            <div key={i}className="CalendarGrid justify-center">
                <div className="CalendarGridChild text-yellow-500 ">
                    {x}
                </div>
                <div>
                    {i+1}
                </div>
            </div>
        )
    }) 

    function calendarINCHandler(i:number):any{
        const numberMonth=getNumberMonthByName(month);
        const nameMonth=getMonthName(numberMonth+i);
        if(numberMonth==12){
            setYear(year+i);
        }
        setMonth(nameMonth)
    }

    useEffect(()=>{
        console.log("Setting notes in Calendar localStorage...")
        localStorage.setItem("calendar",JSON.stringify([...calendarNotes]));  
    },[calendarNotes]);

    return(
        < div className="CalendarRoot">
            <div className="flex justify-between">
                <div className="CalendarActualDate">
                    <div>
                        <h1>{year}</h1>
                        <h1>{month}</h1>
                    </div>

                  <div>
                    </div>

                </div>
                <div>
                    <button className="bg-red-200 px-3 rounded-lg" style={{padding:"0,0,0,0"}} onClick={()=>calendarINCHandler(-1)}>-</button>
                    <button className="bg-green-200 px-3 rounded-lg" onClick={()=>calendarINCHandler(1)} >+</button>
                </div>
                
            </div>
            <div className="CalendarGrid">
                {renderCalendarNotes}
            </div>
        </div>
    )
}