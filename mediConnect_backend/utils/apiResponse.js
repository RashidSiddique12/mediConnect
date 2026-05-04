const success = (res, data = null, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const created = (res, data = null, message = "Created successfully") => {
  return res.status(201).json({ success: true, message, data });
};

const paginated = (res, data, pagination, message = "Success") => {
  return res.status(200).json({ success: true, message, data, pagination });
};

module.exports = { success, created, paginated };
