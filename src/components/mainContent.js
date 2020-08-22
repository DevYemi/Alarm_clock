import React, { useEffect } from 'react'

const MainContent = (props) => {

    useEffect(
        () => {
            let hour = document.getElementById('hour-error');
            let inputHour = document.querySelector('.hour');
            let min = document.getElementById('min-error');
            let inputMin = document.querySelector('.min');
            let amPm = document.getElementById('ampm-error');
            if (props.hourErrorMsg) {
                console.log(props.hourErrorMsg)
                hour.style.display = 'block'
                inputHour = document.querySelector('.hour')
                inputHour.style.borderColor = 'red'
            } else {
                hour.style.display = 'none'
                inputHour = document.querySelector('.hour')
                inputHour.style.borderColor = 'initial'
            }
            if (props.minErrorMsg) {
                min = document.getElementById('min-error');
                min.style.display = 'block'
                inputMin = document.querySelector('.min');
                inputMin.style.borderColor = 'red'
            } else {
                min = document.getElementById('min-error');
                min.style.display = 'none'
                inputMin = document.querySelector('.min')
                inputMin.style.borderColor = 'initial'
            }
            if (props.amPmErrorMsg) {
                amPm = document.getElementById('ampm-error');
                amPm.style.display = 'block'
            } else {
                amPm = document.getElementById('ampm-error');
                amPm.style.display = 'none'
            }

        }, [props.hourErrorMsg, props.minErrorMsg, props.amPmErrorMsg, props.alarmHour, props.alarmMin, props.amPm]
    )
    useEffect(
        () => {
            let sec3 = document.querySelector('.sec3');
            let gridContainer = document.querySelector('#grid-container');

            if (props.fixedAlarm.length >= 1) {
                for (let i = 0; i < props.fixedAlarm.length; i++) {
                    sec3.style.display = 'block'
                    let newDiv = document.createElement('DIV');
                    newDiv.innerHTML = `${props.fixedAlarm[i].hour}:${props.fixedAlarm[i].min}${props.fixedAlarm[i].ampm}`
                    newDiv.setAttribute('class', `grid-item ${i}`);
                    gridContainer.appendChild(newDiv);
                    newDiv.addEventListener('click', clearAlarm);
                }

            } else if (props.fixedAlarm.length < 1) {
                sec3.style.display = 'none'

            }
        }, []
    )
    function clearAlarm(evt) {
        evt.target.remove();
        let sec3 = document.querySelector('.sec3');
        let index = parseInt(evt.target.classList.item(1));
        let grid = document.querySelector('#grid-container')
        if (grid.childElementCount <= 0) {
            sec3.style.display = 'none'
        }
        console.log( index,  grid.children.length)
        if ( grid.children.length === index) {
            props.removeAlarm(index);
            console.log('last index')
            console.log(props.fixedAlarm)
        } else {
            for (let i = index; i < grid.children.length; i++) {
                console.log('previous index');
                const element = grid.children[i];
                let classIndex = element.classList.item(1)
                element.classList.remove(classIndex);
                let newClasssIndex = (parseInt(classIndex) - 1).toString()
                element.classList.add(newClasssIndex);
                console.log(props.fixedAlarm)
            }
            props.removeAlarm(index);
        }
    }
    function ring() {
        var audio;
        audio = new Audio(props.alarmTune);
        audio.play();
        setTimeout(() => { audio.pause() }, 5000);
    }
    return (
        <div className='main'>
            <section className='time sec1'>
                <h2>Current Time</h2>
                <p>{props.time}</p>
            </section>
            <section className='alarm sec2'>
                <h2>Set An Alarm</h2>
                <p id='hour-error'>{`${props.hourErrorMsg} *`}</p>
                <p id='min-error'> {`* ${props.minErrorMsg}`}</p>
                <p id='ampm-error'>  {`* ${props.amPmErrorMsg}`}</p>
                <input type='text'
                    onChange={props.handleOnChange}
                    name='hour'
                    value={props.hour}
                    className='input hour'
                    placeholder='00' />
                <span>:</span>
                <input type='text'
                    name='min'
                    onChange={props.handleOnChange}
                    value={props.min}
                    className='input min'
                    placeholder='00' /> <br />
                <input type='radio'
                    name='radio'
                    onChange={props.handleOnChange}
                    value='AM'
                    checked={props.amPm === 'AM'}
                    className='am' />
                <lable for='am' className='label'>AM</lable>
                <input type='radio'
                    name='radio'
                    onChange={props.handleOnChange}
                    value='PM'
                    checked={props.amPm === 'PM'}
                    className='pm' />
                <lable for='pm' className='label'>PM</lable>
                <br />
                <label for='tunes' className='label'>Select a Ring Tune: </label>
                <select
                    name='tunes'
                    onChange={props.handleOnChange}
                    className='tunes'>
                    <option value='beep'>Beep</option>
                    <option value='bell'>Twin Bell</option>
                    <option value='wecker'>Wecker</option>
                    <option value='wake'>Gentle Wake</option>
                </select>
                <button id='tunes-btn' onClick={ring}>Preview</button>
                <br />
                <textarea placeholder='Leave A Description'
                    className='textarea'
                    onChange={props.handleOnChange}
                    name="description"
                    value={props.description}
                    rows="4"
                    cols="50" /> <br />
                <button onClick={props.setAlarm}>SET</button>
            </section>
            <section className='sec3'>
                <h3>Click on the time to delete</h3>
                <div id='grid-container'></div>
            </section>

        </div>
    )
}

export default React.memo(MainContent);