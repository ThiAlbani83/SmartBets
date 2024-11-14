import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { jwtDecode } from "jwt-decode";

const InvitedUserRegistration = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { registerInvitedUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setFormData((prev) => ({
        ...prev,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      }));
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      await registerInvitedUser({
        token,
        password: formData.password
      });
      navigate("/login");
    } catch (error) {
      console.error(error); // Add this to see the specific error
      alert("Error registering user");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={formData.name}
          disabled
          className="border-b-2 w-80"
        />
        <input
          type="email"
          value={formData.email}
          disabled
          className="border-b-2 w-80"
        />
        <input
          type="text"
          value={formData.role}
          disabled
          className="border-b-2 w-80"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="border-b-2 focus:outline-none w-80"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className="border-b-2 focus:outline-none w-80"
        />
        <button className="px-3 py-1 text-white rounded-md w-fit bg-primaryLight">
          Register
        </button>
      </form>
    </div>
  );
};

export default InvitedUserRegistration;
