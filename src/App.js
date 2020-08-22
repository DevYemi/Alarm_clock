import React, { useEffect, useState } from 'react';
import './App.css'
import Header from './components/header';
import Footer from './components/footer';
import MainContent from './components/mainContent';
import AlarmGoneOff from './components/alarmGoneOff';

const App = () => {
  // console.log('App Re-rendering')
  const [alarmHour, setHour] = useState(''); // Alarm Hour
  const [alarmMin, setMin] = useState('');   // Alarm Min
  const [amPm, setAmPm] = useState('');      // set Pm or Am
  const [hourErrorMsg, setHourErrorMsg] = useState(); //hour error message
  const [minErrorMsg, setminErrorMsg] = useState(); // min error message
  const [amPmErrorMsg, setAmPmMsg] = useState(''); //ampm error message
  const [tunes, setTunes] = useState({});
  const [alarmTune, setAlarmTune] = useState('/audio/Beep.mp3'); // Selected alarm tune
  const [isAlarmDue, setIsAlarmDue] = useState(false); // checks if alarm is due with current time
  const [dueAlarmTime, setDueAlarmTime] = useState(); // alarm time that is currently due with current time
  const [isAlarmSet, setIsAlarmSet] = useState(false); //checks if alarm have been set so to change the main 
  const [fixedAlarm, setFixedAlarm] = useState([])  // where "set" alarm deatils are kept
  const [description, setDescription] = useState('');
  const [alarmTimeLeft, setAlarmTimeLeft] = useState({}) // Time left for the alarm to go off
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()) // sets current time
  class Alarm { // create object for every alarm the user set
    constructor(hour, min, ampm, description) {
      this.hour = hour
      this.min = min
      this.ampm = ampm
      this.description = description
    }
  }
  var errors = {// ERROR MESSAGES
    hourCheck: false,
    minCheck: false,
    amPmCheck: false,
    hour: Number(alarmHour),
    min: Number(alarmMin),
    empty: 'This field is empty',
    excess: `Input shouldn't be more than two digit or less than one digit`,
    alphabet: `Alaphabet input isn't allowed`,
    format: `Check input format`,
    amPmMessage: `check one input`,
  }
  var date = new Date();
  var time = date.toLocaleTimeString();
  var main; // page before and after you set the alarm
  var mainChange; // page when the alarm ahs gone off
  useEffect(
    () => {
      let tickInterval = setInterval(() => {
        tick(); alarmDue();
      }, 1000); //update time every second
      setTunes({
        beep: '/audio/Beep.mp3',
        bell: '/audio/Twin-bell.mp3',
        wecker: '/audio/Wecker.mp3',
        analog: '/audio/Analog.mp3',
        wake: '/audio/Gentle-wake.mp3'
      })
      return () => {
        clearInterval(tickInterval)
      }

    }, [])
  const tick = () => {
    date = new Date();
    time = date.toLocaleTimeString();
    setCurrentTime(time)

  }
  function handleOnChange(e) {
    const { name, value } = e.target

    if (name === 'hour') {
      setHour(value)
    }
    else if (name === 'min') {
      setMin(value)
    }
    else if (name === 'radio') {
      setAmPm(value)
    } else if (name === 'tunes') {
      setAlarmTune(tunes[value]);
    }
    else if (name === 'description') {
      setDescription(value);
    }
  }
  function alarmDue() { // checks if alarm is due to ring
    if (fixedAlarm.length >= 1) {
      let hour = date.getHours().toString() // get a 24 hour value
      let min = date.getMinutes().toString()
      let ampm;

      // if (Number(hour) > 12) {  //convert hour to a 12 hour value
      //   ampm = 'PM'
      //   hour = Number(hour) - 12
      //   hour = '0' + hour.toString()
      // } else {
      //   ampm = 'AM'
      //   hour = '0' + hour
      // }
      // if (Number(min) < 10) {
      //   min = '0' + min
      // }
      fixedAlarm.forEach((alarm, i) => {
        if (alarm.hour.length === 1 && alarm.hour < 10 && Number(hour) >= 12) {
          ampm = 'PM'
          hour = (Number(hour) - 12).toString();
        } else if (alarm.hour.length === 1 && alarm.hour < 10 && Number(hour) < 12) {
          ampm = "AM"
        } else if (alarm.hour.length === 2 && alarm.hour < 10 && Number(hour) >= 12) {
          ampm = 'PM'
          hour = Number(hour) - 12
          hour = '0' + hour.toString();

        } else if (alarm.hour.length === 2 && alarm.hour < 10 && Number(hour) < 12) {
          ampm = 'AM'
          hour = '0' + hour

        } else if (alarm.hour >= 10 && Number(hour) > 12) {  //convert hour to a 12 hour value
          ampm = 'PM'
          hour = (Number(hour) - 12).toString()
        } else if (alarm.hour >= 10 && Number(hour) < 12) {
          ampm = 'AM'
        }
        else if (Number(hour) === 0) {
          ampm = 'AM'
          hour = '12'
        }

        if (alarm.min.length === 2 && alarm.min < 10 && Number(min) < 10) {
          min = '0' + min
        }

        if (alarm.hour === hour && alarm.min === min && alarm.ampm === ampm) {
          setDueAlarmTime({ dueTime: `${hour}:${min} ${ampm} `, description: alarm.description });
          removeAlarm(i)
          setIsAlarmDue(true);
        } else {
          hour = date.getHours().toString()
          min = date.getMinutes().toString()
          ampm = ''
        }
      })

    }

  }



  function setAlarm() {
    var { empty, excess, alphabet, format, hourCheck, minCheck, hour, min, amPmCheck, amPmMessage } = errors

    if (alarmHour === '') { //check if all the hour input are valid
      setHourErrorMsg(empty)
    } else if (!(Number(alarmHour))) {
      setHourErrorMsg(alphabet)
    }
    else if (alarmHour.length > 2 || alarmHour.length < 1) {
      setHourErrorMsg(excess)
    } else if (hour > 12 || hour < 0) {
      setHourErrorMsg(format)
    } else {
      hourCheck = true
      setHourErrorMsg();
    }

    if (alarmMin === '') { // check if all the min input are valid
      setminErrorMsg(empty)
    } else if (alarmMin.length > 2 || alarmMin.length < 1) {
      setminErrorMsg(excess)
    }
    else if (min > 59 || min < 0) {
      setminErrorMsg(format)
    }
    else if (!(Number(alarmMin))) {
      if (Number(alarmMin) === 0) {
        minCheck = true;
        setminErrorMsg();
      }
      else {
        setminErrorMsg(alphabet);
      }

    } else {
      minCheck = true;
      setminErrorMsg();
    }

    if (amPm === '') { // check if am or pm is ticked
      setAmPmMsg(amPmMessage);
    } else {
      amPmCheck = true
      setAmPmMsg('')
    }

    if (hourCheck && minCheck && amPmCheck) { // excute code if all hour,min,amPm input are valid
      if (fixedAlarm.length < 12) {
        fixedAlarm.push(new Alarm(alarmHour, alarmMin, amPm, description))
        calAlarmTime();
        setminErrorMsg();
        setDescription()
        setHourErrorMsg();
        hourCheck = false;
        minCheck = false;
        amPmCheck = false;
        setIsAlarmSet(true)
      } else {
        reset();
        alert("You have exceeded your alarm slot");
        setminErrorMsg();
        setHourErrorMsg();
        hourCheck = false;
        minCheck = false;
        amPmCheck = false;
      }

    }
  }
  function calAlarmTime() {// this calculate the time left for the alram to go off
    var globalHour = getHour();
    var globalMin = getMin();
    var furHour;
    function getHour() {
      let hour = date.getHours();
      let min = date.getMinutes();
      let numAlarmHour = parseInt(alarmHour);

      if (amPm === 'PM' && hour > 12) {
        numAlarmHour = numAlarmHour + 12
        console.log("PM ONLY")
        if (numAlarmHour < hour) {
          furHour = min === 0 ? 24 - (hour - numAlarmHour) : (24 - (hour - numAlarmHour));
        } else if (numAlarmHour > hour) {
          if (min === 0 || (numAlarmHour - hour) >= 2) {
            furHour = numAlarmHour - hour
          } else {
            furHour = (numAlarmHour - hour) - 1
          }
        }
      } else if (amPm === 'AM' && hour < 12) {
        console.log("AM ONLY")
        if (hour > numAlarmHour) {
          furHour = min === 0 ? 24 - (hour - numAlarmHour) : (24 - (hour - numAlarmHour)) - 1
        } else if (hour < numAlarmHour) {
          furHour = min === 0 ? numAlarmHour - hour : (numAlarmHour - hour) - 1
        }
      } else if (amPm === "AM" && hour > 12) {
        furHour = min === 0 ? (24 - hour) + numAlarmHour : ((24 - hour) + numAlarmHour) - 1
        console.log("AM AND PM")
      } else if (amPm === "PM" && hour < 12) {
        furHour = min === 0 ? (24 - (hour + 12)) + numAlarmHour : ((24 - (hour + 12)) + numAlarmHour) - 1
      }
      return furHour
    }
    function getMin() {
      let min = date.getMinutes();
      let numAlarmMin = parseInt(alarmMin);
      var furMin;
      if (furHour === 0 && numAlarmMin === 0) {
        furMin = 60 - min
        console.log("here 1")
      } else if (furHour === 0 && ((60 - min) + numAlarmMin) > 60) {
        furMin = ((60 - min) + numAlarmMin) - 60
        globalHour = 1;
        console.log("here 3")

      }else if (furHour === 0 && ((60 - min) + numAlarmMin) < 60){
        furMin = min + numAlarmMin
       }
      else if (furHour === 0 && min > numAlarmMin) {
        furMin = min + numAlarmMin
        console.log("here 2")
      } else if (furHour === 0 && numAlarmMin > min) {
        furHour = min + numAlarmMin
      }
      else if (min > numAlarmMin) {
        furMin = min - numAlarmMin
      }
      else if (numAlarmMin > min) {
        furMin = numAlarmMin - min
      }
      

      return furMin
    }
    console.log(globalHour);
    setAlarmTimeLeft({
      hour: globalHour,
      min: globalMin
    });

  }
  function removeAlarm(index) {
    fixedAlarm.splice(index, 1);
  }
  function reset() {
    setAlarmTimeLeft({});
    setAmPm('');
    setAlarmTune('/audio/Beep.mp3')
    setHour('')
    setMin('')
    setAmPmMsg('');
    setDescription('')
  }

  if (isAlarmSet) {
    main = <>
      <h1>{`You have set an alarm for ${alarmHour}:${alarmMin}${amPm}`}</h1>
      <p>{`Your alarm would go off in ${alarmTimeLeft.hour} Hours ${alarmTimeLeft.min} Minuties`}</p>
      <button onClick={() => {
        setIsAlarmSet(false);
        reset();
      }}>okay</button>
    </>
  } else {
    main = <MainContent
      time={currentTime}
      alarmTune={alarmTune}
      hourErrorMsg={hourErrorMsg}
      minErrorMsg={minErrorMsg}
      amPmErrorMsg={amPmErrorMsg}
      removeAlarm={removeAlarm}
      setAlarm={setAlarm}
      description={description}
      hour={alarmHour}
      min={alarmMin}
      amPm={amPm}
      fixedAlarm={fixedAlarm}
      handleOnChange={handleOnChange}
    />
  }
  if (isAlarmDue) {
    mainChange = <AlarmGoneOff
      dueAlarmTime={dueAlarmTime}
      reset={reset}
      alarmTune={alarmTune}
      setDueAlarmTime={setDueAlarmTime}
      setIsAlarmDue={setIsAlarmDue}
      setIsAlarmSet={setIsAlarmSet}
      isAlarmDue={isAlarmDue}
    />
  }
  else {
    mainChange = main
  }

  return (
    <div className='app'>
      <Header />
      {mainChange}
      <Footer />
    </div>
  )
};

export default App;
