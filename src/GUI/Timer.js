import Utils from '../utils/Utils';

export default class Timer {
  constructor() {
    this._HTML = document.createElement('div');
    this._HTML.classList.add('timer_box');
    this._HTML.innerHTML = `<div class="timer_box-inner">
                                 <div class="time_box-inner-frame">
                                   <div class="time_box-inner-frame-display">
                                     <p class="timer_text">00:00:00</p>
                                   </div>
                                 </div>
                                 <p class="timer_subs">
                                   <span>HRS&nbsp;</span>
                                   <span>MINS</span>
                                   <span>SECS</span>
                                 </p>
                               </div>`;

    this._Text = this._HTML.querySelector('.timer_text');
  }

  startTimer() {
    this._startTime = new Date();
    this._isStart = true;
    this.updateTimer();
  }

  updateTimer() {
    this._time = new Date() - this._startTime;
    this.setTime(this._time);

    setTimeout(() => {
      if (this._isStart) this.updateTimer();
    }, 1000);
  }

  resumeTimer() {
    this._startTime = new Date() - this._time;
    this._isStart = true;
    this.updateTimer();
  }

  stopTimer() {
    this._isStart = false;
  }

  getTime() {
    return this._time;
  }

  appendTo(parent) {
    parent.appendChild(this._HTML);
  }

  setTime(t) {
    this._Text.textContent = Utils.getTimeFormatStr(t);
  }

  setStartTime(t) {
    this._time = t;
    this.resumeTimer();
  }
}
