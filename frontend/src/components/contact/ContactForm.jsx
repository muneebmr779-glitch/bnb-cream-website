import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import { sendContactMessage } from '../../services/contactService';
import { getErrorMessage } from '../../services/api';
import { isValidEmail, required } from '../../utils/validators';

const initialState = { name: '', email: '', phone: '', subject: '', message: '' };

const ContactForm = ({ isEmergency = false }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!required(form.name)) next.name = 'Name is required';
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email';
    if (!required(form.subject)) next.subject = 'Subject is required';
    if (!required(form.message)) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await sendContactMessage({ ...form, isEmergency });
      toast.success("Message sent! We'll get back to you shortly.");
      setForm(initialState);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6 sm:p-8">
      {isEmergency && (
        <div className="rounded-xl bg-accent-600/10 px-4 py-3 text-sm font-medium text-accent-600 dark:text-accent-400">
          Marked as an emergency request — our team will prioritize your message.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} className="input" placeholder="Your full name" />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+1 (555) 000-0000" />
        </div>
        <div>
          <label className="label" htmlFor="subject">Subject</label>
          <input id="subject" name="subject" value={form.subject} onChange={handleChange} className="input" placeholder="How can we help?" />
          {errors.subject && <p className="field-error">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="input resize-none"
          placeholder="Tell us more about your vehicle or request..."
        />
        {errors.message && <p className="field-error">{errors.message}</p>}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Sending...' : (<><Send className="h-4 w-4" /> Send Message</>)}
      </button>
    </form>
  );
};

export default ContactForm;
