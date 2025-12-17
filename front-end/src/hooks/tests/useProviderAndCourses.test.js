import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { useProvidersAndCourses } from "../useProvidersAndCourses";

global.fetch = vi.fn();

describe("useProvidersAndCourses", () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        fetch.mockReset();
        vi.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
        cleanup();
    })
    function mockSuccess() {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    { id: 1, name: "Provider A" },
                    { id: 2, name: "Provider B" },
                ],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    { id: 10, title: "Course A" },
                    { id: 20, title: "Course B" },
                ],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 999, name: "Test User" }),
            });
    }

    it("starts in loading state", async () => {
        mockSuccess();

        let hook;
        await act(() => {
            hook = renderHook(() => useProvidersAndCourses());
        });

        expect(hook.result.current.loading).toBe(true);
        expect(hook.result.current.error).toBe(null);
    });


    it("loads providers, courses, and user after the minimum delay", async () => {
        mockSuccess();

        const { result } = renderHook(() => useProvidersAndCourses());

        await act(async () => {
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
        });

        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);

        expect(result.current.providers.length).toBe(2);
        expect(result.current.courses.length).toBe(2);
        expect(result.current.activeUser.id).toBe(999);
    });

    it("sets error when fetch fails", async () => {
        fetch.mockRejectedValueOnce(new Error("API DOWN"));

        const { result } = renderHook(() => useProvidersAndCourses());

        await act(async () => {
            await Promise.resolve();
        });

        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        expect(result.current.error).toBe("Failed to load data");
        expect(result.current.loading).toBe(false);
    });
});
