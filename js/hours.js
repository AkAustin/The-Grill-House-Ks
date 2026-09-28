/* ==========================================
   THE GRILL HOUSE KS - REAL HOURS & LIVE STATUS
   ========================================== */

/**
 * Restaurant Weekly Operating Hours Schedule:
 * Monday - Saturday: 6:00 AM - 9:00 PM (06:00 - 21:00)
 * Sunday: 7:00 AM - 8:00 PM (07:00 - 20:00)
 */
const SCHEDULE = {
  0: { day: 'Sunday', open: 7, close: 20, openStr: '7:00 AM', closeStr: '8:00 PM' },
  1: { day: 'Monday', open: 6, close: 21, openStr: '6:00 AM', closeStr: '9:00 PM' },
  2: { day: 'Tuesday', open: 6, close: 21, openStr: '6:00 AM', closeStr: '9:00 PM' },
  3: { day: 'Wednesday', open: 6, close: 21, openStr: '6:00 AM', closeStr: '9:00 PM' },
  4: { day: 'Thursday', open: 6, close: 21, openStr: '6:00 AM', closeStr: '9:00 PM' },
  5: { day: 'Friday', open: 6, close: 21, openStr: '6:00 AM', closeStr: '9:00 PM' },
  6: { day: 'Saturday', open: 6, close: 21, openStr: '6:00 AM', closeStr: '9:00 PM' }
};

/**
 * Check real local time and update status in header
 */
function updateLiveStatus() {
  const statusElem = document.getElementById('live-operating-status');
  if (!statusElem) return;

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours() + (now.getMinutes() / 60);

  const todaySchedule = SCHEDULE[currentDay];

  if (currentHour >= todaySchedule.open && currentHour < todaySchedule.close) {
    statusElem.className = 'topstrip-status status-open';
    statusElem.innerHTML = `● Open now <span class="topstrip-sep">·</span> Closes at ${todaySchedule.closeStr}`;
  } else {
    // Determine next opening time
    let nextDay = currentHour >= todaySchedule.close ? (currentDay + 1) % 7 : currentDay;
    let nextSchedule = SCHEDULE[nextDay];
    statusElem.className = 'topstrip-status status-closed';
    statusElem.innerHTML = `○ Closed now <span class="topstrip-sep">·</span> Opens ${nextSchedule.day} at ${nextSchedule.openStr}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateLiveStatus();
  // Periodically refresh live status every 60 seconds
  setInterval(updateLiveStatus, 60000);
});
