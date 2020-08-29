import React from 'react'


const AlarmSet = (props) => {
    var {alarmHour,alarmMin,amPm,alarmTimeLeft,setIsAlarmSet,reset} = props

    return (
        <div className="alarmSet">
        <h1>{`You have set an alarm for ${alarmHour}:${alarmMin}${amPm}`}</h1>
        <p>{`Your alarm would go off in ${alarmTimeLeft.hour} Hours ${alarmTimeLeft.min} Minuties`}</p>
        <button onClick={() => {
          setIsAlarmSet(false);
          reset();
        }}>Ode okay</button>
        </div>
    )
}

export default React.memo(AlarmSet)