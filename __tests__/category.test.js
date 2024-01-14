const request = require('supertest')
const { app } = require('../app')
const { User, Category, Cuisine } = require('../models')
const { signToken } = require('../helpers/jwt')
const fs = require('fs');

let accessTokenUser1
let accessTokenUser2
let accessTokenAdmin
let accessTokenAdmin2
beforeAll(async () => {
    let user1 = await User.create({
        username: "kaka",
        email: "kaka@gmail.com",
        password: "12345",
        phoneNumber: "08120484",
        address: "brazil"
    })
    accessTokenUser1 = signToken(user1)

    let user2 = await User.create({
        username: "ronaldo",
        email: "ronaldo@gmail.com",
        password: "12345",
        phoneNumber: "08120484",
        address: "portugal"
    })
    accessTokenUser2 = signToken(user2)

    let user3 = await User.create({
        username: "admin",
        email: "admin@gmail.com",
        password: "12345",
        phoneNumber: "08120484",
        address: "portugal",
        role: "Admin"
    })
    accessTokenAdmin = signToken(user3)

    let user4 = await User.create({
        username: "admin2",
        email: "admin2@gmail.com",
        password: "12345",
        phoneNumber: "08120484",
        address: "Singapore",
        role: "Admin"
    })
    accessTokenAdmin2 = signToken(user4)


    await Category.create({
        name: 'Pizza'
    })
    await Category.create({
        name: 'Pasta'
    })
    await Category.create({
        name: 'Rice'
    })
    await Category.create({
        name: 'Drink'
    })

    JSON.parse(fs.readFileSync('./data/cuisines.json', 'utf-8')).map(async (el, i) => {
        let timestamp = new Date().getTime() + i * 1000
        el.createdAt = el.updatedAt = new Date(timestamp)
        await Cuisine.create(el)
    })
})

afterAll(async () => {
    await User.destroy({
        truncate: true,
        restartIdentity: true,
        cascade: true
    })
    await Category.destroy({
        truncate: true,
        restartIdentity: true,
        cascade: true
    })
    await Cuisine.destroy({
        truncate: true,
        restartIdentity: true,
        cascade: true
    })
})

describe('GET /categories', () => {
    test('SUCCESS GET DATA CATEGORIES', async () => {
        const response = await request(app)
            .get('/categories')
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', "Successfully Received Data")
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Array)
    })

    test('WITHOUT LOGIN', async () => {
        const response = await request(app)
            .get('/categories')
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', "Invalid token")
    })

    test('ACCESS TOKEN INVALID', async () => {
        const response = await request(app)
            .get('/categories')
            .set('Authorization', `Bearer WRONG ACCESS TOKEN`)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', "Invalid token")
    })
})

describe('CUD /categories', () => {
    test('ADD CATEGORY', async () => {
        let dataBody = {
            name: 'Bubur'
        }
        const response = await request(app)
            .post('/categories')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(201)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            name: 'Bubur',
            updatedAt: expect.any(String),
            createdAt: expect.any(String)
        })
    })

    test('UPDATE CATEGORY', async () => {
        let dataBody = {
            name: 'Bukan bubur lagi'
        }
        const response = await request(app)
            .put('/categories/5')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            name: 'Bukan bubur lagi',
            updatedAt: expect.any(String),
            createdAt: expect.any(String)
        })
    })

    test('DELETE CATEGORY', async () => {
        const response = await request(app)
            .delete('/categories/5')
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Bukan bubur lagi Success to delete")
    })
})

