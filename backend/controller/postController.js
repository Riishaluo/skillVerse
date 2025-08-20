const Post = require('../models/postSchema')
const cloudinary = require('../utils/cloudinary')



exports.createPost = async (req, res) => {
  try {
    const { type, description } = req.body;
    let photo = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      photo = result.secure_url;
    }

    const post = new Post({
      createdBy: req.user.id,
      type,
      description,
      photo
    });

    await post.save();
    res.status(201).json({ success: true, post });

  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Error creating post" });
  }
}

exports.toggleLike = async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { postId } = req.params;
    console.log(postId)
    const userId = req.user.id.toString(); 


    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    
    const index = post.likes.findIndex(id => id?.toString() === userId);

    if (index === -1) {
      post.likes.push(userId); 
    } else {
      post.likes.splice(index, 1); 
    }

    post.likes = post.likes.filter(Boolean);
    await post.save();
    res.json({
      liked: index === -1,
      likesCount: post.likes.length
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    console.log(postId)
    console.log(text)

    if (!text.trim()) return res.status(400).json({ message: "Comment cannot be empty" });
    console.log('here')
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    console.log(post)

    post.comments.push({ text, commentedBy: req.user.id });
    await post.save();

    const populatedPost = await Post.findById(postId).populate("comments.commentedBy", "name");
    res.json({ comments: populatedPost.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.addReport = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;

    if (!reason?.trim()) {
      return res.status(400).json({ message: "Reason is required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyReported = post.reports.some(
      r => r.reportedBy.toString() === req.user.id.toString()
    );
    if (alreadyReported) {
      return res.status(400).json({ message: "You already reported this post" });
    }

    post.reports.push({ reportedBy: req.user.id, reason });
    await post.save();

    const populatedPost = await Post.findById(postId)
      .populate("reports.reportedBy", "name");

    res.json({
      success: true,
      reports: populatedPost.reports,
      message: "Report submitted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


