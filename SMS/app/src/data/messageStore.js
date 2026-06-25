/* ============================================================
   Shared Communication Store
   ------------------------------------------------------------
   A lightweight, backend-free messaging layer shared by the
   Teacher, Student and Parent portals. Conversations are kept
   in localStorage so a message sent from one portal is visible
   in the others (same browser), and live-sync across tabs via
   the `storage` event plus an in-page custom event.
   ============================================================ */

const STORAGE_KEY = 'sms_conversations_v1';
const EVENT_NAME = 'sms-conversations-changed';

/* ---------- Roster -------------------------------------------------
   Canonical participants. The three demo accounts map to fixed ids
   so seeded threads always show up for whoever logs in.
------------------------------------------------------------------- */
export const ROSTER = {
  'teacher-elena': { id: 'teacher-elena', name: 'Dr. Elena Rodriguez', role: 'teacher', subtitle: 'Mathematics Dept.', email: 'teacher@school.edu', color: 'primary' },
  'student-elena': { id: 'student-elena', name: 'Elena Sterling', role: 'student', subtitle: 'Grade 11 · Section A', email: 'student@school.edu', color: 'secondary' },
  'parent-user':   { id: 'parent-user',   name: 'Mr. & Mrs. Sterling', role: 'parent', subtitle: 'Parent of Elena Sterling', email: 'parent@school.edu', color: 'tertiary' },

  'teacher-jenkins': { id: 'teacher-jenkins', name: 'Ms. Sarah Jenkins', role: 'teacher', subtitle: 'English Dept.', email: 'sarah.j@bridges.edu', color: 'secondary' },
  'teacher-chen':    { id: 'teacher-chen',    name: 'Prof. James Chen', role: 'teacher', subtitle: 'Physics Dept.', email: 'james.c@bridges.edu', color: 'primary' },
  'teacher-torres':  { id: 'teacher-torres',  name: 'Dr. Michael Torres', role: 'teacher', subtitle: 'Chemistry Dept.', email: 'michael.t@bridges.edu', color: 'tertiary' },

  'student-james': { id: 'student-james', name: 'James Liu', role: 'student', subtitle: 'Grade 11 · Section A', email: 'james.liu@bridges.edu', color: 'secondary' },
  'student-sarah': { id: 'student-sarah', name: 'Sarah Wilson', role: 'student', subtitle: 'Grade 11 · Section B', email: 'sarah.w@bridges.edu', color: 'tertiary' },

  'parent-santos': { id: 'parent-santos', name: 'Maria Santos', role: 'parent', subtitle: 'Parent of Diego Santos', email: 'm.santos@bridges.edu', color: 'secondary' },
  'parent-smith':  { id: 'parent-smith',  name: 'John Smith', role: 'parent', subtitle: 'Parent of Marcus Smith (Gr. 10)', email: 'j.smith@bridges.edu', color: 'primary' },

  'faculty-admin': { id: 'faculty-admin', name: 'Administration Office', role: 'staff', subtitle: 'Front Office', email: 'office@bridges.edu', color: 'tertiary' },
};

/* Map a logged-in user (from AuthContext / localStorage) to a roster id. */
export function resolveCurrentUserId(user) {
  if (!user) return null;
  const byEmail = Object.values(ROSTER).find((p) => p.email === user.email);
  if (byEmail) return byEmail.id;
  // Fallback by role for any non-demo account
  const byRole = { teacher: 'teacher-elena', student: 'student-elena', parent: 'parent-user' };
  return byRole[user.role] || null;
}

export function getParticipant(id) {
  return ROSTER[id] || { id, name: 'Unknown', role: 'staff', subtitle: '', color: 'tertiary' };
}

/* People a given user is allowed to start a new conversation with. */
export function directoryFor(userId) {
  const me = ROSTER[userId];
  const all = Object.values(ROSTER).filter((p) => p.id !== userId);
  if (!me) return all;
  if (me.role === 'student' || me.role === 'parent') {
    // Students & parents reach teachers and staff
    return all.filter((p) => p.role === 'teacher' || p.role === 'staff');
  }
  // Teachers reach everyone
  return all;
}

/* ---------- Helpers ---------------------------------------------- */
function pairId(a, b) {
  return ['c', ...[a, b].sort()].join('_');
}

function isoMinus(days = 0, hours = 0, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours, d.getMinutes() - minutes, 0, 0);
  return d.toISOString();
}

function msg(senderId, text, ts) {
  return { id: 'm_' + Math.random().toString(36).slice(2, 10), senderId, text, ts, read: true };
}

