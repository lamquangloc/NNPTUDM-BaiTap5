var express = require('express');
var router = express.Router();
let { data } = require('../utils/dataRole');
let { IncrementalId } = require('../utils/IncrementalIdHandler');

/* GET all roles */
router.get('/', function (req, res, next) {
    let result = data.filter(function (e) {
        return !e.isDeleted;
    });
    res.send(result);
});

/* GET role by ID */
router.get('/:id', function (req, res, next) {
    let result = data.find(
        function (e) {
            return (!e.isDeleted) && e.id == req.params.id;
        }
    );
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({
            message: "ROLE NOT FOUND"
        });
    }
});

/* POST create new role */
router.post('/', function (req, res, next) {
    if (!req.body.name) {
        return res.status(400).send({ message: "Name is required" });
    }

    // Check for unique name
    let exists = data.find(e => !e.isDeleted && e.name === req.body.name);
    if (exists) {
        return res.status(400).send({ message: "Role name already exists" });
    }

    let newObj = {
        id: IncrementalId(data),
        name: req.body.name,
        description: req.body.description || "",
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    };
    data.push(newObj);
    res.status(201).send(newObj);
});

/* PUT update role by ID */
router.put('/:id', function (req, res, next) {
    let result = data.find(
        function (e) {
            return e.id == req.params.id;
        }
    );
    if (result) {
        let body = req.body;

        // Check for unique name if updating name
        if (body.name && body.name !== result.name) {
            let exists = data.find(e => !e.isDeleted && e.name === body.name);
            if (exists) {
                return res.status(400).send({ message: "Role name already exists" });
            }
        }

        let keys = Object.keys(body);
        for (const key of keys) {
            if (result[key] !== undefined && key !== 'id') {
                result[key] = body[key];
            }
        }
        result.updatedAt = new Date(Date.now());
        res.send(result);
    } else {
        res.status(404).send({
            message: "ROLE NOT FOUND"
        });
    }
});

/* DELETE role by ID (soft delete) */
router.delete('/:id', function (req, res, next) {
    let result = data.find(
        function (e) {
            return e.id == req.params.id;
        }
    );
    if (result) {
        result.isDeleted = true;
        res.send(result);
    } else {
        res.status(404).send({
            message: "ROLE NOT FOUND"
        });
    }
});

module.exports = router;
