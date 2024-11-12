const express = require('express');
const router = express.Router();
const Payroll = require('../../models/hr/Payroll');

router.get('/', async (req, res) => {
  try {
    const payroll = await Payroll.find().populate('employee');
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const payroll = new Payroll(req.body);
  try {
    const newPayroll = await payroll.save();
    res.status(201).json(newPayroll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;