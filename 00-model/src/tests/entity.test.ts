import { Entities } from "../../index";

describe("Entity operations", () => {
  describe("Entity.newUUID", () => {
    const someNameSpace = "74738ff5-5367-5958-9aee-98fffdcd1876";
    it("should generate uuid as a string", () => {
      expect(typeof Entities.newUUID(someNameSpace)).toBe("string");
    });

    it("should generate uuid as a valid uuid", () => {
      const validUUIDRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(Entities.newUUID(someNameSpace)).toMatch(validUUIDRegex);
    });
  });

  describe("Entity.update", () => {
    it("update the entity", () => {
      const testEntity = {
        value: 1,
        otherValue: "bla",
        uuid: "testEntity",
      };

      const testsCases = [
        [
          {
            value: 2,
            otherValue: "blu",
          },
          {
            value: 2,
            otherValue: "blu",
            uuid: "testEntity",
          },
        ],
        [
          // Updating with partial entity
          {
            value: 3,
          },
          {
            value: 3,
            otherValue: "bla",
            uuid: "testEntity",
          },
        ],
        [
          // Updating with an other entity
          {
            value: 4,
            uuid: "pop",
          },
          {
            value: 4,
            otherValue: "bla",
            uuid: "testEntity",
          },
        ],
      ];

      for (const [update, expectResult] of testsCases)
        expect(Entities.update(testEntity, update)).toEqual(expectResult);
    });

    it("update create a copy of the base entity and do not mutate it", () => {
      const baseEntity = {
        value: 1,
        otherValue: "bla",
        uuid: "testEntity",
      };

      const updatedEntity = Entities.update(baseEntity, {
        value: 2,
        otherValue: "blu",
      });

      expect(updatedEntity).not.toBe(baseEntity);
      expect(baseEntity).toEqual({
        value: 1,
        otherValue: "bla",
        uuid: "testEntity",
      });
    });
  });
});
