const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const BlueBird = require('bluebird');
const Reminders = require('../models/reminders');

chai.use(chaiHttp);

const setup = (...reminders) => {
    return BlueBird.mapSeries(reminders, user => {
        return chai.request(server)
            .post('/reminders')
            .send(user)
            .then(response => {
                return response.body;
            })
    })
}

describe('reminders_api', () => {
    const user_1_1 = {
        "user": 1,
        "description": "Drink Coffee",
        "date": "2020-08-24T07:28:24.000Z"
    }

    const user_2_1 = {
        "user": 2,
        "description": "Workout",
        "date": "2020-08-24T08:28:24.000Z"
    }

    const user_2_2 = {
        "user": 2,
        "description": "Eat Breakfast",
        "date": "2020-08-25T08:28:24.000Z"
    }

    const user_1_2 = {
        "user": 1,
        "description": "Eat Lunch",
        "date": "2020-08-24T13:28:24.000Z"
    }


    beforeEach(async () => {
        await Reminders.sync();
    })

    afterEach(async () => {
        await Reminders.drop();
    })

    it('should create a new reminder', async () => {
        const response = await chai.request(server).post('/reminders').send(user_1_1)
        response.should.have.status(201);
        delete response.body.id;
        response.body.should.eql(user_1_1)
    });

    it('should fetch all the reminders', async () => {
        const results = await setup(user_1_1, user_1_2, user_2_1, user_2_2);
        const response = await chai.request(server).get('/reminders')
        response.should.have.status(200);
        response.body.should.eql(results);
    })

    it('should fetch no reminders if no matching results are present for user', async () => {
        const results = await setup(user_1_1, user_1_2, user_2_1, user_2_2);
        const response = await chai.request(server).get('/reminders?user=3')
        response.should.have.status(200);
        response.body.should.eql([]);
    })

    it('should fetch no reminders if no matching results are present after the date', async () => {
        const results = await setup(user_1_1, user_1_2, user_2_1, user_2_2);
        const response = await chai.request(server).get('/reminders?after=1598448504000')
        response.should.have.status(200);
        response.body.should.eql([]);
    })

    it('should fetch all the reminders for a user', async () => {
        const results = await setup(user_1_1, user_1_2, user_2_1, user_2_2);
        const response = await chai.request(server).get('/reminders?user=2')
        response.should.have.status(200);
        response.body.should.eql([results[2], results[3]]);
    })

    it('should fetch all the reminders after the date', async () => {
        const results = await setup(user_1_1, user_1_2, user_2_1, user_2_2);
        const response = await chai.request(server).get('/reminders?after=1598318904000')
        response.should.have.status(200);
        response.body.should.eql([results[3]]);
    })

    it('should fetch all the reminders for a user after the date', async () => {
        const results = await setup(user_1_1, user_1_2, user_2_1, user_2_2);
        const response = await chai.request(server).get('/reminders?after=1598254824000&user=1')
        response.should.have.status(200);
        response.body.should.eql([results[1]]);
    })


    it('should fetch a single reminder', async () => {
        const [reminder] = await setup(user_2_2);
        const response = await chai.request(server).get(`/reminders/${reminder.id}`)
        response.should.have.status(200);
        response.body.should.eql(reminder);
    })

    it('should get 404 if the reminder ID does not exist', async () => {
        const response = await chai.request(server).get(`/reminders/32323`)
        response.should.have.status(404);
        response.text.should.eql('ID not found');
    })


    it('should get 405 for a put request to /reminders/:id', async () => {
        const [reminder] = await setup(user_2_2);
        const response = await chai.request(server).put(`/reminders/${reminder.id}`).send(reminder)
        response.should.have.status(405);
    })

    it('should get 405 for a patch request to /reminders/:id', async () => {
        const [reminder] = await setup(user_2_2);
        const response = await chai.request(server).patch(`/reminders/${reminder.id}`).send(reminder)
        response.should.have.status(405);
    })

    it('should get 405 for a delete request to /reminders/:id', async () => {
        const [reminder] = await setup(user_2_2);
        const response = await chai.request(server).delete(`/reminders/${reminder.id}`)
        response.should.have.status(405);
    })
});
