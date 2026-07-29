import { TIER_SORT_ORDER } from "./constants";

function lastNameKey(member) {
  return (member.lastName || "").trim().toUpperCase();
}

export function sortMembers(members) {
  return [...members].sort((a, b) => {
    const letterA = lastNameKey(a)[0] || "#";
    const letterB = lastNameKey(b)[0] || "#";
    if (letterA !== letterB) return letterA.localeCompare(letterB);

    const tierDiff = (TIER_SORT_ORDER[a.tier] ?? 99) - (TIER_SORT_ORDER[b.tier] ?? 99);
    if (tierDiff !== 0) return tierDiff;

    return lastNameKey(a).localeCompare(lastNameKey(b));
  });
}

export function groupByLetter(sortedMembers) {
  const groups = new Map();
  for (const member of sortedMembers) {
    const letter = lastNameKey(member)[0] || "#";
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(member);
  }
  return groups;
}

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
