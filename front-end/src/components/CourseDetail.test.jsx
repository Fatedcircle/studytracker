import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import CourseDetail from "./CourseDetail";

global.fetch = vi.fn();

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useParams: () => ({ id: "10" }),
        useNavigate: () => mockNavigate,
    };
});

const mockCourse = {
    id: 10,
    title: "React Course",
    description: "Learn React step by step",
    image_url: "react.jpg",
    provider_id: 1
};

const mockSuccessFetch = () => {
    fetch
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: 10,
                title: "React Course",
                description: "Learn React step by step",
                image_url: "react.jpg",
            })
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 101, title: "Intro" },
                { id: 102, title: "Advanced" }
            ]
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, title: "Lesson A" },
                { id: 2, title: "Lesson B" }
            ]
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 3, title: "Lesson C" }
            ]
        });
};

describe("CourseDetail", () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        fetch.mockClear();
        mockNavigate.mockReset();
        mockSuccessFetch();
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.restoreAllMocks()
    })

    it("shows loading first", async () => {
        render(
            <MemoryRouter>
                <CourseDetail />
            </MemoryRouter>
        );

        expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    });

    it("renders course details after fetch", async () => {
        render(
            <MemoryRouter>
                <CourseDetail />
            </MemoryRouter>
        );

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        await waitFor(() => {
            expect(screen.getByText(/react course/i)).toBeInTheDocument();
            expect(screen.getByText(/learn react/i)).toBeInTheDocument();
        });
    });

    it("navigates back when clicking Back button", async () => {
        render(
            <MemoryRouter>
                <CourseDetail />
            </MemoryRouter>
        );

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        await screen.findByText(/react course/i);

        fireEvent.click(screen.getByText(/back to the overview/i));

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
