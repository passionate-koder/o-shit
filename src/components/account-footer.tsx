import Link from "next/link";
import { Linkedin, Instagram } from "lucide-react";
export function AccountFooter() {
  return (
    <footer className="account-footer">
      <div>
        <Link href="/legal/privacy-policy">Privacy Policy</Link>
        <Link href="/legal/terms-and-conditions">Terms &amp; Conditions</Link>
      </div>
      <p>
        © 2026 <Link href="/">HackCulture</Link>. All rights reserved.
      </p>
      <div>
        <a
          href="https://www.linkedin.com/company/hackculture/"
          aria-label="LinkedIn"
        >
          <Linkedin size={20} />
        </a>
        <a
          href="https://www.instagram.com/hackculture.io/"
          aria-label="Instagram"
        >
          <Instagram size={20} />
        </a>
        <a href="https://x.com/Hack_Culture" aria-label="X">
          𝕏
        </a>
        <a
          href="https://chat.whatsapp.com/GBUGxhbjhaz4xcWhzX5pIu"
          aria-label="WhatsApp"
        >
          ◉
        </a>
      </div>
    </footer>
  );
}
