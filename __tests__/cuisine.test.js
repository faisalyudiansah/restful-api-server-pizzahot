const request = require('supertest')
const { app } = require('../app')
const { User, Category, Cuisine } = require('../models')
const { signToken } = require('../helpers/jwt')
const path = require('path')
const fs = require('fs')

let accessTokenUser1
let accessTokenUser2
let accessTokenAdmin
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

    await Cuisine.create({
        name: "Cheese Lava",
        description: "Pasta Fusilli, Pepperoni Sapi, Saus Keju Cheddar, Beef Bits dengan Saus Cheese Fondue",
        price: 43000,
        imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Cheese-Lava.png",
        categoryId: 1,
        authorId: 1
    })

    await Cuisine.create({
        name: "Martabak Pizza",
        description: "Pizza yang diolah menjadi martabak",
        price: 45000,
        imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/pizza.png",
        categoryId: 1,
        authorId: 1
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

//=========================================================================================

describe('POST /login', () => {
    test('SUCCESS LOGIN', async () => {
        let dataBody = {
            email: "admin@gmail.com",
            password: "12345"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('access_token', expect.any(String))
        expect(response.body).toHaveProperty('username', expect.any(String))
        expect(response.body).toHaveProperty('email', dataBody.email)
        expect(response.body).toHaveProperty('role', expect.any(String))
    })

    test('WITHOUT EMAIL', async () => {
        let dataBody = {
            password: "12345"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "username or email is required")
    })

    test('WITHOUT PASSWORD', async () => {
        let dataBody = {
            email: "admin@gmail.com"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "password is required")
    })

    test('EMAIL INVALID / NOT REGISTERED', async () => {
        let dataBody = {
            email: "random@gmail.com",
            password: "12345"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', "invalid username or email or password!")
    })

    test('WRONG PASSWORD', async () => {
        let dataBody = {
            email: "ronaldo@gmail.com",
            password: "WRONG PASSWORD"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', "invalid username or email or password!")
    })
})

//=========================================================================================

describe('POST /add-user', () => {
    test('SUCCESS ADD USER BY ADMIN', async () => {
        let dataBody = {
            username: "messi",
            email: "messi@gmail.com",
            password: "12345",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id', expect.any(Number))
        expect(response.body).toHaveProperty('username', dataBody.username)
        expect(response.body).toHaveProperty('email', dataBody.email)
    })

    test('WITHOUT EMAIL', async () => {
        let dataBody = {
            username: "messi",
            password: "12345",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "email is Required")
    })

    test('WITHOUT PASSWORD', async () => {
        let dataBody = {
            username: "messi",
            email: "messi@gmail.com",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "password is Required")
    })

    test('EMAIL EMPTY STRING', async () => {
        let dataBody = {
            username: "messi",
            email: "",
            password: "12345",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "email is Required")
    })

    test('PASSWORD EMPTY STRING', async () => {
        let dataBody = {
            username: "messi",
            email: "messi@gmail.com",
            password: "",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "password is Required")
    })

    test('EMAIL ALREADY EXISTS', async () => {
        let dataBody = {
            username: "messi",
            email: "kaka@gmail.com",
            password: "12345",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "email already exists")
    })

    test('EMAIL FORMAT INVALID', async () => {
        let dataBody = {
            username: "messi",
            email: "FORMAT EMAIL SALAH",
            password: "12345",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "email format is wrong")
    })

    test('PASSWORD LENGTH IS LESS THAN 5 CHARACTERS', async () => {
        let dataBody = {
            username: "messi",
            email: "messi@gmail.com",
            password: "1",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "the minimum password length is 5 characters")
    })

    test('WITHOUT ACCESS TOKEN', async () => {
        let dataBody = {
            username: "messi",
            email: "messi@gmail.com",
            password: "12345",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', "Invalid token")
    })

    test('ACCESS TOKEN INVALID', async () => {
        let dataBody = {
            username: "messi",
            email: "messi@gmail.com",
            password: "12345",
            phoneNumber: "08120484",
            address: "argentina"
        }
        const response = await request(app)
            .post('/add-user')
            .send(dataBody)
            .set('Authorization', `Bearer WRONG ACCESS TOKEN`)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', "Invalid token")
    })
})

//=========================================================================================

describe('POST /cuisines', () => {
    test('SUCCESS CREATE A CUISINE', async () => {
        let dataBody = {
            name: "Pepperoni",
            description: "Pepperoni Sapi dan Keju Mozzarella",
            price: 52000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pizza/pepperoni.png",
            categoryId: 1
        }
        const response = await request(app)
            .post('/cuisines')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('name', dataBody.name)
        expect(response.body).toHaveProperty('description', dataBody.description)
        expect(response.body).toHaveProperty('price', dataBody.price)
        expect(response.body).toHaveProperty('imgUrl', dataBody.imgUrl)
        expect(response.body).toHaveProperty('categoryId', dataBody.categoryId)
    })

    test('USER WAS NOT LOGGED IN', async () => {
        let dataBody = {
            name: "Pepperoni",
            description: "Pepperoni Sapi dan Keju Mozzarella",
            price: 52000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pizza/pepperoni.png",
            categoryId: 1
        }
        const response = await request(app)
            .post('/cuisines')
            .send(dataBody)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        let dataBody = {
            name: "Pepperoni",
            description: "Pepperoni Sapi dan Keju Mozzarella",
            price: 52000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pizza/pepperoni.png",
            categoryId: 1
        }
        const response = await request(app)
            .post('/cuisines')
            .send(dataBody)
            .set('Authorization', `WRONG TOKEN`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID REQ BODY', async () => {
        let dataBody = {
            description: "",
            price: 100,
            imgUrl: "",
        }
        const response = await request(app)
            .post('/cuisines')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(400)
        expect(response.body.message).toEqual('name is Required')   // check validasi nama saja cukup
    })
})

//=========================================================================================

describe('GET /cuisines', () => {
    test('SUCCESS GET DATA CUISINES', async () => {
        const response = await request(app)
            .get('/cuisines')
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', "Successfully Received Data")
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Array)
        expect(response.body.data[0]).toHaveProperty('id')
        expect(response.body.data[0]).toHaveProperty('name')
        expect(response.body.data[0]).toHaveProperty('categoryId')
        expect(response.body.data[0]).toHaveProperty('authorId')
        expect(response.body.data[0]).toHaveProperty('User')
        expect(response.body.data[0]).toBeInstanceOf(Object)
        expect(response.body.data[0].User).toBeInstanceOf(Object)
        expect(response.body.data[0].User).toHaveProperty('id')
        expect(response.body.data[0].User).toHaveProperty('username')
        expect(response.body.data[0].User).toHaveProperty('email')
        expect(response.body.data[0].User).toHaveProperty('role')
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .get('/cuisines')
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .get('/cuisines')
            .set('Authorization', `WRONG TOKEN`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

//=========================================================================================

describe('GET /cuisines/:id', () => {
    test('SUCCESS GET DATA CUISINE BY ID', async () => {
        const response = await request(app)
            .get(`/cuisines/1`)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toMatchObject({
            id: 1,
            name: "Cheese Lava",
            description: "Pasta Fusilli, Pepperoni Sapi, Saus Keju Cheddar, Beef Bits dengan Saus Cheese Fondue",
            price: 43000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Cheese-Lava.png",
            categoryId: 1,
            authorId: 1,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .get(`/cuisines/1`)
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .get(`/cuisines/1`)
            .set('Authorization', `WRONG TOKEN`)
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT FOUND A DATA WITH THAT ID', async () => {
        const response = await request(app)
            .get(`/cuisines/100`)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(404)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Error! not found')
    })
})

//=========================================================================================

describe('PUT /cuisines/:id', () => {
    test('SUCCESS EDIT DATA CUISINE BY ID', async () => {
        let dataEdit = {
            name: "Bakso Nasi",
            description: "Deskripsi untuk Bakso dan Nasi",
            price: 50000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Cheese-Lava.png",
            categoryId: 1,
            authorId: 1
        }
        const response = await request(app)
            .put(`/cuisines/1`)
            .send(dataEdit)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toMatchObject({
            id: 1,
            name: "Bakso Nasi",
            description: "Deskripsi untuk Bakso dan Nasi",
            price: 50000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Cheese-Lava.png",
            categoryId: 1,
            authorId: 1,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    })

    test('USER WAS NOT LOGGED IN', async () => {
        let dataEdit = {
            name: "Pempek Panggang",
            description: "Deskripsi untuk Pempek dan di Panggang",
            price: 20000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Cheese-Lava.png",
            categoryId: 1,
            authorId: 1
        }
        const response = await request(app)
            .put(`/cuisines/1`)
            .send(dataEdit)
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        let dataEdit = {
            name: "Pempek Panggang",
            description: "Deskripsi untuk Pempek dan di Panggang",
            price: 20000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Cheese-Lava.png",
            categoryId: 1,
            authorId: 1
        }
        const response = await request(app)
            .put(`/cuisines/1`)
            .send(dataEdit)
            .set('Authorization', `WRONG TOKEN`)
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT FOUND A DATA WITH THAT ID', async () => {
        let dataEdit = {
            name: "Pempek Panggang",
            description: "Deskripsi untuk Pempek dan di Panggang",
            price: 20000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Cheese-Lava.png",
            categoryId: 1,
            authorId: 1
        }
        const response = await request(app)
            .put(`/cuisines/123`)
            .send(dataEdit)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(404)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Error! not found')
    })

    test('STAFF CAN ONLY EDIT OR DELETE THEIR OWN', async () => {
        let dataEdit = {
            name: "Pempek Panggang",
            description: "Deskripsi untuk Pempek dan di Panggang",
            price: 20000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Cheese-Lava.png",
            categoryId: 1,
            authorId: 1
        }
        const response = await request(app)
            .put(`/cuisines/1`)
            .send(dataEdit)
            .set('Authorization', `Bearer ${accessTokenUser2}`)
        expect(response.status).toBe(403)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Forbidden Access. Staff can only edit or delete their own.')
    })

    test('INVALID REQ BODY', async () => {
        let dataEdit = {
            name: "",
            description: "Deskripsi untuk Pempek dan di Panggang",
            price: 20000,
            imgUrl: "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Cheese-Lava.png",
            categoryId: 1,
            authorId: 1
        }
        const response = await request(app)
            .put(`/cuisines/1`)
            .send(dataEdit)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('name is Required')
    })
})

//=========================================================================================

describe('DELETE /cuisines/:id', () => {
    test('SUCCESS DELETE DATA CUISINE BY ID', async () => {
        const response = await request(app)
            .delete(`/cuisines/2`)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual(`Martabak Pizza Success to delete`)
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .delete(`/cuisines/1`)
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .delete(`/cuisines/1`)
            .set('Authorization', `WRONG TOKEN`)
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT FOUND A DATA WITH THAT ID', async () => {
        const response = await request(app)
            .delete(`/cuisines/123`)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(404)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Error! not found')
    })

    test('STAFF CAN ONLY EDIT OR DELETE THEIR OWN', async () => {
        const response = await request(app)
            .delete(`/cuisines/1`)
            .set('Authorization', `Bearer ${accessTokenUser2}`)
        expect(response.status).toBe(403)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.message).toEqual('Forbidden Access. Staff can only edit or delete their own.')
    })
})

//=========================================================================================

describe("PATCH /cuisines/:id/img-url", () => {
    const filePath = path.resolve(__dirname, "./assets/tuna-melt.jpg")
    const imageBuffer = fs.readFileSync(filePath)
    test("STORE imageUrl TO CLOUDINARY AND UPDATE IMAGE", async () => {
        let response = await request(app)
            .patch("/cuisines/1/img-url")
            .set('Authorization', `Bearer ${accessTokenUser1}`)
            .attach("imgUrl", imageBuffer, "tuna-melt.jpg")
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message')
    })

    test("NOT LOGIN", async () => {
        let response = await request(app)
            .patch("/cuisines/1/img-url")
            .attach("imgUrl", imageBuffer, "tuna-melt.jpg")
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Invalid token")
    })

    test("TOKEN NOT VALID", async () => {
        let response = await request(app)
            .patch("/cuisines/1/img-url")
            .set('Authorization', `Bearer WRONG TOKEN`)
            .attach("imgUrl", imageBuffer, "tuna-melt.jpg")
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Invalid token")
    })

    test("ID OF CUISINE NOT FOUND", async () => {
        let response = await request(app)
            .patch("/cuisines/100/img-url")
            .set('Authorization', `Bearer ${accessTokenUser1}`)
            .attach("imgUrl", imageBuffer, "tuna-melt.jpg")
        expect(response.status).toBe(404)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Error! not found")
    })

    test("STAFF CAN ONLY EDIT OR DELETE THEIR OWN", async () => {
        let response = await request(app)
            .patch("/cuisines/1/img-url")
            .set('Authorization', `Bearer ${accessTokenUser2}`)
            .attach("imgUrl", imageBuffer, "tuna-melt.jpg")
        expect(response.status).toBe(403)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Forbidden Access. Staff can only edit or delete their own.")
    })

    test("REQ BODY NOT VALID", async () => {
        let response = await request(app)
            .patch("/cuisines/1/img-url")
            .set('Authorization', `Bearer ${accessTokenUser1}`)
            .attach("imgUrl", "")
        expect(response.status).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', 'upload the file first.')
    })
})
