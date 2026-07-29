"use client";

import { useMemo, useState } from "react";
import { INDUSTRIES } from "@/lib/constants";
import { sortMembers, groupByLetter, ALPHABET } from "@/lib/sort";
import MemberCard from "./MemberCard";

export default function DirectoryClient({ members }) {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [cityState, setCityState] = useState("");

  const cityStateOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.cityState).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [members]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (industry && m.industry !== industry) return false;
      if (cityState && m.cityState !== cityState) return false;
      if (!q) return true;
      const haystack = [m.firstName, m.lastName, m.companyName, m.bio]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [members, search, industry, cityState]);

  const sorted = useMemo(() => sortMembers(filtered), [filtered]);
  const groups = useMemo(() => groupByLetter(sorted), [sorted]);
  const availableLetters = useMemo(() => new Set(groups.keys()), [groups]);

  const scrollToLetter = (letter) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, or bio..."
          className="flex-1 rounded-md border border-mauve/40 bg-white px-4 py-2.5 text-plum-deep placeholder:text-mauve focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="rounded-md border border-mauve/40 bg-white px-4 py-2.5 text-plum-deep focus:outline-none focus:ring-2 focus:ring-gold md:w-56"
        >
          <option value="">All Industries</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <select
          value={cityState}
          onChange={(e) => setCityState(e.target.value)}
          className="rounded-md border border-mauve/40 bg-white px-4 py-2.5 text-plum-deep focus:outline-none focus:ring-2 focus:ring-gold md:w-56"
        >
          <option value="">All Cities/States</option>
          {cityStateOptions.map((cs) => (
            <option key={cs} value={cs}>
              {cs}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">
          {sorted.length} {sorted.length === 1 ? "member" : "members"}
          {sorted.length !== members.length ? ` (of ${members.length} total)` : ""}
        </p>
      </div>

      {/* A-Z nav */}
      <div className="flex flex-wrap gap-1 mb-8 sticky top-0 bg-blush/95 backdrop-blur py-3 z-10 border-b border-mauve/20">
        {ALPHABET.map((letter) => {
          const active = availableLetters.has(letter);
          return (
            <button
              key={letter}
              disabled={!active}
              onClick={() => scrollToLetter(letter)}
              className={`w-7 h-7 text-xs rounded-full flex items-center justify-center transition-colors ${
                active
                  ? "text-plum-deep hover:bg-gold hover:text-plum-deep font-medium cursor-pointer"
                  : "text-mauve/40 cursor-default"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {sorted.length === 0 ? (
        <p className="text-center text-muted py-16">
          No members match your search. Try adjusting your filters.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {ALPHABET.filter((l) => groups.has(l)).map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-20">
              <h2 className="font-heading text-3xl text-gold mb-4 border-b border-gold/30 pb-1">
                {letter}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groups.get(letter).map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
