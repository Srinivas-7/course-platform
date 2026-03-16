import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
      }
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <div className="bg-gray-900 p-6 rounded-2xl">
        <p>Total Sales: ₹0</p>
        <p>Total Students: 0</p>
      </div>
    </div>
  );
}