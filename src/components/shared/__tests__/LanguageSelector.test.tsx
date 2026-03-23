import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import LanguageSelector from "@/components/shared/LanguageSelector";
import { renderWithProviders as render } from "@/__tests__/test-utils";

describe("LanguageSelector", () => {
  beforeEach(() => {
    // Clear locale cookie
    document.cookie = "locale=;path=/;max-age=0";
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the trigger button with default VN language", () => {
    render(<LanguageSelector />);
    const trigger = screen.getByRole("button", { name: "Chọn ngôn ngữ" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("VN");
  });

  it("opens dropdown when trigger is clicked", () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "VN" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "EN" })).toBeInTheDocument();
  });

  it("closes dropdown and switches language when option is selected", () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));
    fireEvent.click(screen.getByRole("option", { name: "EN" }));

    // Dropdown should close
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    // Trigger should now show EN (aria-label changes to English)
    expect(screen.getByRole("button", { name: "Select language" })).toHaveTextContent("EN");
  });

  it("persists language preference in cookie", () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));
    fireEvent.click(screen.getByRole("option", { name: "EN" }));

    expect(document.cookie).toContain("locale=en");
  });

  it("closes dropdown on Escape key", () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown on outside click", () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("highlights current selection in dropdown", () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));

    const vnOption = screen.getByRole("option", { name: "VN" });
    expect(vnOption).toHaveAttribute("aria-selected", "true");
  });

  it("has correct ARIA attributes on trigger", () => {
    render(<LanguageSelector />);
    const trigger = screen.getByRole("button", { name: "Chọn ngôn ngữ" });

    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("supports keyboard navigation with Arrow keys", () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));

    const enOption = screen.getByRole("option", { name: "EN" });
    // Focus EN option and press Enter to select
    enOption.focus();
    fireEvent.keyDown(enOption, { key: "ArrowUp" });

    // After ArrowUp from index 1, should focus index 0 (VN)
    const vnOption = screen.getByRole("option", { name: "VN" });
    expect(document.activeElement).toBe(vnOption);
  });

  it("reads initial locale from provider", () => {
    render(<LanguageSelector />, { locale: "en" });

    // When locale is EN, aria-label is in English
    const trigger = screen.getByRole("button", { name: "Select language" });
    expect(trigger).toHaveTextContent("EN");
  });

  it("selected item has highlight background class", () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));

    const vnOption = screen.getByRole("option", { name: "VN" });
    expect(vnOption).toHaveAttribute("aria-selected", "true");
    expect(vnOption.className).toContain("bg-gold-20");
  });

  it("re-clicking selected language closes dropdown without change", () => {
    render(<LanguageSelector />);
    const trigger = screen.getByRole("button", { name: "Chọn ngôn ngữ" });

    // Open and click already-selected VN
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("option", { name: "VN" }));

    // Dropdown closes, trigger still shows VN
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent("VN");
  });

  it("document.documentElement.lang updates on language switch", () => {
    render(<LanguageSelector />);

    // Switch to EN
    fireEvent.click(screen.getByRole("button", { name: "Chọn ngôn ngữ" }));
    fireEvent.click(screen.getByRole("option", { name: "EN" }));
    expect(document.documentElement.lang).toBe("en");

    // Switch back to VN (aria-label is now in English)
    fireEvent.click(screen.getByRole("button", { name: "Select language" }));
    fireEvent.click(screen.getByRole("option", { name: "VN" }));
    expect(document.documentElement.lang).toBe("vi");
  });

  it("hidden options are not Tab-focusable when closed", () => {
    render(<LanguageSelector />);

    // Dropdown is closed — options should have tabIndex -1
    const options = screen.getAllByRole("option", { hidden: true });
    options.forEach((option) => {
      expect(option).toHaveAttribute("tabindex", "-1");
    });
  });
});
