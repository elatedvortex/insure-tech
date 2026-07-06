"use client";

export default function SiteFooter() {
  return (
    <footer className="px-6 py-12 border-t border-surface-line/60 bg-paper text-ink">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="space-y-3">
          <h4 className="font-display text-sm">Designed for Social Impact</h4>
          <p className="text-sm text-ink-soft">Lemonade Inc. is a Public Benefit Corporation and certified B-Corp. Social impact is part of our legal mission and business model - not just marketing fluff</p>

          <div className="flex items-center gap-3 mt-3">
            <img src="https://marketing-edge-assets.lemonade.com/cdn-cgi/image/width=256,quality=75,format=auto,onerror=redirect/_next/static/media/nyse.b055bec6.png" alt="NYSE:LMND" className="h-6" />
            <div className="text-sm text-ink-soft">NYSE:LMND — Lemonade is listed on the New York Stock Exchange under the LMND symbol</div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <img src="https://marketing-edge-assets.lemonade.com/cdn-cgi/image/width=256,quality=75,format=auto,onerror=redirect/_next/static/media/a-rated.d69596b0.png" alt="A-Rated and Backed by Giants" className="h-6" />
            <div className="text-sm text-ink-soft">A-Rated and backed by trusted reinsurers and regulators</div>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm">Renters</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><a href="https://www.lemonade.com/renters" className="underline">Renters Insurance</a></li>
            <li><a href="https://www.lemonade.com/renters/explained/" className="underline">Renters Insurance Hub</a></li>
            <li><a href="https://www.lemonade.com/renters/explained/what-is-renters-insurance/" className="underline">What is Renters Insurance</a></li>
            <li><a href="https://www.lemonade.com/renters/explained/what-is-renters-insurance-and-whats-covered/" className="underline">Renters Insurance Coverage</a></li>
            <li><a href="https://www.lemonade.com/renters/explained/this-is-how-much-renters-insurance-actually-costs/" className="underline">Renters Insurance Cost</a></li>
            <li><a href="https://www.lemonade.com/renters/explained/getting-renters-insurance/" className="underline">How to Get Renters Insurance</a></li>
            <li><a href="https://www.lemonade.com/renters/explained/renters-and-car-insurance-bundle/" className="underline">Car and Renters Bundle</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm">Car & Auto</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><a href="https://www.lemonade.com/car" className="underline">Car Insurance</a></li>
            <li><a href="https://www.lemonade.com/car/explained/" className="underline">Car Insurance Hub</a></li>
            <li><a href="https://www.lemonade.com/car/explained/pay-per-mile-car-insurance/" className="underline">Pay Per Mile</a></li>
            <li><a href="https://www.lemonade.com/car/explained/what-does-car-insurance-cover/" className="underline">Car Insurance Coverage</a></li>
            <li><a href="https://www.lemonade.com/car/explained/how-much-does-car-insurance-cost/" className="underline">Car Insurance Cost</a></li>
            <li><a href="https://www.lemonade.com/car/explained/comprehensive-coverage/" className="underline">Comprehensive Coverage</a></li>
            <li><a href="https://www.lemonade.com/car/vehicles/" className="underline">Car Insurance by Vehicle</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm">Resources & Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><a href="https://www.lemonade.com/blog/" className="underline">Blog</a></li>
            <li><a href="https://www.lemonade.com/faq" className="underline">FAQ</a></li>
            <li><a href="https://www.lemonade.com/lemonade-goes-global" className="underline">Where We're Live</a></li>
            <li><a href="https://www.lemonade.com/insuropedia/" className="underline">Insurance Dictionary</a></li>
            <li><a href="https://www.lemonade.com/sitemap" className="underline">Sitemap</a></li>
            <li><a href="https://makers.lemonade.com/" className="underline">Join the Team</a></li>
            <li><a href="https://www.lemonade.com/partners-program" className="underline">Partners Program</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 border-t border-surface-line/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-sage">
        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/lemonade/" aria-label="facebook">
            <img src="https://s3.amazonaws.com/edge-assets.lmndstaging.com/facebook-0ef4315d24cb5fda4c744e8e33ad179e.svg" alt="facebook" className="h-5" />
          </a>
          <a href="https://x.com/lemonade_inc" aria-label="x">
            <img src="https://s3.amazonaws.com/edge-assets.lmndstaging.com/x-ea627cf93a86e17b3672a26cd4e3757e.svg" alt="x" className="h-5" />
          </a>
          <a href="https://instagram.com/lemonade_inc/" aria-label="instagram">
            <img src="https://s3.amazonaws.com/edge-assets.lmndstaging.com/instagram-9f32af78f7c0d9c0fa415fa485349653.svg" alt="instagram" className="h-5" />
          </a>
          <a href="https://www.linkedin.com/company/lemonade-inc-" aria-label="linkedin">
            <img src="https://s3.amazonaws.com/edge-assets.lmndstaging.com/linkedin-342f8fb08d085d6a5e9c2a59bbc55f88.svg" alt="linkedin" className="h-5" />
          </a>
        </div>

        <div className="text-sm text-ink-soft text-center sm:text-right">
          <div>1-844-733-8666 • <a href="mailto:help@lemonade.com" className="underline">help@lemonade.com</a></div>
          <div className="mt-2">Lemonade Insurance, 5 Crosby St. 3rd floor, New York, NY 10013</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 text-[11px] text-ink-soft leading-relaxed">
        <p>
          Property and casualty insurance is provided by Lemonade Insurance Company (LIC) and Metromile Insurance Company (MIC), 5 Crosby St., 3rd floor, New York, NY 10013. Home insurance policies in certain states are underwritten by member companies of Homesite Group, Inc. Coverage is subject to policy terms and may not be available in all states.
        </p>
        <p className="mt-2">
          Lemonade Insurance Agency, LLC (LIA) and Metromile Insurance Services LLC (MIS) are licensed insurance agents and appointed by LIC and MIC and both LIA and MIS receive compensation based on the premiums for the insurance policies each sells. Further information is available upon request.
        </p>
      </div>
    </footer>
  );
}