/* ---------- Seed data -------------------------------------------- */
function seed() {
  const conv = (a, b, messages) => ({
    id: pairId(a, b),
    participants: [a, b],
    messages,
  });

  return [
    // Shared teacher <-> parent thread (visible in BOTH portals)
    conv('teacher-elena', 'parent-user', [
      msg('parent-user', "Hello Dr. Rodriguez, I wanted to inquire about the upcoming algebra mid-term. Elena is a bit nervous — are there any specific study guides you'd recommend?", isoMinus(0, 3, 10)),
      msg('teacher-elena', 'Hi! I appreciate you reaching out. Elena is doing quite well in class. I have uploaded a comprehensive study packet to the "Assignments" section in the portal. It covers the core concepts from Chapters 4–6.', isoMinus(0, 2, 49)),
      { ...msg('parent-user', "That's great to hear. We'll look at that together tonight. Will there be any extra credit opportunities before the end of the term?", isoMinus(0, 2, 42)), read: false },
    ]),

    // Shared student <-> teacher thread
    conv('student-elena', 'teacher-elena', [
      msg('teacher-elena', 'Hi Elena — great job on the last quiz. The study packet for the mid-term is now in the Assignments tab.', isoMinus(1, 5, 0)),
      { ...msg('student-elena', 'Thank you! Quick question — will Chapter 6 be on the mid-term as well?', isoMinus(1, 4, 30)), read: false },
    ]),

    // Student <-> other teachers
    conv('student-elena', 'teacher-jenkins', [
      msg('teacher-jenkins', 'Elena, please remember the essay outline is due Friday. You are doing well — try to participate a little more in discussions.', isoMinus(2, 1, 0)),
    ]),
    conv('student-elena', 'teacher-chen', [
      msg('teacher-chen', 'You show great potential in physics. I would recommend considering the advanced course next year.', isoMinus(3, 2, 0)),
    ]),

    // Teacher inbox: students & faculty
    conv('teacher-elena', 'student-james', [
      { ...msg('student-james', 'Good afternoon Dr. Rodriguez, I had a question about problem 7 on the homework — is the answer key available?', isoMinus(0, 1, 5)), read: false },
    ]),
    conv('teacher-elena', 'student-sarah', [
      { ...msg('student-sarah', 'Hi, is it possible to get a one-day extension on the trigonometry assignment?', isoMinus(0, 0, 40)), read: false },
    ]),
    conv('teacher-elena', 'faculty-admin', [
      msg('faculty-admin', 'Reminder: the department meeting has been rescheduled to Friday at 3:00 PM in Room 204.', isoMinus(0, 6, 0)),
    ]),

    // Parent inbox: other teachers + office
    conv('parent-user', 'teacher-jenkins', [
      msg('teacher-jenkins', 'Please encourage Elena to participate more in class discussions — her writing is excellent.', isoMinus(1, 2, 0)),
    ]),
    conv('parent-user', 'teacher-chen', [
      msg('teacher-chen', 'Your daughter shows great potential in physics. We recommend considering advanced courses next year.', isoMinus(2, 3, 0)),
    ]),
    conv('parent-user', 'faculty-admin', [
      msg('faculty-admin', 'This is a reminder that Term 3 tuition is due by the 30th. You can pay via the Fees & Finance tab.', isoMinus(2, 8, 0)),
    ]),
  ];
}

/* ---------- Persistence ------------------------------------------ */
export function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const data = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
    return JSON.parse(raw);
  } catch {
    return seed();
  }
}

function saveAll(conversations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  // Notify listeners in the same tab (storage event only fires in other tabs)
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

/* Reset to seed data (handy for demos). */
export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
  loadAll();
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

/* All conversations a user takes part in, sorted by most recent. */
export function conversationsFor(userId) {
  return loadAll()
    .filter((c) => c.participants.includes(userId))
    .map((c) => {
      const otherId = c.participants.find((p) => p !== userId);
      const last = c.messages[c.messages.length - 1];
      const unread = c.messages.filter((m) => m.senderId !== userId && !m.read).length;
      return { ...c, otherId, other: getParticipant(otherId), last, unread };
    })
    .sort((a, b) => new Date(b.last?.ts || 0) - new Date(a.last?.ts || 0));
}

export function getConversation(userId, otherId) {
  const id = pairId(userId, otherId);
  const all = loadAll();
  let c = all.find((x) => x.id === id);
  if (!c) {
    c = { id, participants: [userId, otherId], messages: [] };
    all.push(c);
    saveAll(all);
  }
  const last = c.messages[c.messages.length - 1];
  return { ...c, otherId, other: getParticipant(otherId), last };
}

export function sendMessage(userId, otherId, text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return;
  const id = pairId(userId, otherId);
  const all = loadAll();
  let c = all.find((x) => x.id === id);
  if (!c) {
    c = { id, participants: [userId, otherId], messages: [] };
    all.push(c);
  }
  c.messages.push(msg(userId, trimmed, new Date().toISOString()));
  saveAll(all);
}

/* Mark every inbound message in a thread as read. */
export function markRead(userId, otherId) {
  const id = pairId(userId, otherId);
  const all = loadAll();
  const c = all.find((x) => x.id === id);
  if (!c) return;
  let changed = false;
  c.messages.forEach((m) => {
    if (m.senderId !== userId && !m.read) {
      m.read = true;
      changed = true;
    }
  });
  if (changed) saveAll(all);
}

export function totalUnread(userId) {
  return conversationsFor(userId).reduce((sum, c) => sum + c.unread, 0);
}

/* Subscribe to any change (this tab or another tab). Returns unsubscribe. */
export function subscribe(callback) {
  const onCustom = () => callback();
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener(EVENT_NAME, onCustom);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, onCustom);
    window.removeEventListener('storage', onStorage);
  };
}
