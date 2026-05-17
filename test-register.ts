async function run() {
  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "eren9523", password: "password123" })
    });
    console.log(res.status, res.statusText);
    const text = await res.text();
    console.log("Body:", text);
  } catch (e) {
    console.error("Fetch failed", e);
  }
}
run();
