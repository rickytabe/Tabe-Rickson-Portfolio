"use client";

import { useState, useEffect } from "react";
import { FaXTwitter, FaLinkedin, FaFacebook, FaWhatsapp, FaCheck, FaCopy } from "react-icons/fa6";

type ShareWidgetProps = {
  url: string;
  title: string;
};

export default function ShareWidget({ url, title }: ShareWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    // Ensuring this only runs on the client to avoid hydration mismatch
    setFullUrl(`${window.location.origin}${url}`);
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl || `https://taberickson.com${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareUrl = fullUrl || `https://taberickson.com${url}`;

  const shareLinks = [
    {
      name: "Twitter",
      icon: <FaXTwitter size={18} />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={18} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={18} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={18} />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + shareUrl)}`,
    }
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-mono text-foreground/50 uppercase tracking-widest mr-2">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full border border-card-border bg-card-bg text-foreground/70 hover:text-[#39FF14] hover:border-[#39FF14]/50 transition-all shadow-sm"
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="p-2 rounded-full border border-card-border bg-card-bg text-foreground/70 hover:text-[#39FF14] hover:border-[#39FF14]/50 transition-all shadow-sm"
        aria-label="Copy link"
      >
        {copied ? <FaCheck size={18} className="text-[#39FF14]" /> : <FaCopy size={18} />}
      </button>
    </div>
  );
}
