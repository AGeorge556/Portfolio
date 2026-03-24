import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";

export default function ContactSection() {
  const [state, handleSubmit] = useForm("meogyobe");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="contact-root">
      <h2 className="section-title section-title-center">Get In Touch</h2>

      <div className="contact-layout">
        {/* Left - Info */}
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="contact-intro">
            Have a project in mind or want to collaborate? I'd love to hear from you.
            Let's build something great together.
          </p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <MapPin size={18} />
              <span>Mokattam, Cairo, Egypt</span>
            </div>
            <div className="contact-detail-item">
              <Mail size={18} />
              <a href="mailto:gn.farag02@gmail.com">gn.farag02@gmail.com</a>
            </div>
            <div className="contact-detail-item">
              <Phone size={18} />
              <a href="tel:+201020012398">+20 102 001 2398</a>
            </div>
          </div>

          <div className="contact-socials">
            <a href="https://github.com/AGeorge556" target="_blank" rel="noopener noreferrer" className="contact-social-link">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/andrew-george-610535309" target="_blank" rel="noopener noreferrer" className="contact-social-link">
              <Linkedin size={20} />
            </a>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          className="contact-form-wrap"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {state.succeeded ? (
            <div className="contact-success">
              <div className="success-icon">
                <Send size={32} />
              </div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} />
              </div>

              <button type="submit" disabled={state.submitting} className="contact-submit-btn">
                {state.submitting ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
