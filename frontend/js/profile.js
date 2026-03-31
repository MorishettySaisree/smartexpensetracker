// ============================================================
// profile.js – Profile page
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  const user = requireAuth();
  if (!user) return;

  populateSidebarUser();
  setActiveNav('profile');

  await loadProfile(user.id);

  document.getElementById('profileForm').addEventListener('submit',
    e => handleUpdateProfile(e, user.id));

  document.getElementById('passwordForm').addEventListener('submit',
    e => handleChangePassword(e, user.id));

  document.getElementById('logoutBtn').addEventListener('click', logout);
});

// ── Load profile ─────────────────────────────────────────────
async function loadProfile(userId) {
  try {
    const data = await apiFetch(`/profile/${userId}`);
    document.getElementById('profileName').value  = data.fullName || '';
    document.getElementById('profileEmail').value = data.email || '';

    // Avatar initials
    const initials = (data.fullName || 'U').split(' ')
      .map(n => n[0]).join('').toUpperCase().slice(0, 2);
    document.getElementById('profileAvatar').textContent  = initials;
    document.getElementById('profileDisplayName').textContent = data.fullName;
    document.getElementById('profileDisplayEmail').textContent = data.email;
  } catch (err) {
    showAlert('profileAlert', 'Failed to load profile: ' + err.message);
  }
}

// ── Update profile ───────────────────────────────────────────
async function handleUpdateProfile(e, userId) {
  e.preventDefault();
  hideAlert('profileAlert');

  const fullName = document.getElementById('profileName').value.trim();
  const email    = document.getElementById('profileEmail').value.trim();

  if (!fullName || !email) {
    return showAlert('profileAlert', 'Name and email are required.');
  }

  const btn = document.getElementById('saveProfileBtn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    const data = await apiFetch(`/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ fullName, email })
    });
    // Update localStorage
    const user = getUser();
    user.fullName = data.fullName;
    user.email    = data.email;
    setUser(user);
    populateSidebarUser();

    document.getElementById('profileDisplayName').textContent  = data.fullName;
    document.getElementById('profileDisplayEmail').textContent = data.email;
    document.getElementById('profileAvatar').textContent =
      (data.fullName || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    showAlert('profileAlert', data.message || 'Profile updated!', 'success');
  } catch (err) {
    showAlert('profileAlert', err.message || 'Update failed.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  }
}

// ── Change password ──────────────────────────────────────────
async function handleChangePassword(e, userId) {
  e.preventDefault();
  hideAlert('passwordAlert');

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword     = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmNewPassword').value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return showAlert('passwordAlert', 'All password fields are required.');
  }
  if (newPassword !== confirmPassword) {
    return showAlert('passwordAlert', 'New passwords do not match.');
  }
  if (newPassword.length < 6) {
    return showAlert('passwordAlert', 'New password must be at least 6 characters.');
  }

  const btn = document.getElementById('changePasswordBtn');
  btn.disabled = true;
  btn.textContent = 'Changing...';

  try {
    const data = await apiFetch(`/profile/change-password/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
    showAlert('passwordAlert', data.message || 'Password changed!', 'success');
    document.getElementById('passwordForm').reset();
  } catch (err) {
    showAlert('passwordAlert', err.message || 'Failed to change password.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Change Password';
  }
}
