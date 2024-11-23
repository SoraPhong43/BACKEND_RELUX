const connection = require("../config/database");

const booking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bookingTime,
      bookingNotes,
      serviceId,
      locationId,
      userId,
      employeeId,
      status,
      totalAmount,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !name ||
      !phone ||
      !bookingTime ||
      !serviceId ||
      !locationId ||
      !employeeId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Kiểm tra xem employeeId có tồn tại trong bảng employees không
    const employeeCheckQuery = "SELECT * FROM employees WHERE employeeID = ?";
    connection.query(employeeCheckQuery, [employeeId], (error, results) => {
      if (error) {
        console.error("Error checking employee:", error);
        return res.status(500).json({ error: "Error checking employee" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid employeeId" });
      }

      // Kiểm tra tên dịch vụ từ bảng services dựa trên serviceId
      const serviceCheckQuery =
        "SELECT serviceName FROM services WHERE serviceId = ?";
      connection.query(serviceCheckQuery, [serviceId], (error, results) => {
        if (error) {
          console.error("Error checking service:", error);
          return res.status(500).json({ error: "Error checking service" });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: "Invalid serviceId" });
        }

        const serviceName = results[0].serviceName; // Lấy tên dịch vụ từ kết quả query

        // Nếu dịch vụ tồn tại, tiếp tục chèn booking mới
        const insertQuery = `
          INSERT INTO bookings 
          (name, email, phone, bookingTime, bookingNotes, serviceId, serviceName, locationID, userId, employeeId, status, totalAmount) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
          insertQuery,
          [
            name,
            email,
            phone,
            bookingTime,
            bookingNotes,
            serviceId,
            serviceName, // Chèn serviceName vào bảng bookings
            locationId,
            userId,
            employeeId,
            status || "Pending",
            totalAmount || 0.0,
          ],
          (error, result) => {
            if (error) {
              console.error("Error inserting booking:", error);
              return res
                .status(500)
                .json({ error: "Failed to create booking" });
            }

            res.status(201).json({
              message: "Booking created successfully",
              bookingId: result.insertId,
            });
          }
        );
      });
    });
  } catch (error) {
    console.error("Error in booking function:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllBookings = (req, res) => {
  console.log("Request received for all bookings"); // Kiểm tra xem yêu cầu có được nhận hay không

  const selectAllBookingsQuery = "SELECT * FROM bookings";

  connection.query(selectAllBookingsQuery, (error, result) => {
    if (error) {
      console.log("Error fetching bookings:", error.message);
      return res.status(500).json({ error: "Error fetching bookings" });
    }

    console.log("Bookings fetched successfully:", result); // In kết quả truy vấn
    res.status(200).json(result);
  });
};

module.exports = { booking, getAllBookings };
