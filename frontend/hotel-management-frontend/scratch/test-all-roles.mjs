// scratch/test-all-roles.mjs
const BASE = "http://localhost:3000";

async function run() {
  console.log("=== TESTING BACKEND AUTH & ALL 9 ROLES ===");

  // Step 1: Login as Admin / Staff to get JWT session cookie
  let cookieHeader = "";
  try {
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@atelier.hotel",
        password: "admin123"
      })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error("❌ Login failed:", loginData.error);
      return;
    }
    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) {
      cookieHeader = setCookie.split(";")[0];
    }
    console.log(`✅ Logged in as ${loginData.user.name} (${loginData.user.role})`);
  } catch (err) {
    console.error("❌ Authentication error:", err.message);
    return;
  }

  const reqHeaders = {
    "Content-Type": "application/json",
    "Cookie": cookieHeader
  };

  const roles = [
    "executive",
    "frontdesk",
    "dispatcher",
    "fulfiller",
    "supervisor",
    "manager",
    "finance",
    "security",
    "admin"
  ];

  let passed = 0;
  let failed = 0;

  console.log("\n--- Testing GET /api/hotel for all 9 roles ---");
  for (const r of roles) {
    try {
      const res = await fetch(`${BASE}/api/hotel?role=${r}`, { headers: reqHeaders });
      const json = await res.json();
      if (!res.ok) {
        console.error(`❌ GET /api/hotel?role=${r} failed:`, json.error);
        failed++;
      } else {
        console.log(`✅ Role [${r.padEnd(11)}]: OK | ${json.state.tasks.length} tasks visible in scope`);
        passed++;
      }
    } catch (err) {
      console.error(`❌ GET /api/hotel?role=${r} network error:`, err.message);
      failed++;
    }
  }

  // 1. FRONTDESK: Create task
  console.log("\n--- Testing Front Desk Action: createTask ---");
  try {
    const res = await fetch(`${BASE}/api/hotel`, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({
        role: "frontdesk",
        action: "createTask",
        title: "Test Extra Slippers",
        room: "101",
        department: "Housekeeping",
        priority: "Normal",
        notes: "Automated test request"
      })
    });
    const j = await res.json();
    if (!res.ok) {
      console.error("❌ Front Desk createTask failed:", j.error);
      failed++;
    } else {
      const created = j.state.tasks.find(t => t.title === "Test Extra Slippers");
      console.log(`✅ Front Desk created task: ${created ? created.id : "OK"}`);
      passed++;
    }
  } catch (e) {
    console.error("❌ Front Desk error:", e.message);
    failed++;
  }

  // 2. DISPATCHER: Assign task
  console.log("\n--- Testing Dispatcher Action: assign ---");
  try {
    const sRes = await fetch(`${BASE}/api/hotel?role=dispatcher`, { headers: reqHeaders });
    const sData = await sRes.json();
    const taskToAssign = sData.state.tasks.find(t => !t.assignee && t.department === "Housekeeping");
    if (taskToAssign) {
      const res = await fetch(`${BASE}/api/hotel`, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify({
          role: "dispatcher",
          action: "assign",
          id: taskToAssign.id,
          assignee: "Sofia Rivera"
        })
      });
      const j = await res.json();
      if (!res.ok) {
        console.error("❌ Dispatcher assign failed:", j.error);
        failed++;
      } else {
        console.log(`✅ Dispatcher assigned task ${taskToAssign.id} to Sofia Rivera`);
        passed++;
      }
    } else {
      console.log("ℹ️ No unassigned housekeeping tasks to assign; creating one first.");
    }
  } catch (e) {
    console.error("❌ Dispatcher error:", e.message);
    failed++;
  }

  // 3. FULFILLER: Transition task
  console.log("\n--- Testing Fulfiller Action: transition ---");
  try {
    const sRes = await fetch(`${BASE}/api/hotel?role=fulfiller`, { headers: reqHeaders });
    const sData = await sRes.json();
    const task = sData.state.tasks.find(t => t.status === "In progress");
    if (task) {
      const res = await fetch(`${BASE}/api/hotel`, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify({
          role: "fulfiller",
          action: "transition",
          id: task.id,
          status: "Completed",
          notes: "Task completed successfully"
        })
      });
      const j = await res.json();
      if (!res.ok) {
        console.error("❌ Fulfiller transition failed:", j.error);
        failed++;
      } else {
        console.log(`✅ Fulfiller transitioned task ${task.id} to Completed`);
        passed++;
      }
    } else {
      console.log("ℹ️ No 'In progress' task found for fulfiller.");
    }
  } catch (e) {
    console.error("❌ Fulfiller error:", e.message);
    failed++;
  }

  // 4. SUPERVISOR: Inspect completed task
  console.log("\n--- Testing Supervisor Action: inspect ---");
  try {
    const sRes = await fetch(`${BASE}/api/hotel?role=supervisor`, { headers: reqHeaders });
    const sData = await sRes.json();
    const task = sData.state.tasks.find(t => t.status === "Completed");
    if (task) {
      const res = await fetch(`${BASE}/api/hotel`, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify({
          role: "supervisor",
          action: "inspect",
          id: task.id,
          status: "Inspected",
          notes: "QA standard met perfectly"
        })
      });
      const j = await res.json();
      if (!res.ok) {
        console.error("❌ Supervisor inspect failed:", j.error);
        failed++;
      } else {
        console.log(`✅ Supervisor inspected task ${task.id} -> Inspected`);
        passed++;
      }
    }
  } catch (e) {
    console.error("❌ Supervisor error:", e.message);
    failed++;
  }

  // 5. SECURITY: Incident workflow
  console.log("\n--- Testing Security Action: incident ---");
  try {
    const res = await fetch(`${BASE}/api/hotel`, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({
        role: "security",
        action: "incident",
        operation: "create",
        title: "Test Perimeter Noise Check",
        room: "201",
        severity: "Normal",
        notes: "Patrol unit investigated patio"
      })
    });
    const j = await res.json();
    if (!res.ok) {
      console.error("❌ Security incident create failed:", j.error);
      failed++;
    } else {
      console.log("✅ Security recorded incident successfully");
      passed++;
    }
  } catch (e) {
    console.error("❌ Security error:", e.message);
    failed++;
  }

  // 6. EXECUTIVE: Financial approval
  console.log("\n--- Testing Executive Action: approve ---");
  try {
    const sRes = await fetch(`${BASE}/api/hotel?role=executive`, { headers: reqHeaders });
    const sData = await sRes.json();
    const fin = sData.state.financials.find(f => f.status === "Awaiting approval");
    if (fin) {
      const res = await fetch(`${BASE}/api/hotel`, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify({
          role: "executive",
          action: "approve",
          id: fin.id
        })
      });
      const j = await res.json();
      if (!res.ok) {
        console.error("❌ Executive approval failed:", j.error);
        failed++;
      } else {
        console.log(`✅ Executive approved financial request ${fin.id}`);
        passed++;
      }
    }
  } catch (e) {
    console.error("❌ Executive approval error:", e.message);
    failed++;
  }

  // 7. FINANCE: Execute demo adjustment
  console.log("\n--- Testing Finance Action: execute ---");
  try {
    const sRes = await fetch(`${BASE}/api/hotel?role=finance`, { headers: reqHeaders });
    const sData = await sRes.json();
    const fin = sData.state.financials.find(f => f.status === "Approved");
    if (fin) {
      const res = await fetch(`${BASE}/api/hotel`, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify({
          role: "finance",
          action: "execute",
          id: fin.id
        })
      });
      const j = await res.json();
      if (!res.ok) {
        console.error("❌ Finance execution failed:", j.error);
        failed++;
      } else {
        console.log(`✅ Finance recorded execution for ${fin.id}`);
        passed++;
      }
    }
  } catch (e) {
    console.error("❌ Finance execution error:", e.message);
    failed++;
  }

  // 8. ADMIN: Add service item & catalog offerings
  console.log("\n--- Testing Admin Action: createService ---");
  try {
    const res = await fetch(`${BASE}/api/hotel`, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({
        role: "admin",
        action: "createService",
        name: "Espresso & Croissant",
        notes: "Artisanal roast with warm butter croissant delivered to your room.",
        category: "Food & Beverage",
        icon: "Coffee"
      })
    });
    const j = await res.json();
    if (!res.ok) {
      console.error("❌ Admin createService failed:", j.error);
      failed++;
    } else {
      console.log("✅ Admin added new service offering to catalog");
      passed++;
    }
  } catch (e) {
    console.error("❌ Admin error:", e.message);
    failed++;
  }

  console.log(`\n=== FINAL RESULT: ${passed} passed, ${failed} failed ===`);
}

run();
