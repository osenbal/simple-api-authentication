const router = require("express").Router();
const Posts = require("../model/post");

router.get("/", (req, res) => {
  Posts.find((err, docs) => {
    if (!err) {
      return res.json({ status: "ok", data: docs });
    } else {
      console.log("Failed to retrieve the Course List: " + err);
    }
  });
});

// must have header with authorization token
router.use(require("../middleware/veryfyToken"));

router.post("/", async (req, res) => {
  const PostData = req.body;
  const token = req.headers["authorization"].split(" ")[1];

  const tokenParts = token.split(".");
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);

  try {
    await Posts.create({
      title: PostData.title,
      content: PostData.content,
      createdBy: user.username,
    });
  } catch (error) {
    console.log(error);
    return;
  }
  res.json({ status: "ok", message: "Success create post" });
});

router.put("/:id", async (req, res) => {
  const { content, title } = req.body;
  const idPost = req.params.id;

  await Posts.updateOne({ _id: idPost }, { $set: { content, title } })
    .then(() => {
      return res.json({ status: "ok", message: "update successfully" });
    })
    .catch(() => {
      return res.json({ status: "error", message: "update failed" });
    });
});

router.delete("/:id", async (req, res) => {
  await Posts.deleteOne({ _id: req.params.id })
    .then(() => res.json({ status: "ok", message: "delete successfully" }))
    .catch((err) => res.send(err));
});

module.exports = router;
