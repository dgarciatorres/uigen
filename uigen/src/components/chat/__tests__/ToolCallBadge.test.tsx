import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { getToolLabel, ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// getToolLabel — str_replace_editor
test("getToolLabel: create command returns Creating <filename>", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/App.jsx" })).toBe("Creating App.jsx");
});

test("getToolLabel: str_replace command returns Editing <filename>", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "/src/Counter.tsx" })).toBe("Editing Counter.tsx");
});

test("getToolLabel: insert command returns Editing <filename>", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "/src/utils.ts" })).toBe("Editing utils.ts");
});

test("getToolLabel: view command returns Reading <filename>", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "/index.tsx" })).toBe("Reading index.tsx");
});

test("getToolLabel: unknown command returns Editing <filename>", () => {
  expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })).toBe("Editing App.jsx");
});

test("getToolLabel: missing path returns fallback", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace" })).toBe("Editing file");
});

// getToolLabel — file_manager
test("getToolLabel: rename command returns Renaming <filename>", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "/old.jsx" })).toBe("Renaming old.jsx");
});

test("getToolLabel: delete command returns Deleting <filename>", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "/src/unused.ts" })).toBe("Deleting unused.ts");
});

// getToolLabel — unknown tool
test("getToolLabel: unknown tool returns raw tool name", () => {
  expect(getToolLabel("some_other_tool", { command: "run" })).toBe("some_other_tool");
});

// ToolCallBadge rendering
test("ToolCallBadge shows label and green dot when state is result", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  // Spinner should not be present
  expect(screen.queryByRole("img", { hidden: true })).toBeNull();
});

test("ToolCallBadge shows label and spinner when state is call", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/Counter.tsx" }}
      state="call"
    />
  );

  expect(screen.getByText("Editing Counter.tsx")).toBeDefined();
  // Spinner svg should be present
  expect(container.querySelector("svg")).toBeDefined();
});

test("ToolCallBadge shows spinner when state is partial-call", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/Button.tsx" }}
      state="partial-call"
    />
  );

  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
  expect(container.querySelector("svg")).toBeDefined();
});

test("ToolCallBadge shows file_manager delete label", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/src/old.ts" }}
      state="result"
    />
  );

  expect(screen.getByText("Deleting old.ts")).toBeDefined();
});
