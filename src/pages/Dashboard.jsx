
import React, { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow p-4">{children}</div>
);
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ onClick, children, className, variant }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded ${className}`}>
    {children}
  </button>
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [designs, setDesigns] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(setUser)
      .catch(() => (window.location.href = "/login"));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/dashboard`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDesigns(data.designs || []));
  }, [user]);

  const handleLogout = () => {
    fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUser(null);
      window.location.href = "/login";
    });
  };

  const handleDownloadPDF = async (design) => {
    const email = prompt("Enter your email to receive a PDF of this design:");
    if (!email) return;

    const response = await fetch(`${API_URL}/email-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: `/results/${design}`,
        products: [],
        email,
      }),
    });

    const result = await response.json();
    alert(result.status || "PDF sent.");
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-indigo-50 to-white">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-14 h-14 rounded-full border-4 border-indigo-300 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-indigo-700 tracking-tight leading-tight">
              Imagine Creative Living
            </h1>
            <p className="text-sm text-indigo-500 font-medium italic">
              Where AI meets interior inspiration
            </p>
          </div>
        </div>
        <Button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600">
          Logout
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <div className="grid md:grid-cols-2 gap-6">
          <img
            src="/static/william-morris-room.jpg"
            alt="Maximalist Interior Design"
            className="rounded-xl object-cover w-full h-80 shadow"
          />
          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-2">Design Your Dream Space with AI</h2>
            <p className="text-gray-700 text-md">
              Imagine Creative Living (icl.co) is your intelligent partner for reimagining interiors. Upload a photo of your room and describe your ideal vibe—from maximalist elegance to cozy minimalism—and our AI transforms it into a stunning new design. 
              You’ll receive a beautiful, AI-rendered image along with itemized product recommendations you can buy instantly. Save your designs, email them as PDF, or revisit past projects—all in one beautifully simple dashboard.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-medium mb-4">Your Past Designs</h2>

      {designs.length === 0 ? (
        <p className="text-gray-600">No designs saved yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {designs.map((design, idx) => (
            <Card key={idx} className="overflow-hidden shadow-lg">
              <CardContent className="p-4">
                <img
                  src={`${API_URL}/results/${design}`}
                  alt={design}
                  className="rounded w-full object-cover h-60 mb-3"
                />
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-700 truncate">{design}</p>
                  <Button
                    variant="link"
                    className="text-indigo-600 p-0"
                    onClick={() => window.open(`${API_URL}/results/${design}`, '_blank')}
                  >
                    View
                  </Button>
                </div>
                <Button
                  onClick={() => handleDownloadPDF(design)}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Email Me This as PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
