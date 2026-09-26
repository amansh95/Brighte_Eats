import { useSyncExternalStore } from "react";

const KEY = "brighte-eats:services";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot() {
  return localStorage.getItem(KEY) ?? "[]";
}

export function saveSelectedServices(codes: string[]) {
  localStorage.setItem(KEY, JSON.stringify(codes));
  listeners.forEach((listener) => listener());
}

export function useSelectedServices(): string[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  return JSON.parse(raw);
}
