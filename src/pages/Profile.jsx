/**
 * Profile.jsx
 * Owner: Ryan
 * Description: Page for viewing and editing user profile.
 */

/**
 * Profile.jsx
 * Owner: Ryan
 * Description: Page for viewing and editing user profile.
 */

import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { getUserById, updateUser } from "../api/userAPI";

export default function Profile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const data = await getUserById(user.id, token);
      setProfile(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "",
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUser(user.id, formData, token);
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  if (!user) return <div className="page-message">Please log in to view profile.</div>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>

      {!profile ? (
        <p className="profile-loading">Loading...</p>
      ) : (
        <>
          {isEditing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <label className="profile-label">
                Name:
                <input
                  className="profile-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
              <label className="profile-label">
                Email:
                <input
                  className="profile-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <label className="profile-label">
                Role:
                <input
                  className="profile-input"
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled
                />
              </label>
              <div className="profile-actions">
                <button className="profile-button-save" type="submit">Save</button>
                <button
                  className="profile-button-cancel"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <p className="profile-info">Email: {profile.email}</p>
              <p className="profile-info">Name: {profile.name}</p>
              <p className="profile-info">Role: {profile.role}</p>
              <button
                className="profile-button-edit"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}



// TODO: Fetch and display user data
// - Allow editing user info
// - Connect with userAPI.js for updates


