import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import Navbar from "./Navbar";
import '@testing-library/jest-dom';

let mockUser = null;
let mockLogout = vi.fn();

vi.mock("../../context/UserContext", () => {
    return {
        useUser: () => ({
            user: mockUser,
            logout: mockLogout,
        }),
    };
});

describe("Navbar", () => {
    beforeEach(() => {
        mockUser = null;
        mockLogout = vi.fn();
    });

    const renderNavbar = () => {
        return render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
    };

    it("shows the title Study Tracker", () => {
        renderNavbar();
        expect(screen.getByText("📚 Study tracker")).toBeInTheDocument();
    });

    it("shows login and register links if there is no user logged in", () => {
        mockUser = null;
        renderNavbar();

        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Register")).toBeInTheDocument();
    });

    it("shows user information if there is a user logged in", () => {
        mockUser = { name: "Jan", email: "jan@example.com" };
        renderNavbar();

        expect(screen.getByText("Logged in as:")).toBeInTheDocument();
        expect(screen.getByText("Jan")).toBeInTheDocument();
    });

    it("calls logout when clicking on 'Log out", () => {
        mockUser = { name: "Piet" };
        renderNavbar();

        fireEvent.click(screen.getByText("Log out"));
        expect(mockLogout).toHaveBeenCalledOnce();
    });

    it("has router-links with correct href attributes", () => {
        const { container } = renderNavbar();

        const homeLink = container.querySelector('[data-testid="nav-home"]');
        expect(homeLink).toHaveAttribute("href", "/");

        const newCourseLink = container.querySelector('[data-testid="nav-new-course"]');
        expect(newCourseLink).toHaveAttribute("href", "/new-course");

        const newProviderLink = container.querySelector('[data-testid="nav-new-provider"]');
        expect(newProviderLink).toHaveAttribute("href", "/new-provider");
    });


});
