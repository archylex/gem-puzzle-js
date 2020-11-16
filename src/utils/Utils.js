export default class Utils {
  static getTimeFormat(t) {
    const hrs = String(~~(t / 3600000)).padStart(2, '0');
    const mins = String(~~(t / 60000) % 60).padStart(2, '0');
    const secs = String(~~(t / 1000) % 60).padStart(2, '0');
    return { hrs, mins, secs };
  }

  static getTimeFormatStr(t) {
    const obj = Utils.getTimeFormat(t);
    return `${obj.hrs}:${obj.mins}:${obj.secs}`;
  }
}
