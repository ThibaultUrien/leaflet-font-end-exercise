import { Formats, Point } from "../..";
import { s } from "./common/s-interporlator";

describe("Entity operations", () => {
  const testCases: [Point, string][] = [
    [{ lat: 55, lng: 12 }, "55E 12N"],
    [{ lat: -0.5, lng: -30 }, "0.5W 30S"],
    [{ lat: 55, lng: 12, alt: 500 }, "55E 12N Altitude: 500m"],
  ];

  for (const [point, expectedString] of testCases)
    it(s`should produce the expected strings ${[point, expectedString]}`,
      () => {
        expect(Formats.formatPoint(point)).toEqual(expectedString);
      }
    );
});
