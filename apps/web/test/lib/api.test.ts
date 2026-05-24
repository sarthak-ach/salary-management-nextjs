import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, api } from "@/lib/api";

describe("api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("throws ApiError on failed responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ error: "Employee not found" }),
      }),
    );

    await expect(api.getEmployee("missing-id")).rejects.toMatchObject({
      status: 404,
      message: "Employee not found",
    });
  });

  it("parses successful JSON responses", async () => {
    const payload = { id: "1", fullName: "Jane Doe" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => payload,
      }),
    );

    const result = await api.getEmployee("1");
    expect(result).toEqual(payload);
  });

  it("ApiError exposes status and message", () => {
    const error = new ApiError(400, "Bad request");
    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(400);
    expect(error.message).toBe("Bad request");
  });
});
