"use client";

import { ShieldCheck } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="px-6 py-12 border-t border-surface-line bg-paper text-ink">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3 sm:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pine flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-base text-ink">BestPolicy</span>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            AI-powered insurance comparison for Health, Motor &amp; Life plans. Find the right coverage in minutes, not hours.
          </p>
          <p className="text-xs text-sage mt-2">IRDAI Registered Broker · Reg. No. 123</p>
        </div>

        {/* Health */}
        <div>
          <h4 className="font-display font-semibold text-sm text-ink">Health Insurance</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><a href="/protection/health" className="hover:text-pine transition-colors">Individual Health Plans</a></li>
            <li><a href="/protection/health" className="hover:text-pine transition-colors">Family Floater Plans</a></li>
            <li><a href="/protection/health" className="hover:text-pine transition-colors">Senior Citizen Plans</a></li>
            <li><a href="/protection/health" className="hover:text-pine transition-colors">Critical Illness Cover</a></li>
          </ul>
        </div>

        {/* Motor */}
        <div>
          <h4 className="font-display font-semibold text-sm text-ink">Motor Insurance</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><a href="/protection/vehicle" className="hover:text-pine transition-colors">Car Insurance</a></li>
            <li><a href="/protection/vehicle" className="hover:text-pine transition-colors">Two-Wheeler Insurance</a></li>
            <li><a href="/protection/vehicle" className="hover:text-pine transition-colors">Commercial Vehicle</a></li>
            <li><a href="/protection/vehicle" className="hover:text-pine transition-colors">Third-Party Cover</a></li>
          </ul>
        </div>

        {/* Life */}
        <div>
          <h4 className="font-display font-semibold text-sm text-ink">Life Insurance</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><a href="/protection/life" className="hover:text-pine transition-colors">Term Life Insurance</a></li>
            <li><a href="/protection/life" className="hover:text-pine transition-colors">Whole Life Plans</a></li>
            <li><a href="/protection/life" className="hover:text-pine transition-colors">ULIP Plans</a></li>
            <li><a href="/protection/life" className="hover:text-pine transition-colors">Endowment Plans</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 border-t border-surface-line/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-sage">
        <p className="text-xs">© {new Date().getFullYear()} BestPolicy Insurance Brokers Pvt. Ltd. All rights reserved.</p>
        <div className="text-xs text-ink-soft text-center sm:text-right">
          <div>1-800-BESTPOL · <a href="mailto:help@bestpolicy.in" className="hover:text-pine transition-colors">help@bestpolicy.in</a></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-4 text-[11px] text-sage leading-relaxed">
        <p>
          Insurance is the subject matter of solicitation. BestPolicy Insurance Brokers Pvt. Ltd. is registered with IRDAI as a Direct Broker. 
          Please read the policy terms and conditions carefully before purchasing. Premiums may vary. Tax benefits subject to applicable income tax laws.
        </p>
      </div>
    </footer>
  );
}
