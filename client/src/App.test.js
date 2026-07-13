import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, vi } from "vitest";
import App from "./App";

afterEach(() => {
  vi.restoreAllMocks();
});

test("renders app shell", () => {
  vi.spyOn(global, "fetch").mockResolvedValue({
    json: async () => ({ message: "ok" }),
  });

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
