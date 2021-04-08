var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
const Reminder = require('../models/reminders');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('<p>HTML Data</p>');
});

router.post('/reminders', (req, res) => {
  const { user, description, date } = req.body;
  // console.log(`data: = ${user}, ${description}, ${date}`)

  Reminder.create({ user, description, date })
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.log(err);
      res.status(404).send(err)
    })

})

router.get('/reminders/:id', async function (req, res) {
  const id = req.params.id;
  try {
    const reminder = await Reminder.findOne({
      where: { id }
    })

    if (reminder === null)
      return res.status(404).send('ID not found')

    return res.json(reminder)
  } catch (error) {
    return res.status(404).send('ID not found')
  }

})

router.get('/reminders', async function (req, res) {
  let user = req.query.user;
  let after = req.query.after;

  try {
    if (
      (!!user) && (!!after)
    ) {
      console.log(`Both user: ${user} and after: ${after} present`)
      const reminders = await Reminder.findAll({

        where: {
          user,
          date: {
            [Op.gt]: parseInt(after, 10)
          }
        }
      })
      return res.json(reminders)

    }
    else if (
      (!!user)
    ) {
      console.log(`Only user : ${user} present`)
      const reminders = await Reminder.findAll({
        where: {
          user
        }
      })
      return res.json(reminders)
    }
    else if (
      (!!after)
    ) {
      console.log(`Only after: ${after} present`)
      const reminders = await Reminder.findAll({
        where: {
          date: {
            [Op.gt]: parseInt(after, 10)
          }
        }
      })
      return res.json(reminders)
    }

    else {
      // console.log(`No optional params present, fetching all`)
      const reminders = await Reminder.findAll()

      return res.json(reminders)
    }
  } catch (err) {
    return res.status(404).send("Something went wrong!")
  }

})

router.put(/reminders/, function (_, res) {

  return res.status(405).send("Request Not allowed");
})
router.delete(/reminders/, function (_, res) {
  return res.status(405).send("Request Not allowed");
})
router.patch(/reminders/, function (_, res) {
  return res.status(405).send("Request Not allowed");
})

module.exports = router;
