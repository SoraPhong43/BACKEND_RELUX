const connection = require("../config/database");

const createBookingTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bookings (
      bookingId INT AUTO_INCREMENT PRIMARY KEY,
      name NVARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      bookingTime DATETIME NOT NULL,
      bookingNotes TEXT,
      serviceId INT,
      locationID INT,
      userId INT,
      employeeId INT, -- Added data type for employeeId
      status VARCHAR(50) DEFAULT 'Pending',
      totalAmount DECIMAL(10, 2) DEFAULT 0.00,
      serviceName NVARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (serviceId) REFERENCES services(serviceId) ON DELETE SET NULL ON UPDATE CASCADE,
      FOREIGN KEY (locationID) REFERENCES locations(locationID) ON DELETE SET NULL ON UPDATE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE SET NULL ON UPDATE CASCADE,
      FOREIGN KEY (employeeId) REFERENCES employees(employeeID) ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;

  connection.query(createTableQuery, (error, result) => {
    if (error) {
      return console.log("Error creating bookings table:", error.message);
    }
    console.log("Bookings table created successfully");

    // Optional: Code to add userId foreign key if needed
  });
};

module.exports = { createBookingTable };
