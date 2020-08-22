import React, { useEffect } from 'react'
import gsap from 'gsap'
var audio;
const AlarmGoneOff = (props) => {
    console.log('alarm re-rendering')
    if (props.isAlarmDue) {
        document.body.style.backgroundImage = `url("/img/bgImage.jpg")`
    }
    function bellRing() {
        gsap.to(".imgAGO", {
            yoyo: true,
            duration: .2,
            rotate: '30deg',
            repeat: -1
        })
    }
    function ring() {
        audio = new Audio(props.alarmTune);
        audio.play();
        audio.loop = true
    }
    useEffect(
        () => {
            bellRing();
            ring()
            return () => {
                document.body.style.backgroundImage = `url("/img/time.jpg")`
            }
        }, [props.isAlarmDue]
    )
    return (
        <div className='AGO'>
            <img src='/img/alarmTime.png' className='AGO imgAGO' alt='AGO' />
            <p>Alarm set for {props.dueAlarmTime.dueTime}</p>
            <h3>{props.dueAlarmTime.description}</h3>
            <button onClick={() => {
                props.setIsAlarmDue(false);
                props.setDueAlarmTime({});
                props.reset()
                audio.pause();
                props.setIsAlarmSet(false)
            }} id='stfu'>Shut The Fuck Up</button>
        </div>
    )
}

export default React.memo(AlarmGoneOff) 