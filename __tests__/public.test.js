const request = require('supertest')
const { app } = require('../app')
const { User, Category, Cuisine } = require('../models')
const fs = require('fs');

beforeAll(async () => {
    await User.create({
        username: "kaka",
        email: "kaka@gmail.com",
        password: "12345",
        phoneNumber: "08120484",
        address: "brazil"
    })

    await User.create({
        username: "ronaldo",
        email: "ronaldo@gmail.com",
        password: "12345",
        phoneNumber: "08120484",
        address: "portugal"
    })

    await User.create({
        username: "admin",
        email: "admin@gmail.com",
        password: "12345",
        phoneNumber: "08120484",
        address: "portugal",
        role: "Admin"
    })

    await User.create({
        username: "admin2",
        email: "admin2@gmail.com",
        password: "12345",
        phoneNumber: "08120484",
        address: "Singapore",
        role: "Admin"
    })

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

describe('GET /pub/cuisines', () => {
    test('SUCCESS GET CUISINES WITHOUT FILTER', async () => {
        const response = await request(app)
            .get('/pub/cuisines')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', "Successfully Received Data")
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Array)
    })

    test('SUCCESS USE FILTER', async () => {
        const response = await request(app)
            .get('/pub/cuisines?filter[categoryId]=2')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', "Successfully Received Data")
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Array)
        expect(response.body.data[0]).toHaveProperty('categoryId', 2)
    })

    test('SUCCESS USE PAGINATION', async () => {
        const response = await request(app)
            .get('/pub/cuisines?page[size]=5&page[number]=2')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', "Successfully Received Data")
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Array)
        expect(response.body.data.length).toEqual(5)
        expect(response.body.data[0].id).toEqual(6) // halaman ke 2 dimulai dari id 6 - id 10
        expect(response.body.data[4].id).toEqual(10) // halaman ke 2 berisi 5 data. *tergantung query size*
    })
})

describe('GET /pub/cuisines/:id', () => {
    test('SUCCESS GET A CUISINE BY ID', async () => {
        const response = await request(app)
            .get('/pub/cuisines/1')
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toMatchObject({
            id: 1,
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            imgUrl: expect.any(String),
            categoryId: expect.any(Number),
            authorId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    })

    test('NOT FOUND A CUISINE WITH THAT ID', async () => {
        const response = await request(app)
            .get(`/pub/cuisines/100`)
        expect(response.status).toBe(404)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Error! not found')
    })
})