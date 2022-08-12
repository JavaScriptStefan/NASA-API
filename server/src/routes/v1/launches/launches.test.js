const request = require('supertest');
const app = require('../../../app');
const { connectToMongo, disconnectFromMongo } = require('../../../services/mongo');

describe("/v1/Launches tests", () => {
    beforeAll(async () => {
        await connectToMongo();
    });

    afterAll(async () => {
        await disconnectFromMongo();
    });

    describe("GET /v1/launches", () => {
        test("It should respond with 200 success and content-type must be json", async () => {
            await request(app).get("/v1/launches").expect("Content-Type", /json/).expect(200);        
        });
    });
    
    describe("POST /v1/launches", () => {
        const requestBody = {
            "mission" : "Kepler Exploration Y",
            "rocket" : "Explorer IS7",
            "launchDate" : "January 11, 2039",
            "target" : "Earth"
        };
    
        const responseNoLaunchDate = {
            "mission" : "Kepler Exploration Y",
            "rocket" : "Explorer IS7",        
            "target" : "Earth"
        };
    
        const responseInvalidLaunchDate = {
            "mission" : "Kepler Exploration Y",
            "rocket" : "Explorer IS7",        
            "target" : "Earth",
            "launchDate" : "...",
        };
    
        test("It should respond with 201", async () => {
            const response = await request(app).post("/v1/launches").send(requestBody).expect(201);
            // console.log(response.body);
            expect(response.body).toMatchObject(responseNoLaunchDate);
        });
    
        test("It should catch missing required fields", async () => {
            const { body, statusCode } = await request(app).post('/v1/launches').expect(400);
            console.log({ body, statusCode });
            expect(body).toHaveProperty('error', 'Missing required field(s)')
        });
    
        test("It should catch invalid dates", async () => {
            const { body, statusCode } = await request(app).post("/v1/launches").send(responseInvalidLaunchDate).expect(400);
            expect(body).toHaveProperty("error", 'Invalid date format');
            console.log({ body, statusCode });
        });
    });
});