import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { FaLinkedin, FaInstagram, FaGithub, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"" | "success" | "error">("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section className="min-h-screen bg-black text-white px-6 pt-32 pb-24">
      {/* pt-32 pushes content below navbar */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* Left */}
        <div>
          <h1 className="text-5xl font-black mb-6">
            Get in <span className="text-green-400">Touch</span>
          </h1>

          <p className="text-gray-400 mb-10 max-w-md">
            Have questions, suggestions, or want to collaborate with the GFG Student Chapter?
            Drop us a message. We’d love to hear from you.
          </p>

          <div className="space-y-6 text-gray-300">
            <div className="flex items-center gap-4">
              <FiMail className="text-green-400" />
              <span>geeksforgeeks@rgipt.ac.in</span>
            </div>

            <div className="flex items-center gap-4">
              <FiPhone className="text-green-400" />
              <span>+91-8299857823</span>
            </div>

            <div className="flex items-center gap-4">
              <FiMapPin className="text-green-400" />
              <span>RGIPT, Jais, Amethi, Uttar Pradesh</span>
            </div>
          </div>

          <div className="flex gap-5 mt-10">
            <a href="https://www.linkedin.com/company/geeksforgeeks-rgipt-student-chapter/" target="_blank" className="p-3 rounded-full border border-white/10 hover:bg-white/10 transition">
              <FaLinkedin className="text-xl text-green-400" />
            </a>
            <a href="https://www.instagram.com/gfg_rgipt/" target="_blank" className="p-3 rounded-full border border-white/10 hover:bg-white/10 transition">
              <FaInstagram className="text-xl text-green-400" />
            </a>
            <a href="https://wa.me/918299857823" target="_blank" className="p-3 rounded-full border border-white/10 hover:bg-white/10 transition">
              <FaWhatsapp className="text-xl text-green-400" />
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-black border border-white/10"
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-black border border-white/10"
            />

            <textarea
              placeholder="Your Message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-black border border-white/10 resize-none"
            />

            {status === "error" && (
              <p className="text-sm text-red-400">Please fill all fields.</p>
            )}
            {status === "success" && (
              <p className="text-sm text-green-400">Message sent successfully 🚀</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-500 text-black font-semibold flex items-center justify-center gap-2 hover:bg-green-400 transition"
            >
              Send Message <FiSend />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;