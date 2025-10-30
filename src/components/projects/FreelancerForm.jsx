// src/components/freelancers/FreelancerForm.jsx
import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function FreelancerForm({ onSubmitted }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    years_experience: 0,
    hourly_rate: 0,
    cv: null,
    portfolio: null,
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axiosClient.post("/freelancers/submit", data);
      alert("Documents submitted successfully!");
      onSubmitted && onSubmitted();
    } catch (err) {
      console.error(err);
      alert("Failed to submit.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
      <textarea name="bio" placeholder="Bio" onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="number" name="years_experience" placeholder="Years of Experience" onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="number" name="hourly_rate" placeholder="Hourly Rate" onChange={handleChange} className="w-full p-2 border rounded" />
      <div>
        <label>Upload CV</label>
        <input type="file" name="cv" onChange={handleChange} />
      </div>
      <div>
        <label>Upload Portfolio</label>
        <input type="file" name="portfolio" onChange={handleChange} />
      </div>
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
    </form>
  );
}
