const express = require("express");

const {
    handleChat,
    getUserChats,
    getSingleChat,
    deleteSingleChat,
    toggleFavorite,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * The route accepts both guests and authenticated users.
 *
 * We don't use protect here because
 * guests are allowed to use 3 free messages.
 */
router.post("/", (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return handleChat(req, res);
    }

    protect(req, res, () => {
        handleChat(req, res);
    });
});

router.get("/", protect, getUserChats);
router.get("/:id", protect, getSingleChat);
router.delete("/:id", protect, deleteSingleChat);
router.patch("/:id/favorite", protect, toggleFavorite);

module.exports = router;