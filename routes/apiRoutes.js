const { Router } = require('express');
const todoController = require('../controllers/todoController');

const router = Router();

//all routes here are under /api route and authenticated

router.get("/todo", todoController.api_get_todo);
router.post("/todo", todoController.api_create_todo);
router.put("/todo/:id", todoController.api_update_todo_by_id);
router.delete("/todo/:id", todoController.api_delete_todo_by_id);
router.put("/complete/:id", todoController.api_complete_todo_by_id);


module.exports = router;