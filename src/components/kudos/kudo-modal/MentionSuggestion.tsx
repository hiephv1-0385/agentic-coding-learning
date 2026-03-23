"use client";

import type { ProfilePreview } from "@/types/kudos";

let debounceTimer: ReturnType<typeof setTimeout>;

export function createMentionSuggestion(noResultsText: string) {
  return {
    items: async ({ query }: { query: string }) => {
      if (query.length < 2) return [];

      return new Promise<ProfilePreview[]>((resolve) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          try {
            const res = await fetch(
              `/api/users/search?q=${encodeURIComponent(query)}`
            );
            if (res.ok) {
              const json = (await res.json()) as { data?: ProfilePreview[] };
              resolve(json.data ?? []);
            } else {
              resolve([]);
            }
          } catch {
            resolve([]);
          }
        }, 300);
      });
    },
    render: () => {
      let popup: HTMLDivElement | null = null;
      let selectedIndex = 0;
      let currentItems: ProfilePreview[] = [];
      let currentCommand: ((item: { id: string; label: string }) => void) | null = null;

      function renderList() {
        if (!popup) return;

        if (currentItems.length === 0) {
          popup.innerHTML = `<div style="padding: 12px 16px; font-size: 14px; color: #999;">${noResultsText}</div>`;
          return;
        }

        popup.innerHTML = currentItems
          .map((item, index) => {
            const bg = index === selectedIndex ? "rgba(255,234,158,0.2)" : "transparent";
            const initials = item.display_name.charAt(0).toUpperCase();
            const avatar = item.avatar_url
              ? `<img src="${item.avatar_url}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;" />`
              : `<div style="width:24px;height:24px;border-radius:50%;background:#998C5F;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;">${initials}</div>`;

            return `<button data-index="${index}" type="button" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 16px;text-align:left;background:${bg};border:none;cursor:pointer;font-family:inherit;">
              ${avatar}
              <div style="display:flex;flex-direction:column;">
                <span style="font-size:14px;font-weight:700;color:#00101A;">${item.display_name}</span>
                ${item.department ? `<span style="font-size:12px;color:#999;">${item.department}</span>` : ""}
              </div>
            </button>`;
          })
          .join("");

        // Attach click handlers
        popup.querySelectorAll("button[data-index]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-index") ?? "0", 10);
            const item = currentItems[idx];
            if (item && currentCommand) {
              currentCommand({ id: item.id, label: item.display_name });
            }
          });
        });
      }

      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onStart: (props: any) => {
          popup = document.createElement("div");
          popup.style.cssText = "position:fixed;z-index:100;max-height:240px;overflow-y:auto;border-radius:8px;border:1px solid #998C5F;background:white;box-shadow:0 4px 12px rgba(0,0,0,0.15);min-width:200px;";
          document.body.appendChild(popup);

          currentItems = props.items;
          currentCommand = props.command;
          selectedIndex = 0;

          const rect = props.clientRect?.();
          if (rect && popup) {
            popup.style.left = `${rect.left}px`;
            popup.style.top = `${rect.bottom + 4}px`;
          }

          renderList();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUpdate: (props: any) => {
          currentItems = props.items;
          currentCommand = props.command;
          selectedIndex = 0;

          const rect = props.clientRect?.();
          if (rect && popup) {
            popup.style.left = `${rect.left}px`;
            popup.style.top = `${rect.bottom + 4}px`;
          }

          renderList();
        },
        onKeyDown: (props: { event: KeyboardEvent }): boolean => {
          if (props.event.key === "Escape") {
            if (popup) {
              popup.remove();
              popup = null;
            }
            return true;
          }
          if (props.event.key === "ArrowUp") {
            selectedIndex = (selectedIndex + currentItems.length - 1) % currentItems.length;
            renderList();
            return true;
          }
          if (props.event.key === "ArrowDown") {
            selectedIndex = (selectedIndex + 1) % currentItems.length;
            renderList();
            return true;
          }
          if (props.event.key === "Enter") {
            const item = currentItems[selectedIndex];
            if (item && currentCommand) {
              currentCommand({ id: item.id, label: item.display_name });
            }
            return true;
          }
          return false;
        },
        onExit: () => {
          if (popup) {
            popup.remove();
            popup = null;
          }
        },
      };
    },
  };
}
