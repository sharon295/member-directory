import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { STATUS } from "./constants";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "members.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ members: [] }, null, 2));
  }
}

function readAll() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.members) ? parsed.members : [];
  } catch {
    return [];
  }
}

function writeAll(members) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ members }, null, 2));
}

export function getAllMembers() {
  return readAll();
}

export function getApprovedMembers() {
  return readAll().filter((m) => m.status === STATUS.APPROVED);
}

export function getPendingMembers() {
  return readAll().filter((m) => m.status === STATUS.PENDING);
}

export function getMemberById(id) {
  return readAll().find((m) => m.id === id) || null;
}

export function getMemberByEditToken(token) {
  return readAll().find((m) => m.editToken === token) || null;
}

export function createMember(data) {
  const members = readAll();
  const now = new Date().toISOString();
  const member = {
    id: randomUUID(),
    status: STATUS.PENDING,
    editToken: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  members.push(member);
  writeAll(members);
  return member;
}

export function updateMember(id, patch) {
  const members = readAll();
  const idx = members.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  members[idx] = {
    ...members[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeAll(members);
  return members[idx];
}

export function approveMember(id) {
  const member = getMemberById(id);
  if (!member) return null;
  const editToken = member.editToken || randomUUID();
  return updateMember(id, { status: STATUS.APPROVED, editToken });
}

export function rejectMember(id) {
  return updateMember(id, { status: STATUS.REJECTED });
}

export function deleteMember(id) {
  const members = readAll();
  const next = members.filter((m) => m.id !== id);
  writeAll(next);
  return next.length !== members.length;
}
