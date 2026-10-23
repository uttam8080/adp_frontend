import { loadLocalState, saveLocalState } from "@/lib/local-store";


const json = (v: unknown, status = 200) =>
  Response.json(v, { status, headers: { "Cache-Control": "no-store" } });

// In-memory active guest session
let activeGuestRoom: string | null = "101";

export async function GET() {
  try {
    const { state } = loadLocalState();
    const room = state.rooms.find((r) => r.id === activeGuestRoom) || null;
    const tasks = room ? state.tasks.filter((t) => t.room === room.id) : [];
    const messages = room ? state.messages.filter((m) => m.room === room.id) : [];

    return json({
      room,
      rooms: state.rooms,
      tasks,
      messages,
      services: state.services || [],
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not load guest access." }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const b = (await request.json()) as Record<string, any>;
    const { state, version } = loadLocalState();

    if (b.action === "requestPassword") {
      return json({
        challenge: "demo-pass-123",
        message: "Demo password '123456' sent to registered email.",
      });
    }

    if (b.action === "verify") {
      activeGuestRoom = b.room;
      return json({ success: true, room: b.room });
    }

    if (b.action === "logout") {
      activeGuestRoom = null;
      return json({ success: true });
    }

    if (b.action === "createService") {
      if (!state.services) state.services = [];
      const id = "SRV-" + Math.floor(1000 + Math.random() * 9000);
      state.services.push({
        id,
        name: String(b.name || "Custom service").slice(0, 80),
        text: String(b.text || b.description || b.notes || "").slice(0, 300),
        icon: String(b.icon || "Sparkles"),
        category: String(b.category || "Housekeeping"),
      });
      saveLocalState(state, version);
      return json({ success: true, services: state.services });
    }

    if (b.action === "deleteService") {
      if (state.services) {
        state.services = state.services.filter((s) => s.id !== b.id);
        saveLocalState(state, version);
      }
      return json({ success: true, services: state.services });
    }

    if (b.action === "request") {
      const room = state.rooms.find((r) => r.id === (b.room || activeGuestRoom)) || state.rooms[0];
      if (room) {
        const matchingSvc = (state.services || []).find((s) => s.name.toLowerCase().trim() === String(b.service || "").toLowerCase().trim());
        const dept = matchingSvc?.category || b.department || "Housekeeping";
        state.tasks.unshift({
          id: "REQ-" + Math.floor(2500 + Math.random() * 500),
          title: String(b.service || "Guest request"),
          room: room.id,
          guest: room.guest || "Guest",
          department: dept,
          category: matchingSvc?.category || "Guest request",
          priority: "Normal",
          status: "Open",
          assignee: "",
          created: new Date().toISOString(),
          due: new Date(Date.now() + 30 * 60000).toISOString(),
          notes: String(b.notes || ""),
          caseId: "CASE-" + Math.floor(900 + Math.random() * 100),
          history: [{ at: new Date().toISOString(), text: "Guest submitted service request", actor: room.guest || "Guest" }],
        });
        saveLocalState(state, version);
      }
      return json({ success: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not complete this request." }, 500);
  }
}
