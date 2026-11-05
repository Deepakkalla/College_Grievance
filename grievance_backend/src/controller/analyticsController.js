const  Grievance = require("../models/Grievance")

const getSummary = async (req, res) => {
  try {
    console.log("hello0")
    const [total, unassigned, statusAgg, departmentAgg, categoryAgg, resolutionAgg] =
      await Promise.all([
        Grievance.countDocuments(),

        Grievance.countDocuments({ assignedTo: null }),

        Grievance.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        Grievance.aggregate([
          { $group: { _id: "$department", count: { $sum: 1 } } },
          {
            $lookup: {
              from: "departments",
              localField: "_id",
              foreignField: "_id",
              as: "dept",
            },
          },
          { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 0,
              department: { $ifNull: ["$dept.name", "Unknown"] },
              count: 1,
            },
          },
          { $sort: { count: -1 } },
        ]),

        Grievance.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $project: { _id: 0, category: "$_id", count: 1 } },
          { $sort: { count: -1 } },
        ]),

        
        Grievance.aggregate([
          { $match: { status: "resolved", resolvedAt: { $exists: true } } },
          {
            $group: {
              _id: null,
              avgMs: { $avg: { $subtract: ["$resolvedAt", "$createdAt"] } },
            },
          },
        ]),
      ]);
      console.log("hello")
      
      // make sure every status appears, even with 0
      const byStatus = {
        submitted: 0,
        under_review: 0,
        in_progress: 0,
        resolved: 0,
        rejected: 0,
      };
      statusAgg.forEach((s) => {
        byStatus[s._id] = s.count;
      });
      console.log("hello1")

    const avgHours = resolutionAgg.length
      ? Math.round((resolutionAgg[0].avgMs / 3600000) * 10) / 10
      : 0;

    res.json({
      total,
      unassigned,
      byStatus,
      byDepartment: departmentAgg,
      byCategory: categoryAgg,
      avgResolutionHours: avgHours,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getSummary}