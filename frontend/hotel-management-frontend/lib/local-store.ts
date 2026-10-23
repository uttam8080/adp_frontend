import { seedState, visibleTasks, type HotelState, type Role } from "./hotel-domain";

// In-memory local state singleton for seamless standalone dev & demonstration
let globalState: HotelState = seedState();
let globalVersion: number = 1;

export function filterState(s: HotelState, role: Role): HotelState {
  const tasks = visibleTasks(s, role);
  const roomAccess = ["frontdesk", "executive", "admin"].includes(role);
  const money = ["frontdesk", "executive", "finance", "manager"].includes(role);
  const rooms = roomAccess ? s.rooms : [];

  return {
    ...s,
    tasks,
    rooms,
    financials: money
      ? role === "manager"
        ? s.financials.filter((f) => tasks.some((t) => t.room === f.room))
        : s.financials
      : [],
    incidents: role === "security" ? s.incidents : [],
    audit: role === "admin" ? s.audit : [],
    staff: ["fulfiller", "finance", "security"].includes(role) ? [] : s.staff,
    connectors: role === "admin" ? s.connectors : [],
    policies: ["manager", "admin"].includes(role) ? s.policies : [],
    messages: ["frontdesk", "dispatcher"].includes(role)
      ? s.messages.filter((m) => role === "frontdesk" || tasks.some((t) => t.room === m.room))
      : [],
    handovers: s.handovers.filter(
      (h) =>
        ["executive", "frontdesk"].includes(role) ||
        h.department === (role === "security" ? "Security" : "Housekeeping")
    ),
  };
}

export function loadLocalState() {
  if (!globalState.services || globalState.services.length === 0) {
    globalState.services = seedState().services;
  }
  return { state: globalState, version: globalVersion };
}

export function saveLocalState(nextState: HotelState, version: number) {
  globalState = nextState;
  globalVersion = version + 1;
  return globalVersion;
}
