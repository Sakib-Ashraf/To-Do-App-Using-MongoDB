const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');
const Todo = mongoose.model("Todo", todoSchema);

//get all the todos
router.get('/', (req, res) => {
    Todo.find()
        .then((data) => {
            if (data) {
                res.status(200).json(data);
        } else {
            res.status(400).json({message: 'something is wrong'});
        }
    })
        .catch((err) => console.log(err));
});

//get a todo by id
router.get('/:id', (req, res) => {
     Todo.find({_id: req.params.id})
			.then((data) => {
				if (data) {
					res.status(200).json(data);
				} else {
					res.status(400).json({ message: 'something is wrong' });
				}
			})
			.catch((err) => console.log(err));
});

//post a todo
router.post('/', (req, res) => {
    const newTodo = new Todo(req.body);
    newTodo.save()
        .then((data) => {
			if (data) {
				res.status(200).json({
					result: data,
					message: 'successfully saved'
				 });
            } else {
                res.status(400).json({ message: 'something is wrong' });
			}
		})
		.catch((err) => console.log(err));
});

//post all the todos
router.post('/all', (req, res) => {
    Todo.insertMany(req.body)
        .then((data) => {
		if (data) {
			res.status(200).json({
				result: data,
				message: 'All Data successfully saved',
			});
		} else {
			res.status(400).json({ message: 'something is wrong' });
		}
    })
        .catch((err) => console.log(err));
});

//put a todo
router.put('/:id', (req, res) => {
    Todo.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: {
            status : req.body.status
            }
        },
       {
           new: true
        })
        .then(
           (data) => {
               if (data) {
                   console.log(data);
                   res.status(200).json({
                       message: 'Data Successfully Updated',
                       data: data
                   });
        } else {
            res.status(400).json({message: 'Something Is Wrong'});
        }
        })
        .catch(err => console.log(err));
});

//delete todo
router.delete('/:id', (req, res) => {
     Todo.deleteOne({_id: req.params.id})
         .then((data) => {
				if (data) {
					res.status(200).json({ message: 'Successfully Deleted!' });
				} else {
					res.status(400).json({ message: 'something is wrong' });
				}
			})
			.catch((err) => console.log(err));
});

module.exports = router;