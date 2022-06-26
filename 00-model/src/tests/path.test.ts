import { Paths, PoIs, PoI, Point } from "../..";
import { s } from "./common/s-interporlator";

describe("Path operations", () => {
  describe("Paths.create", () => {
    it("should create paths", () => {
      const newPath = Paths.create();
      expect(newPath.points).toEqual([]);
      expect(typeof newPath.uuid).toBe("string");
    });
  });

  describe("Paths.addPoint", () => {
    const testCases: PoI[][] = [
      [],
      [PoIs.create(1, 1)],
      [PoIs.create(1, 1), PoIs.create(2, 2)],
    ];

    for (const existingPoints of testCases)
      it(s`should add points ${existingPoints}`, () => {
        const addedPoint: Point = { lat: 0, lng: 0 };
        const path = Paths.create();
        path.points = existingPoints;
        const updatedPath = Paths.addPoint(path, addedPoint);

        const [lastPoint, ...olderPoints] = updatedPath.points;

        expect(olderPoints).toEqual(existingPoints);
        expect(lastPoint.lat).toBe(addedPoint.lat);
        expect(lastPoint.lng).toBe(addedPoint.lng);
      });
  });

  describe("Paths.remove", () => {
    const testCases: [PoI[], PoI | string][] = [
      [[], "point-removed"], // Remove on empty path
      [[{ lat: 1, lng: 1, uuid: "point-removed" }], "point-removed"], // Remove by id
      [
        [{ lat: 1, lng: 1, uuid: "point-removed" }],
        { lat: 2, lng: 2, uuid: "point-removed" },
      ], // Remove by other state of the same point
      [
        [
          { lat: 1, lng: 1, uuid: "point-removed" },
          { lat: 2, lng: 2, uuid: "point-to-keep" },
        ],
        "point-removed",
      ], // Removed on a list tha contain two point
    ];

    for (const [existingPoints, pointRemoved] of testCases)
      it(s`should remove points ${[existingPoints, pointRemoved]}`, () => {
        const addedPoint: Point = { lat: 0, lng: 0 };
        const path = Paths.create();
        path.points = existingPoints;
        const updatedPath = Paths.remove(path, pointRemoved);

        expect(updatedPath.points.length).toBe(
          Math.max(existingPoints.length - 1, 0)
        );
        expect(updatedPath.points).not.toEqual(expect.arrayContaining([expect.objectContaining({uuid: "point-removed"})]));
       
      });
  });
});
