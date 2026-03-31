// ============================================================
// auth.js – Login & Register
// ============================================================

// ── Register ─────────────────────────────────────────────────
async function handleRegister(e) {
  e.preventDefault();
  hideAlert('regAlert');

  const fullName = document.getElementById('fullName').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirmPassword').value;

  if (!fullName || !email || !password || !confirm) {
    return showAlert('regAlert', 'All fields are required.');
  }
  if (password !== confirm) {
    return showAlert('regAlert', 'Passwords do not match.');
  }
  if (password.length < 6) {
    return showAlert('regAlert', 'Password must be at least 6 characters.');
  }

  const btn = document.getElementById('regBtn');
  btn.disabled = true;
  btn.textContent = 'Creating account...';

  try {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password })
    });
    showAlert('regAlert', data.message || 'Registered! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'login.html', 1500);
  } catch (err) {
    showAlert('regAlert', err.message || 'Registration failed.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
}

// ── Login ────────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  hideAlert('loginAlert');

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    return showAlert('loginAlert', 'Please enter email and password.');
  }

  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = 'Signing in...';

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setUser({ id: data.id, fullName: data.fullName, email: data.email });
    window.location.href = 'dashboard.html';
  } catch (err) {
    showAlert('loginAlert', err.message || 'Invalid email or password.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

// ── Attach listeners on page load ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const regForm   = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if (regForm)   regForm.addEventListener('submit', handleRegister);
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // If already logged in, redirect to dashboard
  if (getUser() && (regForm || loginForm)) {
    window.location.href = 'dashboard.html';
  }
});
