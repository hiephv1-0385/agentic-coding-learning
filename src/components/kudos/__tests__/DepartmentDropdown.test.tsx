import { screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import DepartmentDropdown from "@/components/kudos/DepartmentDropdown";
import { renderWithProviders as render } from "@/__tests__/test-utils";

const mockDepartments = [
  { id: "1", name: "BDV" },
  { id: "2", name: "CEVC1" },
  { id: "3", name: "CEVC2" },
  { id: "4", name: "STVC - R&D - SDX" },
];

function renderDropdown(overrides: Partial<Parameters<typeof DepartmentDropdown>[0]> = {}) {
  const defaultProps = {
    departments: mockDepartments,
    activeDepartment: "",
    onSelect: vi.fn(),
    ...overrides,
  };
  const result = render(<DepartmentDropdown {...defaultProps} />);
  return { ...result, onSelect: defaultProps.onSelect };
}

describe("DepartmentDropdown", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders trigger with 'Phòng ban' when no active department", () => {
    renderDropdown();
    const trigger = screen.getByRole("button", { name: "Phòng ban" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Phòng ban");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("opens dropdown and shows 'Xóa bộ lọc' + all departments", () => {
    renderDropdown();
    fireEvent.click(screen.getByRole("button", { name: "Phòng ban" }));

    const trigger = screen.getByRole("button", { name: "Phòng ban" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(5); // "Xóa bộ lọc" + 4 departments
    expect(options[0]).toHaveTextContent("Xóa bộ lọc");
    expect(options[1]).toHaveTextContent("BDV");
    expect(options[2]).toHaveTextContent("CEVC1");
    expect(options[3]).toHaveTextContent("CEVC2");
    expect(options[4]).toHaveTextContent("STVC - R&D - SDX");
  });

  it("selects department and calls onSelect", () => {
    const { onSelect } = renderDropdown();
    fireEvent.click(screen.getByRole("button", { name: "Phòng ban" }));
    fireEvent.click(screen.getByRole("option", { name: "CEVC2" }));

    expect(onSelect).toHaveBeenCalledWith("CEVC2");
    expect(screen.getByRole("button", { name: "Phòng ban" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("selects 'Xóa bộ lọc' and calls onSelect with empty string", () => {
    const { onSelect } = renderDropdown({ activeDepartment: "CEVC1" });
    fireEvent.click(screen.getByRole("button", { name: "Phòng ban" }));
    fireEvent.click(screen.getByRole("option", { name: "Xóa bộ lọc" }));

    expect(onSelect).toHaveBeenCalledWith("");
  });

  it("highlights active department with aria-selected", () => {
    renderDropdown({ activeDepartment: "CEVC1" });
    fireEvent.click(screen.getByRole("button", { name: "Phòng ban" }));

    const cevc1Option = screen.getByRole("option", { name: "CEVC1" });
    expect(cevc1Option).toHaveAttribute("aria-selected", "true");

    // "Xóa bộ lọc" should not be selected
    const clearOption = screen.getByRole("option", { name: "Xóa bộ lọc" });
    expect(clearOption).toHaveAttribute("aria-selected", "false");
  });

  it("shows active department in trigger with active styling", () => {
    renderDropdown({ activeDepartment: "CEVC2" });
    const trigger = screen.getByRole("button", { name: "Phòng ban" });
    expect(trigger).toHaveTextContent("CEVC2");
    expect(trigger.className).toContain("border-gold-primary");
    expect(trigger.className).toContain("bg-gold-40");
  });

  it("closes dropdown on outside click", () => {
    renderDropdown();
    fireEvent.click(screen.getByRole("button", { name: "Phòng ban" }));
    expect(screen.getAllByRole("option")).toHaveLength(5);

    fireEvent.mouseDown(document.body);
    expect(screen.getByRole("button", { name: "Phòng ban" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("supports keyboard navigation with Arrow keys and Escape", () => {
    const { onSelect } = renderDropdown();
    const trigger = screen.getByRole("button", { name: "Phòng ban" });

    fireEvent.click(trigger);
    const options = screen.getAllByRole("option");

    // Focus on first option ("Xóa bộ lọc") and press ArrowDown
    options[0].focus();
    fireEvent.keyDown(options[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(options[1]);

    // Press ArrowUp to go back
    fireEvent.keyDown(options[1], { key: "ArrowUp" });
    expect(document.activeElement).toBe(options[0]);

    // ArrowDown to BDV, then click to select
    fireEvent.keyDown(options[0], { key: "ArrowDown" });
    fireEvent.click(options[1]);
    expect(onSelect).toHaveBeenCalledWith("BDV");

    // Re-open and test Escape
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("shows skeleton and is disabled when loading", () => {
    renderDropdown({ isLoading: true, departments: [] });
    const trigger = screen.getByRole("button", { name: "Phòng ban" });
    expect(trigger).toBeDisabled();

    const skeleton = trigger.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("shows '—' and is disabled when departments are empty", () => {
    renderDropdown({ isLoading: false, departments: [] });
    const trigger = screen.getByRole("button", { name: "Phòng ban" });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveTextContent("—");
  });

  it("calls onSelect('') when active department is not in the list", async () => {
    const onSelect = vi.fn();
    render(
      <DepartmentDropdown
        departments={mockDepartments}
        activeDepartment="REMOVED_DEPT"
        onSelect={onSelect}
      />
    );

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith("");
    });
  });
});
