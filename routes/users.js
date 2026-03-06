var express = require('express');
var router = express.Router();
let { data } = require('../utils/dataUser');
let { IncrementalId } = require('../utils/IncrementalIdHandler');

/* GET all users */
router.get('/', function (req, res, next) {
  let result = data.filter(function (e) {
    return !e.isDeleted;
  });
  res.send(result);
});

/* GET user by ID */
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
      message: "USER NOT FOUND"
    });
  }
});

/* POST create new user */
router.post('/', function (req, res, next) {
  let { username, password, email, fullName, avatarUrl, status, role, loginCount } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send({ message: "Username, password and email are required" });
  }

  // Check for unique username and email
  let existsUsername = data.find(e => !e.isDeleted && e.username === username);
  if (existsUsername) {
    return res.status(400).send({ message: "Username already exists" });
  }
  let existsEmail = data.find(e => !e.isDeleted && e.email === email);
  if (existsEmail) {
    return res.status(400).send({ message: "Email already exists" });
  }

  let newObj = {
    id: IncrementalId(data),
    username: username,
    password: password,
    email: email,
    fullName: fullName !== undefined ? fullName : "",
    avatarUrl: avatarUrl !== undefined ? avatarUrl : "https://i.sstatic.net/l60Hf.png",
    status: status !== undefined ? status : false,
    role: role !== undefined ? role : null, // Assuming numerical ID or string ID ref
    loginCount: loginCount !== undefined ? Math.max(0, parseInt(loginCount) || 0) : 0,
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  };
  data.push(newObj);
  res.status(201).send(newObj);
});

/* POST enable user */
router.post('/enable', function (req, res, next) {
  let { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).send({ message: "Email and username are required" });
  }

  let user = data.find(e => !e.isDeleted && e.email === email && e.username === username);

  if (!user) {
    return res.status(404).send({ message: "User not found or credentials incorrect" });
  }

  user.status = true;
  user.updatedAt = new Date(Date.now());

  res.send({ message: "User status enabled", user: user });
});

/* POST disable user */
router.post('/disable', function (req, res, next) {
  let { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).send({ message: "Email and username are required" });
  }

  let user = data.find(e => !e.isDeleted && e.email === email && e.username === username);

  if (!user) {
    return res.status(404).send({ message: "User not found or credentials incorrect" });
  }

  user.status = false;
  user.updatedAt = new Date(Date.now());

  res.send({ message: "User status disabled", user: user });
});

/* PUT update user by ID */
router.put('/:id', function (req, res, next) {
  let result = data.find(
    function (e) {
      return e.id == req.params.id;
    }
  );
  if (result) {
    let body = req.body;

    // Check for unique username and email if updating them
    if (body.username && body.username !== result.username) {
      let existsUsername = data.find(e => !e.isDeleted && e.username === body.username);
      if (existsUsername) {
        return res.status(400).send({ message: "Username already exists" });
      }
    }

    if (body.email && body.email !== result.email) {
      let existsEmail = data.find(e => !e.isDeleted && e.email === body.email);
      if (existsEmail) {
        return res.status(400).send({ message: "Email already exists" });
      }
    }

    let keys = Object.keys(body);
    for (const key of keys) {
      if (result[key] !== undefined && key !== 'id') {
        if (key === 'loginCount') {
          result[key] = Math.max(0, parseInt(body[key]) || 0); // min=0
        } else {
          result[key] = body[key];
        }
      } else if (key === 'fullName' || key === 'avatarUrl' || key === 'status' || key === 'role' || key === 'loginCount') {
        if (key === 'loginCount') {
          result[key] = Math.max(0, parseInt(body[key]) || 0);
        } else {
          result[key] = body[key];
        }
      }
    }
    result.updatedAt = new Date(Date.now());
    res.send(result);
  } else {
    res.status(404).send({
      message: "USER NOT FOUND"
    });
  }
});

/* DELETE user by ID (soft delete) */
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
      message: "USER NOT FOUND"
    });
  }
});

module.exports = router;
