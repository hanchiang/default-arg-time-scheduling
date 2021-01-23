// start: 09:00, end: 19:00

let schedules = [
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']]
];

/**
 * 
 * @param {*} schedule 3D array
 * @param {*} duration minutes
 */
function findFreeTimeslot(schedule, duration) {
  const mergedTimeslots = schedule[0];
  const toAddList = [];
  for (let i = 1; i < schedule.length; i++) {
    const personTimeslots = schedule[i];
    
    for (const personTimeslot of personTimeslots) {
      const toAdd = extendOrAddTimeslots(mergedTimeslots, personTimeslot)
      if (toAdd) {
        toAddList.push(toAdd);
      }
    }
  }
  for (const t of toAddList) {
    mergedTimeslots.push(t);
  }

  const result = findTimeslot(mergedTimeslots, duration);
  console.log(result)
}

/**
 * 
 * @param {*} mergedTimeslots 2D array
 * @param {*} timeslot 1D array
 */
function extendOrAddTimeslots(mergedTimeslots, timeslot) {
  const [start, end] = timeslot;
  for (let i = 0; i < mergedTimeslots.length; i++) {
    const [mergedStart, mergedEnd] = mergedTimeslots[i];
    if (isOverlap(start, end, mergedStart, mergedEnd)) {
      mergedTimeslots[i] = extend(start, end, mergedStart, mergedEnd);
      return;
    }
  }
  return timeslot;
}

/** Intersect
 *       start     end 
 *        start   end
 *                   start  end
 *   start end
 *  start             end
 */    
function isOverlap(start1, end1, start2, end2) {
  return (start2 >= start1 && end2 <= end1) ||
    (start2 >= start1 && start2 <= end1 && end2 >= end1) ||
    (end2 <= end1 && end2 >= start1 && start2 <= start1) ||
    (start2 < start1 && end2 > end1)
}

/**
 * Return extended timeslot
 * @param {*} start1 
 * @param {*} end1 
 * @param {*} start2 
 * @param {*} end2 
 */
function extend(start1, end1, start2, end2) {
  if (start2 >= start1 && end2 <= end1) {
    return [start1, end1];
  }
  if (start2 >= start1 && start2 <= end1 && end2 >= end1) {
    return [start1, end2];
  }
  if (end2 <= end1 && end2 >= start1 && start2 <= start1) {
    return [start2, end1];
  }
  if (start2 < start1 && end2 > end1) {
    return [start2, end2];
  }
}

/**
 * 
 * @param {*} schedule 2D array
 * @param {*} duration minutes
 */
function findTimeslot(schedule, duration) {
  for (let i = 0; i < schedule.length - 1; i++) {
    const [_, end1] = schedule[i];
    const [start2, __] = schedule[i+1];
    const addedTime = addTime(end1, duration);
    if (!isGreater(addedTime, start2)) {
      return end1;
    }
  }
  return null;
}

function isGreater(time1, time2) {
  const [hour1, minute1] = time1.split(':');
  const [hour2, minute2] = time2.split(':');
  const hour1Int = parseInt(hour1);
  const minute1Int = parseInt(minute1);
  const hour2Int = parseInt(hour2);
  const minute2Int = parseInt(minute2);

  return (hour1Int > hour2Int || hour1Int === hour2Int && minute1Int > minute2Int);
}

/**
 * 
 * @param {*} time1 string
 * @param {*} time2 string
 * @param {*} duration minutes
 */
function addTime(time, duration) {
  const [hour, minute] = time.split(':');
  const hourInt = parseInt(hour);
  const minuteInt = parseInt(minute);

  let newMinute = minuteInt + duration;
  let newHour = hourInt;
  while(newMinute > 60) {
    newMinute -= 60;
    newHour++;
  }
  return `${newHour}:${newMinute}`;
}

findFreeTimeslot(schedules, 30);

module.exports = { findFreeTimeslot, extendOrAddTimeslots, isOverlap, extend, findTimeslot, isGreater, addTime }