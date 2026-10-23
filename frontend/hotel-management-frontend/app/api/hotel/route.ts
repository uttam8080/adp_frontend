import { applyAction, isRole, Role } from "@/lib/hotel-domain";
import { filterState, loadLocalState, saveLocalState } from "@/lib/local-store";


const json = (v: unknown, status = 200) =>
  Response.json(v, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: Request) {
  try {
    const role = (new URL(request.url).searchParams.get("role") || "executive") as Role;
    if (!isRole(role)) return json({ error: "Unknown role." }, 400);

    const { state, version } = loadLocalState();
    return json({ state: filterState(state, role), version });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not load the property." }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const b = (await request.json()) as Record<string, any>;
    if (!isRole(b.role)) return json({ error: "Unknown role." }, 400);

    const { state, version } = loadLocalState();
    
    // Check if staff profile is active
    if (!state.staff.some((s) => s.id === b.role && s.active)) {
      return json({ error: "This staff profile has been deactivated." }, 403);
    }

    if (b.action !== "revoke") {
      applyAction(state, b.role, b.action, b);
    } else if (!["frontdesk", "admin"].includes(b.role)) {
      return json({ error: "Not authorized." }, 403);
    }

    const nextVersion = saveLocalState(state, version);
    return json({ state: filterState(state, b.role), version: nextVersion });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Could not save this action.";
    return json({ error }, 422);
  }
}
