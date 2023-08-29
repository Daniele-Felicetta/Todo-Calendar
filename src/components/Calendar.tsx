import { useState,useEffect } from "react";
import {useStore} from './Controller'
import CalendarTable from "./CalendarTable";

function daysInMonth(year:number, month:number) {
    const newDate= new Date(year, month+1, 0).getDate();
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
function getActualDay(){
    const date = new Date(); 
    let day= date.getDay()+27; 
    return day;
}

function getActualMonth(){
    const date = new Date(); 
    let month= date.getMonth()+1; 
    return getMonthName(month);
}
function getActualYear(){
    const date = new Date(); 
    const year= date.getFullYear(); 
    return year;
}
function getActualDate(){
    return getActualYear() + '-' + getNumberMonthByName(getActualMonth()) + '-' + getActualDay();
}

export default function Calendar(){
    const [calendarNotes,setCalendarNotes] = useState<string[]>([]);
    const [month,setMonth]= useState<string>(getActualMonth())
    const [monthNumber,setMonthNumber]= useState<number>(getNumberMonthByName(month));
    const [year,setYear]= useState<number>(getActualYear());
    const [table,setTable]= useState<any>({});
    const calendarObject=useStore((state)=> state.calendarObject);
    const getToday=getActualDate();


    function renderCalendar(){
        let tempCalendar:string[]=[...calendarNotes];
        for(let i=0;i<daysInMonth(year,monthNumber-1);i++){
            if(daysInMonth(year,monthNumber-1)==28 && tempCalendar.length>28){
                if(tempCalendar.length==31){
                    tempCalendar.splice(28,3);
                }
                if(tempCalendar.length==30){
                    tempCalendar.splice(29,2);
                }  
            }
            else if(daysInMonth(year,monthNumber-1)==29 && tempCalendar.length>29){
                if(tempCalendar.length==31){
                    tempCalendar.splice(28,2);
                }
                if(tempCalendar.length==30){
                    tempCalendar.splice(29,1);
                }  
            }

            if(daysInMonth(year,monthNumber)==30 && tempCalendar.length>30){
                tempCalendar.splice(30,1);
            }

            const zeroIn= monthNumber<10 ? "0": "";
            if(calendarObject[`${year}-${zeroIn}${monthNumber}-${i+1}`]){
                tempCalendar[i]=calendarObject[`${year}-${zeroIn}${monthNumber}-${i+1}`]
            }
            else{
                tempCalendar[i]="";
            }
        }

        setCalendarNotes(tempCalendar)
        tempCalendar=[];
    }
    useEffect(()=>{
        renderCalendar();
    },[calendarObject,month,monthNumber])

    const renderCalendarNotes= calendarNotes.map((x:string, i:number)=> {
            const zeroIn= monthNumber<10 ? "0": "";
        return (
            <div onClick={()=> {setTable({value:x, date:`${i+1} ${month} ${year}`, dateFormat:`${year}-${zeroIn}${monthNumber}-${i+1}`})}} key={i}className="CalendarGrid justify-center">
                <div className="CalendarGridChild text-yellow-500 ">
                 {i+1+" "}
                 <span className="text-red-500 underline">
                    {`${year}-${monthNumber}-${i+1}`==getToday && "  Today"}
                </span>
                </div>
                <div className="h-5 uppercase">
                    {x}
                </div>
            </div>
        )
    }) 

    function calendarINCHandler(i:number):void {
        if(monthNumber==12){
            setYear(year+i);
        }
        setMonth(getMonthName(monthNumber+i))
    }
    useEffect(()=>{
        setMonthNumber(getNumberMonthByName(month))
    },[month])
    
    useEffect(()=>{
        console.log("Setting notes in Calendar localStorage...") 
        localStorage.setItem("calendarObject",JSON.stringify(calendarObject))  
    },[calendarNotes]);

    return(
        <>
        {Object.keys(table).length==0
        ?
            <div className="CalendarRoot">
                <div className="flex justify-between">
                    <div className="CalendarActualDate">
                        <div>
                            <h1>{year}</h1>
                            <h1>{month}</h1>
                        </div>
                    </div>
                    <div>
                        <button className="bg-red-200 px-3 rounded-lg" style={{padding:"0,0,0,0"}} onClick={()=>calendarINCHandler(-1)}>-</button>
                        <button className="bg-green-200 px-3 rounded-lg" onClick={()=>calendarINCHandler(1)}>+</button>
                    </div>
                    
                </div>
                <div className="CalendarGridMiddle">
                    {renderCalendarNotes}
                </div>
            </div>
        : 
            <>
            {("value" in table && "date" in table) 
            &&
            <>
                <div className="CalendarTableRoot">
                    <CalendarTable  dateValue={table.date} dateFormat={table.dateFormat}/>
                </div>
                <button className="exitTable" onClick={()=> setTable({})}>Exit</button>
            </>
            }
            </>
        }
        </>
    )
}