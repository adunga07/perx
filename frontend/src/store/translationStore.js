import { create } from "zustand";
import { persist } from "zustand/middleware";

const SQ = {
  // Sidebar nav
  "Dashboard": "Paneli",
  "Marketplace": "Tregu",
  "Benefits": "Përfitimet",
  "Profile": "Profili",
  "Approvals": "Miratimet",
  "Budget": "Buxheti",
  "Employees": "Punonjësit",
  "Insights": "Analiza",
  "Offers": "Ofertat",
  "Add perk": "Shto përfitim",
  "Sign out": "Dilni",
  // Topbar
  "Workspace": "Hapësira",
  "employee portal": "portali i punonjësit",
  "employer portal": "portali i punëdhënësit",
  "provider portal": "portali i ofruesit",
  // Employee Dashboard
  "Employee dashboard": "Paneli i punonjësit",
  "Your benefits at a glance": "Përfitimet tuaja me një shikim",
  "Browse marketplace": "Shfleto tregun",
  "My benefits": "Përfitimet e mia",
  "Available perks": "Përfitime të disponueshme",
  "Pending requests": "Kërkesa në pritje",
  "Total savings": "Kursimet totale",
  "Featured perks": "Përfitime të veçuara",
  "Highlights worth opening": "Theksime që vlen të hapen",
  "View all": "Shiko të gjitha",
  "Open details": "Hap detajet",
  // Employer Dashboard
  "Company dashboard": "Paneli i kompanisë",
  "Review approvals": "Rishiko miratimet",
  "Manage employees": "Menaxho punonjësit",
  "Pending approvals": "Miratim në pritje",
  "Budget used": "Buxheti i përdorur",
  "Team budget overview": "Pasqyra e buxhetit të ekipit",
  "Approve": "Miratat",
  "Decline": "Refuzo",
  // Marketplace
  "Perk marketplace": "Tregu i përfitimeve",
  "Browse all perks": "Shfleto të gjitha përfitimet",
  "Filters": "Filtrat",
  "Add to cart": "Shto në shportë",
  "View details": "Shiko detajet",
  "% off": "% zbritje",
  // My Benefits
  "Your redeemed perks": "Përfitimet tuaja të shlyera",
  "Total records": "Rekordet totale",
  "Redeemed": "Shlyera",
  "Spent": "Shpenzuar",
  "Saved": "Kursyer",
  // Profile
  "Employee profile": "Profili i punonjësit",
  "Cover style": "Stili i kopertinës",
  "Appearance": "Pamja",
  "Change password": "Ndrysho fjalëkalimin",
  "Security": "Siguria",
  "Current password": "Fjalëkalimi aktual",
  "New password": "Fjalëkalimi i ri",
  "Confirm new password": "Konfirmo fjalëkalimin e ri",
  "Save password": "Ruaj fjalëkalimin",
  "Change photo": "Ndrysho foton",
  "Change cover": "Ndrysho kopertinën",
  // Employer pages
  "Team management": "Menaxhimi i ekipit",
  "Approval queue": "Radha e miratimit",
  "Budget settings": "Cilësimet e buxhetit",
  "Create employee account": "Krijo llogari punonjësi",
  "Add employee": "Shto punonjës",
  "Adjust": "Rregullozo",
  "Save": "Ruaj",
  "Monthly budget": "Buxheti mujor",
  "Budget allocated": "Buxheti i ndarë",
  // Common UI
  "Cancel": "Anulo",
  "Close": "Mbyll",
  "Search": "Kërko",
  "Active": "Aktiv",
  "Pending": "Në pritje",
  "Approved": "Miratuar",
  "Rejected": "Refuzuar",
  "Full name": "Emri i plotë",
  "Email address": "Adresa e emailit",
  "Department": "Departamenti",
  "Password": "Fjalëkalimi",
  "per month": "në muaj",
  "Total": "Totali",
  "Used": "Përdorur",
};

const DICTS = { en: null, sq: SQ };

export const LANGUAGES = [
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "sq", label: "Shqip",    flag: "🇦🇱" },
];

export const useTranslationStore = create(
  persist(
    (set) => ({
      lang: "en",

      setLang(code) {
        if (DICTS[code] !== undefined) set({ lang: code });
      },
    }),
    {
      name: "perx-translations-v4",
      partialize: (s) => ({ lang: s.lang }),
    }
  )
);

export function getLangDict(lang) {
  return DICTS[lang] ?? null;
}
