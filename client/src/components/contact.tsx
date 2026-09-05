import {
  FaWhatsapp,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import { FaLocationDot, FaXTwitter, FaPhone } from "react-icons/fa6";

const Contact = () => {
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.454522436856!2d81.50711777595568!3d26.265827404249677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39904944d37536d7%3A0xc6c769485601b332!2sRajiv%20Gandhi%20Institute%20of%20Petroleum%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  return (
    <footer className="relative mt-20 border-t border-green-500/20 bg-black overflow-hidden">
      {/* Thin animated glow line at top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                Get in <span className="text-green-500">Touch</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md">
                Have questions about workshops, hackathons, or membership? Our
                team is here to help.
              </p>
            </div>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover:border-green-500/50 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">
                  <FaLocationDot className="text-green-400 text-xl" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Our Location</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Rajiv Gandhi Institute of Petroleum Technology,
                    <br />
                    Jais, Amethi, Uttar Pradesh - 229304
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover:border-green-500/50 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">
                  <FaEnvelope className="text-green-400 text-xl" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Email Us</h4>
                  <a
                    href="mailto:gfg@rgipt.ac.in"
                    className="text-gray-400 text-sm hover:text-green-400 transition-colors"
                  >
                    geeksforgeeks@rgipt.ac.in
                  </a>
                </div>
              </div>

              {/* Phone (Optional/Placeholder) */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover:border-green-500/50 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">
                  <FaPhone className="text-green-400 text-xl" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Call Us</h4>
                  <p className="text-gray-400 text-sm">+91-8299857823</p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-6">
              {[
                {
                  icon: <FaLinkedin />,
                  link: "https://www.linkedin.com/company/geeksforgeeks-rgipt-student-chapter/",
                  label: "LinkedIn",
                },
                {
                  icon: <FaInstagram />,
                  link: "https://www.instagram.com/gfg_rgipt/",
                  label: "Instagram",
                },
                {
                  icon: <FaWhatsapp />,
                  link: "https://wa.me/918299857823",
                  label: "WhatsApp",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-green-500 hover:border-green-500 transform hover:-translate-y-1 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Interactive Map */}
          <div className="relative group lg:mt-4">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>

            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border border-green-500/30 shadow-2xl bg-black">
              <iframe
                title="RGIPT Jais Campus Map"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  // This filter makes the map dark to match the GFG theme
                  filter:
                    "grayscale(1) invert(0.9) contrast(1.2) brightness(0.8) hue-rotate(90deg)",
                }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {/* Optional: Add a subtle green gradient overlay to make it look even cooler */}
              <div className="absolute inset-0 pointer-events-none border-[1px] border-green-500/10 rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 tracking-wide">
              © {new Date().getFullYear()} GFG RGIPT Student Chapter.
            </p>
          </div>

          <div className="flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-gray-600">
            <a href="#" className="hover:text-green-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-green-500 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-green-500 transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
