const Review = require('../models/Review');
const { success, created, paginated } = require('../utils/apiResponse');

// GET /api/v1/reviews
const getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .populate('hospitalId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    paginated(res, reviews, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/reviews
const createReview = async (req, res, next) => {
  try {
    const { doctorId, hospitalId, rating, comment } = req.body;

    const review = await Review.create({
      patientId: req.user._id,
      doctorId,
      hospitalId,
      rating,
      comment,
    });

    const populated = await Review.findById(review._id)
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .populate('hospitalId', 'name');

    created(res, populated, 'Review submitted successfully');
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/reviews/:id
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (req.user.role === 'patient' && String(review.patientId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .populate('hospitalId', 'name');

    success(res, updated, 'Review updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    success(res, null, 'Review deleted successfully');
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/reviews/:id/approve
const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    )
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .populate('hospitalId', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    success(res, review, 'Review approved');
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/reviews/:id/reject
const rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    )
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .populate('hospitalId', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    success(res, review, 'Review rejected');
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctors/:doctorId/reviews
const getReviewsByDoctor = async (req, res, next) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId, status: 'approved' })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 });

    success(res, reviews);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/hospitals/:hospitalId/reviews
const getReviewsByHospital = async (req, res, next) => {
  try {
    const reviews = await Review.find({ hospitalId: req.params.hospitalId, status: 'approved' })
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 });

    success(res, reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  getReviewsByDoctor,
  getReviewsByHospital,
};
