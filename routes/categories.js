var express = require('express');
var router = express.Router();
let { data } = require('../utils/dataCategory');
let { data: productsData } = require('../utils/data');
let slugify = require('slugify');
let { IncrementalId } = require('../utils/IncrementalIdHandler');

/* GET all categories with optional name filter */
// /api/v1/categories?name=clothes
router.get('/', function (req, res, next) {
    let nameQ = req.query.name ? req.query.name : '';
    let result = data.filter(function (e) {
        return (!e.isDeleted) &&
            e.name.toLowerCase().includes(nameQ.toLowerCase());
    });
    res.send(result);
});

/* GET category by slug */
// /api/v1/categories/slug/clothes
router.get('/slug/:slug', function (req, res, next) {
    let slug = req.params.slug;
    let result = data.find(
        function (e) {
            return (!e.isDeleted) && e.slug == slug;
        }
    );
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({
            message: "SLUG NOT FOUND"
        });
    }
});

/* GET all products by category ID */
// /api/v1/categories/7/products
router.get('/:id/products', function (req, res, next) {
    let categoryId = parseInt(req.params.id);

    // First check if category exists
    let category = data.find(
        function (e) {
            return (!e.isDeleted) && e.id == categoryId;
        }
    );

    if (!category) {
        return res.status(404).send({
            message: "CATEGORY NOT FOUND"
        });
    }

    // Filter products by category ID
    let result = productsData.filter(function (product) {
        return (!product.isDeleted) && product.category.id == categoryId;
    });

    res.send(result);
});

/* GET category by ID */
// /api/v1/categories/7
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
            message: "ID NOT FOUND"
        });
    }
});

/* POST create new category */
// /api/v1/categories
// Body: { "name": "New Category", "image": "https://example.com/image.jpg" }
router.post('/', function (req, res, next) {
    let newObj = {
        id: IncrementalId(data),
        name: req.body.name,
        slug: slugify(req.body.name, {
            replacement: '-',
            lower: true,
            locale: 'vi',
        }),
        image: req.body.image,
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    };
    data.push(newObj);
    res.status(201).send(newObj);
});

/* PUT update category by ID */
// /api/v1/categories/7
// Body: { "name": "Updated Name", "image": "https://example.com/new-image.jpg" }
router.put('/:id', function (req, res, next) {
    let result = data.find(
        function (e) {
            return e.id == req.params.id;
        }
    );
    if (result) {
        let body = req.body;
        let keys = Object.keys(body);
        for (const key of keys) {
            if (key === 'name') {
                result.name = body.name;
                result.slug = slugify(body.name, {
                    replacement: '-',
                    lower: true,
                    locale: 'vi',
                });
            } else if (result[key] !== undefined) {
                result[key] = body[key];
            }
        }
        result.updatedAt = new Date(Date.now());
        res.send(result);
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        });
    }
});

/* DELETE category by ID (soft delete) */
// /api/v1/categories/7
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
            message: "ID NOT FOUND"
        });
    }
});

module.exports = router;
