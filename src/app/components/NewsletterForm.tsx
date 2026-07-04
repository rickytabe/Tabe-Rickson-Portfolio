"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import toast from "react-hot-toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Add to Firestore
      await addDoc(collection(db, "subscribers"), {
        email,
        firstName,
        createdAt: serverTimestamp(),
      });
      
      setIsSuccess(true);
      toast.success("Subscribed successfully!");
      setEmail("");
      setFirstName("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full bg-transparent border border-foreground/30 dark:border-foreground/10 focus:border-[#39FF14]/50 px-5 py-4 text-sm font-inter text-foreground placeholder:text-foreground/25 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(57,255,20,0.08)]";
  const labelClasses = "block text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/40 mb-2";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-20 lg:mt-32 w-full border border-[#39FF14]/30 bg-[#39FF14]/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-card-bg/20 backdrop-blur-sm z-0"></div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#39FF14] z-10"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#39FF14] z-10"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#39FF14] z-10"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#39FF14] z-10"></div>

      <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-10 items-center justify-between">
        <div className="md:w-1/2">
          <h3 className="text-2xl md:text-3xl font-bold font-sans text-foreground mb-4 tracking-tight">
            Join the <span className="text-[#39FF14]">Inner Circle</span>
          </h3>
          <p className="text-foreground/70 font-inter text-sm md:text-base max-w-md leading-relaxed">
            Get notified when I drop a new tech deep-dive or ship a new product. No spam, just high-signal updates straight to your inbox.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 bg-[#39FF14]/10 border border-[#39FF14]/50 p-6"
              >
                <div className="w-10 h-10 rounded-full border border-[#39FF14] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-foreground font-bold font-sans text-lg">You&apos;re in!</p>
                  <p className="text-foreground/60 font-inter text-sm">Thanks for subscribing. Talk soon.</p>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full py-4 text-[11px] font-mono font-bold tracking-[0.3em] uppercase text-[#121212] overflow-hidden transition-all duration-300 disabled:opacity-50"
                  style={{ backgroundColor: "#39FF14" }}
                >
                  <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                  <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-background transition-colors duration-300">
                    {isSubmitting ? "SUBSCRIBING..." : "SUBSCRIBE NOW"}
                  </span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
