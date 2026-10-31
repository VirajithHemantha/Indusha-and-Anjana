import React, { useState } from 'react';
import { Copy, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
  BRIDE_NAME,
  GROOM_NAME,
  PREFIXES,
  formatDisplayName,
  buildInvitationLink,
  buildInvitationMessage,
} from './config';

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for browsers without the async clipboard API (e.g. non-HTTPS)
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

export function AdminPage() {
  const [prefix, setPrefix] = useState<string>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const displayName = formatDisplayName(prefix, guestName);
  const message = generatedLink ? buildInvitationMessage(displayName, generatedLink) : '';

  const handleGenerate = () => {
    if (!guestName.trim()) return;
    setGeneratedLink(buildInvitationLink(window.location.origin, prefix, guestName));
  };

  // Clear a generated link once the inputs change so a stale link can't be copied
  const handlePrefixChange = (value: string) => {
    setPrefix(value);
    setGeneratedLink('');
  };

  const handleNameChange = (value: string) => {
    setGuestName(value);
    setGeneratedLink('');
  };

  const handleCopyLink = async () => {
    await copyText(generatedLink);
    toast.success('Link copied!');
  };

  const handleCopyMessage = async () => {
    await copyText(message);
    toast.success('Message copied!');
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-brand-beige focus:ring-2 focus:ring-brand-beige-deep focus:border-transparent outline-none transition-all bg-white font-sans';
  const copyButtonClass =
    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-beige-deep text-brand-beige-deep font-sans text-xs tracking-[0.15em] uppercase hover:bg-brand-beige/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-brand-ivory py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgba(176,137,104,0.15)] overflow-hidden border border-brand-beige/50">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-2 text-stone-800">Link Generator</h2>
            <p className="text-stone-500 font-sans text-sm uppercase tracking-[0.2em]">
              {BRIDE_NAME} & {GROOM_NAME}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Select Prefix
              </label>
              <select
                id="prefix"
                value={prefix}
                onChange={(e) => handlePrefixChange(e.target.value)}
                className={inputClass}
              >
                {PREFIXES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Guest Name
              </label>
              <input
                type="text"
                id="guestName"
                value={guestName}
                onChange={(e) => handleNameChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Sanjaya"
                className={inputClass}
              />
            </div>

            {displayName && (
              <p className="text-center font-serif text-lg text-stone-600">
                Greeting: <span className="font-semibold text-brand-beige-deep">Dear {displayName} ❤️</span>
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={!guestName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-beige-deep text-white font-sans text-sm tracking-[0.2em] uppercase shadow-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon className="w-5 h-5" />
              Generate Link
            </button>

            {generatedLink && (
              <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50 space-y-4">
                <div>
                  <p className="text-sm text-stone-600 mb-2 font-medium tracking-wide">Generated Link:</p>
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-sm bg-white border border-brand-beige/50 rounded-md text-brand-beige-deep break-all hover:underline"
                  >
                    {generatedLink}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-stone-600 mb-2 font-medium tracking-wide">Message Preview:</p>
                  <pre className="whitespace-pre-wrap break-words px-3 py-3 text-sm bg-white border border-brand-beige/50 rounded-md text-stone-700 font-sans max-h-72 overflow-y-auto">
                    {message}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleCopyLink} disabled={!generatedLink} className={copyButtonClass}>
                <Copy className="w-4 h-4" />
                Copy Link Only
              </button>
              <button onClick={handleCopyMessage} disabled={!generatedLink} className={copyButtonClass}>
                <MessageCircle className="w-4 h-4" />
                Copy Full Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
