import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);

import authActions from "./modules/auth/authActions";
// Define user-related routes
import userActions from "./modules/user/userActions";
router.post("/api/users", userActions.add);
router.post("/api/auth/login", authActions.login);
router.put("/api/users/:id/avatar", userActions.updateAvatar);
router.post("/api/auth/logout", authActions.logout);

import rankingActions from "./modules/ranking/rankingActions";

// Add these routes to your existing router
router.post("/api/rankings", rankingActions.add);
router.get("/api/rankings/:userId", rankingActions.getUserRankings);
router.delete("/api/rankings/:userId/:itemId", rankingActions.remove);

/* ************************************************************************* */

export default router;
