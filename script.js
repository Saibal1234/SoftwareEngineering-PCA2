async function register() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;
  const message = document.getElementById('message');

  if (!name || !email || !password || !role) {
    message.textContent = "⚠️ All fields are required.";
    return;
  }

  try {
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    if (!res.ok) {
      message.textContent = data.message || "❌ Registration failed.";
    } else {
      message.textContent = "✅ Registered successfully! Please log in.";
    }
  } catch (err) {
    message.textContent = "🚫 Server error.";
    console.error(err);
  }
}

function loginPage() {
  // Replace this with your actual login page
  window.location.href = "login.html";
}
