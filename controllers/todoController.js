const validation = require("../libraries/validation");
const db = require("../data/database");

//requests are already authenticated

const api_get_todo = (req, res) => {
    const pkuser = res.locals.pkuser;

    db.connection.query("SELECT t.pktodo AS id, t.title, t.completed FROM todo AS t WHERE t.fkuser = ?", [pkuser], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json("Errore interno");
        }

        return res.status(200).json(result);
    })
}

const api_create_todo = (req, res) => {
    const { title } = req.body;
    const pkuser = res.locals.pkuser;

    const error = validation.validateTodo(title);
    if(error) return res.status(400).json(error);

    //if it's valid
    db.connection.query("INSERT INTO todo (title, completed, fkuser) VALUES (?, 0, ?)", [title, pkuser], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json("Errore interno");
        }

        return res.status(201).end();
    })
}

const api_update_todo_by_id = (req, res) => {
    const pktodo = req.params.id;
    const { title } = req.body;
    const pkuser = res.locals.pkuser;

    //validation
    const error = validation.validateTodo(title);
    if(error) return res.status(400).json(error);

    //this makes sure that only the user who created the todo can edit it
    db.connection.query("UPDATE todo SET title = ? WHERE pktodo = ? AND fkuser = ?", [title, pktodo, pkuser], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json("Errore interno");
        }
        if(result.affectedRows === 0) return res.status(404).json("Todo non trovato");
        
        //if everything ok
        return res.status(200).end();
    })
}

const api_delete_todo_by_id = (req, res) => {
    const pktodo = req.params.id;
    const pkuser = res.locals.pkuser;

    db.connection.query("DELETE FROM todo WHERE pktodo = ? AND fkuser = ?", [pktodo, pkuser], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json("Errore interno");
        }
        if(result.affectedRows === 0) return res.status(404).json("Todo non trovato");

        //if everything ok
        return res.status(200).end();
    })
}

const api_complete_todo_by_id = (req, res) => {
    const pktodo = req.params.id;
    const pkuser = res.locals.pkuser;

    db.connection.query("UPDATE todo SET completed = 1 WHERE pktodo = ? AND fkuser = ?", [pktodo, pkuser], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json("Errore interno");
        }
        if(result.affectedRows === 0) return res.status(404).json("Todo non trovato");
        
        //if everything ok
        return res.status(200).end();
    })
}

module.exports = {
    api_get_todo,
    api_create_todo,
    api_update_todo_by_id,
    api_delete_todo_by_id,
    api_complete_todo_by_id
}