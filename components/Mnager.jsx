import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Mnager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const navigate = useNavigate();

  const getPasswords = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const res = await fetch("http://localhost:3000/api/passwords/fetch", {
      headers: {
        "auth-token": token
      }
    });
    const passwords = await res.json();
    setPasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    toast('Copied to clipboard!', { position: "top-right", autoClose: 1000 });
    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    passwordRef.current.type = ref.current.src.includes("eyecross") ? "text" : "password";
    ref.current.src = ref.current.src.includes("eyecross") ? "/eye.png" : "/eyecross.png";
  };

  const savePassword = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
      const idToSave = form.id || uuidv4();

      if (form.id) {
        await fetch("http://localhost:3000/api/passwords/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token
          },
          body: JSON.stringify({ id: form.id })
        });
      }

      const res = await fetch("http://localhost:3000/api/passwords/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({ ...form, id: idToSave })
      });

      if (res.ok) {
        toast('Saved successfully!', { position: "top-right", autoClose: 1000 });
        setForm({ site: "", username: "", password: "" });
        getPasswords();
      } else {
        toast('Error saving password!', { position: "top-right", autoClose: 1000 });
      }
    } else {
      toast('Error: Fill all fields properly!', { position: "top-right", autoClose: 1000 });
    }
  };

  const editPassword = (id) => {
    setForm({ ...passwordArray.find(i => i.id === id), id });
    setPasswordArray(passwordArray.filter(item => item.id !== id));
  };

  const deletePassword = async (id) => {
    if (confirm("Do you want to delete this?")) {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3000/api/passwords/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({ id })
      });
      toast('Password deleted!', { position: "top-right", autoClose: 1000 });
      getPasswords();
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer />

      {/* Background glow */}
      <div className="absolute -z-10 h-full w-full bg-green-50">
        <div className="absolute top-[-150px] left-[50%] -translate-x-[50%] w-[600px] h-[600px] bg-green-400 opacity-20 rounded-full blur-[120px] z-0"></div>
      </div>

      <div className="p-4 min-h-[88vh] flex flex-col items-center">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold mt-[50px] text-center text-green-800 drop-shadow">
          <span className="text-green-500">&lt;</span>Pass<span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg mt-1 mb-6">Your secure password manager</p>

        {/* Form Card */}
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md max-w-3xl w-full space-y-4 border border-white/40">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            name="site"
            className="bg-white/60 placeholder-gray-700 text-black font-medium rounded-xl px-4 py-2 border border-white/30 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            type="text"
          />
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              name="username"
              className="bg-white/60 placeholder-gray-700 text-black font-medium rounded-xl px-4 py-2 border border-white/30 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              type="text"
            />
            <div className="relative w-full">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                name="password"
                className="bg-white/60 placeholder-gray-700 text-black font-medium rounded-xl px-4 py-2 border border-white/30 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
                type="password"
              />
              <span className="absolute right-2 top-2 cursor-pointer" onClick={showPassword}>
                <img ref={ref} className="w-6" src="/eyecross.png" alt="toggle visibility" />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="bg-green-600 hover:bg-green-700 font-semibold mx-auto rounded-xl px-6 py-2 transition-all duration-200 shadow-md flex items-center gap-2"
          >
            <lord-icon 
              src="https://cdn.lordicon.com/efxgwrkc.json"
              trigger="hover"
              colors="primary:#000000"
              style={{ width: "25px", height: "25px" }}>
            </lord-icon>
            Save Password
          </button>
        </div>

        {/* Password Table */}
        <div className="mt-10 w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div className="text-gray-600">No passwords to show</div>}
          {passwordArray.length > 0 && (
            <div className="overflow-x-auto rounded-xl shadow-md">
              <table className="min-w-full bg-white/30 backdrop-blur-md border border-white/30 rounded-xl text-black">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="py-2">Site</th>
                    <th className="py-2">Username</th>
                    <th className="py-2">Password</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {passwordArray.map((item, index) => (
                    <tr key={index} className="hover:bg-green-100 transition duration-200">
                      <td className="py-2 border">{item.site}
                        <span onClick={() => copyText(item.site)} className="inline-block ml-2 cursor-pointer">
                          <lord-icon src="https://cdn.lordicon.com/jectmwqf.json" trigger="hover" style={{ width: "20px", height: "20px" }}></lord-icon>
                        </span>
                      </td>
                      <td className="py-2 border">{item.username}
                        <span onClick={() => copyText(item.username)} className="inline-block ml-2 cursor-pointer">
                          <lord-icon src="https://cdn.lordicon.com/jectmwqf.json" trigger="hover" style={{ width: "20px", height: "20px" }}></lord-icon>
                        </span>
                      </td>
                      <td className="py-2 border">{"*".repeat(item.password.length)}
                        <span onClick={() => copyText(item.password)} className="inline-block ml-2 cursor-pointer">
                          <lord-icon src="https://cdn.lordicon.com/jectmwqf.json" trigger="hover" style={{ width: "20px", height: "20px" }}></lord-icon>
                        </span>
                      </td>
                      <td className="py-2 border flex justify-center gap-2">
                        <span onClick={() => editPassword(item.id)} className="cursor-pointer">
                          <lord-icon src="https://cdn.lordicon.com/exymduqj.json" trigger="hover" style={{ width: "24px", height: "24px" }}></lord-icon>
                        </span>
                        <span onClick={() => deletePassword(item.id)} className="cursor-pointer">
                          <lord-icon src="https://cdn.lordicon.com/jzinekkv.json" trigger="hover" style={{ width: "24px", height: "24px" }}></lord-icon>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Mnager;
