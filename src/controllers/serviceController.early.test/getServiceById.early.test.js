// Unit tests for: getServiceById

const connection = require("../../config/database");
const { getServiceById } = require("../serviceController");

jest.mock("../../config/database");

describe("getServiceById() getServiceById method", () => {
  let req, res, serviceId;

  beforeEach(() => {
    serviceId = "1"; // Default serviceId for tests
    req = { params: { serviceId } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return service details with menu and menu items when service exists", async () => {
      // Mock database responses
      const serviceResult = [
        {
          id: serviceId,
          name: "Test Service",
          description: "Test Description",
          price: 100,
          image: "test.jpg",
          rating: 5,
          discount: 10,
          isNew: true,
        },
      ];
      const menuResult = [
        {
          _id: "1",
          restaurant: serviceId,
          title: "Test Menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const menuItemResult = [
        {
          _id: "1",
          restaurant: "1",
          title: "Test Item",
          basePrice: 10,
          description: "Test Item Description",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      connection.query
        .mockImplementationOnce((query, params, callback) =>
          callback(null, serviceResult)
        )
        .mockImplementationOnce((query, params, callback) =>
          callback(null, menuResult)
        )
        .mockImplementationOnce((query, params, callback) =>
          callback(null, menuItemResult)
        );

      await getServiceById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Fetch a service by id",
        data: {
          id: serviceId,
          name: "Test Service",
          rating: 5,
          image: "test.jpg",
          discount: 10,
          price: 100,
          description: "Test Description",
          isNew: true,
          menu: [
            {
              _id: "1",
              restaurant: serviceId,
              title: "Test Menu",
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              menuItem: [
                {
                  _id: "1",
                  restaurant: "1",
                  title: "Test Item",
                  basePrice: 10,
                  description: "Test Item Description",
                  createdAt: expect.any(Date),
                  updatedAt: expect.any(Date),
                },
              ],
            },
          ],
        },
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return 404 if no service is found with the given ID", async () => {
      connection.query.mockImplementationOnce((query, params, callback) =>
        callback(null, [])
      );

      await getServiceById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No service found with this ID.",
      });
    });

    it("should handle database errors gracefully", async () => {
      const error = new Error("Database error");
      connection.query.mockImplementationOnce((query, params, callback) =>
        callback(error)
      );

      await getServiceById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });

    it("should handle errors when fetching menu", async () => {
      const serviceResult = [
        {
          id: serviceId,
          name: "Test Service",
          description: "Test Description",
          price: 100,
          image: "test.jpg",
          rating: 5,
          discount: 10,
          isNew: true,
        },
      ];
      const error = new Error("Database error");

      connection.query
        .mockImplementationOnce((query, params, callback) =>
          callback(null, serviceResult)
        )
        .mockImplementationOnce((query, params, callback) => callback(error));

      await getServiceById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });

    it("should handle errors when fetching menu items", async () => {
      const serviceResult = [
        {
          id: serviceId,
          name: "Test Service",
          description: "Test Description",
          price: 100,
          image: "test.jpg",
          rating: 5,
          discount: 10,
          isNew: true,
        },
      ];
      const menuResult = [
        {
          _id: "1",
          restaurant: serviceId,
          title: "Test Menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const error = new Error("Database error");

      connection.query
        .mockImplementationOnce((query, params, callback) =>
          callback(null, serviceResult)
        )
        .mockImplementationOnce((query, params, callback) =>
          callback(null, menuResult)
        )
        .mockImplementationOnce((query, params, callback) => callback(error));

      await getServiceById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});

// End of unit tests for: getServiceById
