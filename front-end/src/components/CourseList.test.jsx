import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { MemoryRouter } from "react-router";
import CourseList from "./CourseList";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe("CourseList", () => {
    const mockCourses = [
        {
            id: 1,
            title: "React Basics",
            description: "Learn React...",
            image_url: "image.jpg",
        },
        {
            id: 2,
            title: "Node.js Intro",
            description: "Learn Node...",
            image_url: null,
        },
    ];

    it("shows loading state", () => {
        render(
            <MemoryRouter>
                <CourseList loading={true} courses={[]} />
            </MemoryRouter>
        );

        expect(screen.getByText(/laden/i)).toBeInTheDocument();
    });

    it("shows an error message", () => {
        render(
            <MemoryRouter>
                <CourseList error="Something went wrong" courses={[]} />
            </MemoryRouter>
        );

        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it("renders a list of courses", () => {
        render(
            <MemoryRouter>
                <CourseList
                    courses={mockCourses}
                    loading={false}
                    error={null}
                    title="All Courses"
                />
            </MemoryRouter>
        );

        expect(screen.getByText("React Basics")).toBeInTheDocument();
        expect(screen.getByText("Node.js Intro")).toBeInTheDocument();
    });

    it("navigates to the correct course detail page when clicked", () => {
        render(
            <MemoryRouter>
                <CourseList
                    courses={mockCourses}
                    loading={false}
                    error={null}
                    title="All Courses"
                />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("React Basics"));

        expect(mockNavigate).toHaveBeenCalledWith("/course/1");
    });
});
