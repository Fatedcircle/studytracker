import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router";
import MainPage from "./MainPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

vi.mock("../CourseList.jsx", () => ({
    default: ({ courses, title }) => (
        <div>
            <h2>{title}</h2>
            <ul>
                {courses.map((c) => (
                    <li
                        key={c.id}
                        data-testid={`course-${c.id}`}
                        onClick={() => mockNavigate(`/course/${c.id}`)}
                    >
                        {c.title}
                    </li>
                ))}
            </ul>
        </div>
    ),
}));

global.fetch = vi.fn();

const mockSuccessFetches = () => {
    fetch.mockImplementation((url) => {
        if (url.includes("providers")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, name: "Provider A" },
                    { id: 2, name: "Provider B" },
                ]),
            });
        }
        if (url.includes("courses")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 10, title: "Course A", provider_id: 1 },
                    { id: 20, title: "Course B", provider_id: 2 },
                ]),
            });
        }
        if (url.includes("users")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 1, name: "John Doe" }),
            });
        }
    });
};

describe("MainPage with delayed times", () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        fetch.mockClear();
        mockSuccessFetches();
        mockNavigate.mockClear();
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.restoreAllMocks()
    })

    it("renders loading screen first", async () => {
        render(<MainPage />);
        expect(await screen.findByText(/loading content/i)).toBeInTheDocument();
    });

    it("renders providers and courses after 2s delay", async () => {
        render(<MainPage />, { wrapper: MemoryRouter });

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        await waitFor(() => {
            expect(
                screen.getByRole("heading", { name: /all courses/i })
            ).toBeInTheDocument();
        });

        expect(screen.getByText("Provider A")).toBeInTheDocument();
        expect(screen.getByText("Provider B")).toBeInTheDocument();

        expect(screen.getByText("Course A")).toBeInTheDocument();
        expect(screen.getByText("Course B")).toBeInTheDocument();
    });

    it("filters courses when clicking provider", async () => {
        render(<MainPage />, { wrapper: MemoryRouter });

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        fireEvent.click(await screen.findByText("Provider A"));

        await waitFor(() => {
            expect(screen.getByText("Course A")).toBeInTheDocument();
            expect(screen.queryByText("Course B")).not.toBeInTheDocument();
        });
    });

    it("navigates to the detail page when clicking a course", async () => {
        render(<MainPage />, { wrapper: MemoryRouter });

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        fireEvent.click(await screen.findByText("Course A"));

        expect(mockNavigate).toHaveBeenCalledWith("/course/10");
    });

    it("shows error screen if fetch fails", async () => {
        fetch.mockRejectedValueOnce(new Error("API down"));

        render(<MainPage />, { wrapper: MemoryRouter });

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
    });

    it("shows error screen when fetch fails", async () => {
        fetch.mockRejectedValueOnce(new Error("API down"));

        render(<MainPage />);
        await act(() => {
            vi.advanceTimersByTime(2000);
        })

        expect(await screen.findByText(/failed to load data/i)).toBeInTheDocument();
    });

})