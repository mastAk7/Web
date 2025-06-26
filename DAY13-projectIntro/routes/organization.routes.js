const express = require('express');
const { getOrganizations, createOrganization, getUsers, joinOrganization } = require('../controllers/organization.controller');
const restrict = require('../middlewares/organization.middleware.js')
const router = express.Router();

router.post('/', createOrganization);
router.post('/:id/join', restrict, joinOrganization);
router.get('/', getOrganizations);
router.get('/:id/members', restrict, getUsers);

module.exports = router;