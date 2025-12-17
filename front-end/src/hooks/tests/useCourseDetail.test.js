import { renderHook, act, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useCourseDetail } from "../useCourseDetail";

global.fetch = vi.fn();

const mockSuccess = () => {
    fetch
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: 10,
                title: "React Course",
                description: "Learn React step by step",
                image_url: "react.jpg",
            }),
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 101, title: "Intro" },
                { id: 102, title: "Advanced" },
            ],
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, title: "Lesson A" },
                { id: 2, title: "Lesson B" },
            ],
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: 3, title: "Lesson C" }],
        });
};

const flushMicrotasks = () => Promise.resolve().then(() => { });

describe("useCourseDetail", () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        fetch.mockReset();
        mockSuccess();
        vi.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
        cleanup();
    })

    it("starts in loading state", async () => {
        let result;

        await act(async () => {
            result = renderHook(() => useCourseDetail(10)).result;
        });

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBe(null);
    });

    it("loads course details successfully", async () => {
        const { result } = renderHook(() => useCourseDetail(10));

        await act(async () => {
            await flushMicrotasks();
            await flushMicrotasks();
        });

        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);

        expect(result.current.course.title).toBe("React Course");
        expect(result.current.chapters.length).toBe(2);
        expect(result.current.lessons[101]).toHaveLength(2);
    });
});
