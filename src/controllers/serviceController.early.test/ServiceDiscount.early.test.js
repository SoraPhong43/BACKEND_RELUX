// Unit tests for: ServiceDiscount

const connection = require("../../config/database");
const { ServiceDiscount } = require("../path/to/your/module");
const connection = require("../../config/database");
const { ServiceDiscount } = require("../serviceController");

jest.mock("../../config/database");

describe("ServiceDiscount() ServiceDiscount method", () => {
  let req, res;

  beforeEach(() => {
    req = {}; // No need for req.body as categoryId is hardcoded in the function
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return a list of services when services are found", async () => {
      // Arrange
      const mockServices = [
        {
          serviceId: 1,
          serviceName: "Service 1",
          description: "Desc 1",
          price: 100,
          image: "img1.jpg",
          rating: 5,
          discount: 10,
          isNew: true,
        },
        {
          serviceId: 2,
          serviceName: "Service 2",
          description: "Desc 2",
          price: 200,
          image: "img2.jpg",
          rating: 4,
          discount: 15,
          isNew: false,
        },
      ];
      connection.query.mockImplementation((query, params, callback) => {
        callback(null, [mockServices]);
      });

      // Act
      await ServiceDiscount(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockServices);
    });
  });

  describe("Edge Cases", () => {
    it("should return 404 when no services are found", async () => {
      // Arrange
      connection.query.mockImplementation((query, params, callback) => {
        callback(null, [[]]); // No services found
      });

      // Act
      await ServiceDiscount(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No services found for this category.",
      });
    });

    it("should return 500 when there is a database error", async () => {
      // Arrange
      connection.query.mockImplementation((query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      // Act
      await ServiceDiscount(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});

// End of unit tests for: ServiceDiscount
