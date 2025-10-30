import express from "express";

export default function createUsersRouter(userService) {
  const router = express.Router();

  router
    .route("/")
    .get(async (_req, res, next) => {
      try {
        const rows = await userService.listUsers();
        res.json(rows);
      } catch (error) {
        next(error);
      }
    })
    .post(async (req, res, next) => {
      try {
        const user = await userService.createUser(req.body);
        res.setHeader("Location", `/users/${user.id}`);
        res.status(201).json({ user });
      } catch (error) {
        next(error);
      }
    });

  router
    .route("/:id")
    .get(async (req, res, next) => {
      const id = parseInt(req.params.id);
      try {
        const user = await userService.getUserById(id);
        if (!user) return res.status(404).json({ error: "Not Found" });
        res.json({ user: user });
      } catch (error) {
        next(error);
      }
    })
    .put(async (req, res, next) => {
      const id = parseInt(req.params.id);
      try {
        const user = await userService.updateUser(id, req.body);
        if (!user) return res.status(404).json({ error: "Not Found" });
        res.json({ updated: true, user: user });
      } catch (error) {
        next(error);
      }
    })
    .delete(async (req, res, next) => {
      const id = parseInt(req.params.id);
      try {
        const ok = await userService.deleteUser(id);
        if (!ok) return res.status(404).json({ error: "Not Found" });
        return res.status(204).end();
      } catch (error) {
        next(error);
      }
    });

  return router;
}
