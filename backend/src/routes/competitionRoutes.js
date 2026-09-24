const express = require('express');
const { listCompetitions, getCompetitionDetails } = require('../controllers/competitionController');
const {
  registerForCompetition,
  confirmPayment,
  cancelRegistration,
} = require('../controllers/registrationController');
const { createSubmission } = require('../controllers/submissionController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', listCompetitions);
router.get('/:id', optionalAuth, getCompetitionDetails);

router.post('/:id/register', requireAuth, registerForCompetition);
router.post('/:id/registration/confirm-payment', requireAuth, confirmPayment);
router.delete('/:id/register', requireAuth, cancelRegistration);

router.post('/:id/submissions', requireAuth, createSubmission);

module.exports = router;
