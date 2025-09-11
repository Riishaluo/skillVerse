const Feedback = require("../models/feedback");



exports.addFeedback = async (req, res) => {
  try {
    console.log("here")
    const { rating, comment, isAnonymous } = req.body;
    const from = req.user.id; 

    console.log(req.body)

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const feedback = new Feedback({ from, rating, comment, isAnonymous });
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate("from", "name");
        console.log(feedbacks)
        res.status(200).json({ feedbacks });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch feedbacks", error: err.message });
    }
};