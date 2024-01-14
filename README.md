# (Server Side)

## Deployment : https://pizzahot-api.faisalyudiansah.site

## Endpoints :

List of available endpoints for Staff and Admin :
- `POST /add-user`
- `POST /login`
- `POST /cuisines`
- `GET /cuisines`
    - search by name of cuisines : `GET /cuisines?search=<string>`
    - sort by created date : `GET /cuisines?sort=old` OR `GET /cuisines?sort=new`
    - filter by category id : `GET /cuisines?filter[categoryId]=<integer>`
    - pagination : `/cuisines?page[size]=<integer>&page[number]=<integer>`
        - size : how many data will you get (default 10 data per page)
        - number : get page
- `GET /cuisines/:id`
- `PUT /cuisines/:id`
- `DELETE /cuisines/:id`
- `POST /categories`
- `GET /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`


List of available endpoints for Public :
- `GET /pub/cuisines`
    - search by name of cuisines : `GET /pub/cuisines?search=<string>`
    - sort by created date : `GET /pub/cuisines?sort=old` OR `GET /pub/cuisines/sort=new`
    - filter by category id : `GET /pub/cuisines?filter[categoryId]=<integer>`
    - pagination : `/pub/cuisines?page[size]=<integer>&page[number]=<integer>`
        - size : how many data will you get (default 10 data per page)
        - number : get page
- `GET /pub/cuisines/:id`

&nbsp;

## POST /add-user
Description:
- Add user (role "Admin" only). Default value for role : 'Staff'

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- body:
```json
{
    "username": "string",
    "email": "string (required)",
    "password": "string (required)",
    "phoneNumber": "string",
    "address": "string",
}
```

_Response (201 - Created)_

```json
{
    "id": 20,
    "username": "kaka",
    "email": "kaka@gmail.com"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "email is Required"
}
OR
{
  "message": "password is Required"
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "Forbidden Access. Admin Only"
}
```

&nbsp;

## POST /login
Description:
- login account user with username or email

Request:
- body:

```json
{
    "username": "string",
    "password": "string",
}
OR
{
    "email": "string",
    "password": "string",
}
```

_Response (200 - OK)_

```json
{
    "access_token": "string",
    "username": "string",
    "email": "string",
    "role": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "username or email is required"
}
OR
{
  "message": "password is Required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "invalid username or email or password!"
}
```

&nbsp;

## POST /cuisines
Description:
- Create a cuisine. "authorId" will be automatically input depending on the user ID who creates the data.

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- body:
```json
{
    "name": "string (required)",
    "description": "string (required)",
    "price": "integer (required)",
    "imgUrl": "string (required)",
    "categoryId": "integer (required)"
}
```

_Response (201 - Created)_

```json
{
    "id": 16,
    "name": "Tuna Melt",
    "description": "Tuna, Jagung, Onion, Saus Mayonnaise, dan Keju Mozzarella.",
    "price": 53000,
    "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pizza/tuna-melt.png",
    "categoryId": 3,
    "authorId": 4,
    "updatedAt": "2023-11-28T04:56:51.794Z",
    "createdAt": "2023-11-28T04:56:51.794Z"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "name is Required"
}
OR
{
  "message": "description is Required"
}
OR
{
  "message": "price is Required"
}
OR
{
  "message": "The minimum price is Rp 20.000"
}
OR
{
  "message": "imgUrl is Required"
}
OR
{
  "message": "categoryId is Required"
}
OR
{
  "message": "authorId is Required"
}
```

&nbsp;

## GET /cuisines
Description:
- GET all cuisines with a limit of 10 data per page

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 1,
            "name": "Meat Lover",
            "description": "Sosis Sapi, Daging Sapi Cincang, Burger Sapi, Sosis Ayam, dan Keju Mozzarella.",
            "price": 48000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pizza/meat-lovers.png",
            "categoryId": 1,
            "authorId": 4,
            "createdAt": "2023-11-27T16:05:08.506Z",
            "updatedAt": "2023-11-27T16:05:08.506Z",
            "User": {
                "id": 4,
                "username": "admin2",
                "email": "admin2@gmail.com",
                "role": "Admin",
                "phoneNumber": "5549027168",
                "address": "3 Mcguire Alley",
                "createdAt": "2023-11-27T16:05:08.461Z",
                "updatedAt": "2023-11-27T16:05:08.461Z"
            }
        },
        {
            "id": 2,
            "name": "Beef Spaghetti",
            "description": "Pasta Spaghetti, Daging Sapi Cincang, Saus Tomat, dan Keju.",
            "price": 43000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/beef-spaghetti.png",
            "categoryId": 2,
            "authorId": 3,
            "createdAt": "2023-11-27T16:05:08.506Z",
            "updatedAt": "2023-11-27T16:05:08.506Z",
            "User": {
                "id": 3,
                "username": "faisal",
                "email": "mfaisal@gmail.com",
                "role": "Staff",
                "phoneNumber": "6671719721",
                "address": "775 Bunker Hill Terrace",
                "createdAt": "2023-11-27T16:05:08.461Z",
                "updatedAt": "2023-11-27T16:05:08.461Z"
            }
        },
        ...,
    ]
}
```

&nbsp;

## (SEARCH) GET /cuisines?search=< string >
Description:
- search cuisine by name

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- query:
```json
{
    "search": "string (required)"
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 12,
            "name": "Winter Punch",
            "description": "Buah Leci, Nata De Coco, Biji Selasih, Sirup Leci, dan Lemon Tea",
            "price": 26000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/drinks/winter-punch.png",
            "categoryId": 4,
            "authorId": 3,
            "createdAt": "2023-11-29T15:18:57.533Z",
            "updatedAt": "2023-11-29T15:18:57.533Z",
            "User": {
                "id": 3,
                "username": "faisal",
                "email": "mfaisal@gmail.com",
                "role": "Staff",
                "phoneNumber": "6671719721",
                "address": "775 Bunker Hill Terrace",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        {
            "id": 15,
            "name": "Tropical Punch",
            "description": "Potongan Buah Peach, Nata de Coco, Semangka, Biji Selasih, Sirup Mangga, dan Lemon Tea.",
            "price": 21000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/drinks/tropical-punch.png",
            "categoryId": 4,
            "authorId": 1,
            "createdAt": "2023-11-29T15:19:00.533Z",
            "updatedAt": "2023-11-29T15:19:00.533Z",
            "User": {
                "id": 1,
                "username": "admin1",
                "email": "admin1@gmail.com",
                "role": "Admin",
                "phoneNumber": "083175216860",
                "address": "882 Lotheville Street",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        }
    ]
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "invalid value!"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## (SORT) GET /cuisines?sort=old OR GET /cuisines?sort=new
Description:
- sort by created date

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- query:
```json
{
    "sort": "old"
}
OR
{
    "sort": "new"
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 20,
            "name": "Lychee Breeze",
            "description": "Buah Leci, Sirup Leci, Soda, dan Jeruk Nipis",
            "price": 20000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/drinks/lychee-breeze.png",
            "categoryId": 4,
            "authorId": 4,
            "createdAt": "2023-11-29T15:19:05.533Z",
            "updatedAt": "2023-11-29T15:19:05.533Z",
            "User": {
                "id": 4,
                "username": "admin2",
                "email": "admin2@gmail.com",
                "role": "Admin",
                "phoneNumber": "5549027168",
                "address": "3 Mcguire Alley",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        {
            "id": 19,
            "name": "Flaming Hot Chicken",
            "description": "Pasta Fettuccine, Ayam, Sosis Ayam, Minyak Cabe, dan Daun Bawang",
            "price": 55000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/flaming-hot.png",
            "categoryId": 2,
            "authorId": 1,
            "createdAt": "2023-11-29T15:19:04.533Z",
            "updatedAt": "2023-11-29T15:19:04.533Z",
            "User": {
                "id": 1,
                "username": "admin1",
                "email": "admin1@gmail.com",
                "role": "Admin",
                "phoneNumber": "083175216860",
                "address": "882 Lotheville Street",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        ...,
    ]
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "invalid value!"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## (FILTER) GET /cuisines?filter[categoryId]=< integer >
Description:
- filter by category id

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- query:
```json
{
    "filter": {
        "categoryId" : "integer (required)"
    }
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 4,
            "name": "Salmon Aglio Olio",
            "description": "Pasta Spaghetti, Cabai, Paprika Hijau, Bawang Putih dengan Salmon Panggang",
            "price": 43000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/salmon-aglio-olio.png",
            "categoryId": 2,
            "authorId": 4,
            "createdAt": "2023-11-29T15:18:49.533Z",
            "updatedAt": "2023-11-29T15:18:49.533Z",
            "User": {
                "id": 4,
                "username": "admin2",
                "email": "admin2@gmail.com",
                "role": "Admin",
                "phoneNumber": "5549027168",
                "address": "3 Mcguire Alley",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        {
            "id": 5,
            "name": "Beef Spaghetti",
            "description": "Pasta Spaghetti, Daging Sapi Cincang, Saus Tomat, dan Keju.",
            "price": 43000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/beef-spaghetti.png",
            "categoryId": 2,
            "authorId": 3,
            "createdAt": "2023-11-29T15:18:50.533Z",
            "updatedAt": "2023-11-29T15:18:50.533Z",
            "User": {
                "id": 3,
                "username": "faisal",
                "email": "mfaisal@gmail.com",
                "role": "Staff",
                "phoneNumber": "6671719721",
                "address": "775 Bunker Hill Terrace",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        ...,
    ]
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "invalid value!"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## (PAGINATION) GET /cuisines?page[size]=< integer >&page[number]=< integer >
Description:
- size : how many data will you get (default 10)
- number : get page

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- query:
```json
{
    "page" : {
        "size" : "integer (required)",
        "number" : "integer (required)",
    }
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 6,
            "name": "Cheese Overload",
            "description": "Keju Mozzarella, String Chees, Cream Cheese Mayo, Keju Permesan, dan White Cheese",
            "price": 49000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pizza/cheese-overload.png",
            "categoryId": 1,
            "authorId": 4,
            "createdAt": "2023-11-29T15:18:51.533Z",
            "updatedAt": "2023-11-29T15:18:51.533Z",
            "User": {
                "id": 4,
                "username": "admin2",
                "email": "admin2@gmail.com",
                "role": "Admin",
                "phoneNumber": "5549027168",
                "address": "3 Mcguire Alley",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        {
            "id": 7,
            "name": "Green Chili Calamari",
            "description": "Nasi Cabe Hijau dengan potongan tuna, cumi/udang renyah, dan sayuran",
            "price": 32000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Green-Chili-Calamari.png",
            "categoryId": 3,
            "authorId": 2,
            "createdAt": "2023-11-29T15:18:52.533Z",
            "updatedAt": "2023-11-29T15:18:52.533Z",
            "User": {
                "id": 2,
                "username": "ronaldo",
                "email": "ronaldo@gmail.com",
                "role": "Staff",
                "phoneNumber": "1746053976",
                "address": "65 Kensington Place",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        ...,
    ]
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "invalid value!"
}
```

&nbsp;

## GET /cuisines/:id
Description:
- GET a cuisine by id

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
    "id": 4,
    "name": "Tropical Punch",
    "description": "Potongan Buah Peach, Nata de Coco, Semangka, Biji Selasih, Sirup Mangga, dan Lemon Tea.",
    "price": 21000,
    "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/drinks/tropical-punch.png",
    "categoryId": 4,
    "authorId": 1,
    "createdAt": "2023-11-27T16:05:08.506Z",
    "updatedAt": "2023-11-27T16:05:08.506Z"
}
```
_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## PUT /cuisines/:id
Description:
- Update/edit a cuisine by id. Role 'Staff' can only edit/update their own.

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "id": "integer (required)"
}
```


- body:

```json
{
    "name": "string (required)",
    "description": "string (required)",
    "price": "integer (required)",
    "imgUrl": "string (required)",
    "categoryId": "integer (required)",
    "authorId": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
    "id": 12,
    "name": "Veggie Garden",
    "description": "Jagung, Jamur, Paprika Merah, Paprika Hijau, Nanas, dan Keju Mozzarella",
    "price": 44000,
    "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pizza/veggie-garden.png",
    "categoryId": 1,
    "authorId": 3,
    "createdAt": "2023-11-28T04:21:26.541Z",
    "updatedAt": "2023-11-28T05:22:45.376Z"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "name is Required"
}
OR
{
  "message": "description is Required"
}
OR
{
  "message": "price is Required"
}
OR
{
  "message": "The minimum price is Rp 20.000"
}
OR
{
  "message": "imgUrl is Required"
}
OR
{
  "message": "categoryId is Required"
}
OR
{
  "message": "authorId is Required"
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "Forbidden Access. Staff can only edit or delete their own."
}
```

_Response (404 - Not Found)_

```json
{
    "message": "Error! not found"
}
```

&nbsp;

## PATCH /cuisines/:id/img-url
Description:
- Update/edit image URL by id. Role 'Staff' can only edit/update their own.

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "id": "integer (required)"
}
```


- body:

```json
{
    "imgUrl": "image file (file.png/jpg/webp)",
}
```

_Response (200 - OK)_

```json
{
    "message": "Image tuna-melt.jpg success to update"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "upload the file first."
}
OR
{
    "message": "imgUrl is Required"
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "Forbidden Access. Staff can only edit or delete their own."
}
```

_Response (404 - Not Found)_

```json
{
    "message": "Error! not found"
}
```

&nbsp;

## DELETE /cuisines/:id

Description:
- Delete a cuisine by id. Role 'Staff' can only delete their own.

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "id": "integer (required)"
}
```

_Response (200 - OK)_
```json
{
    "message": "Mozarellos Success to delete"
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "Forbidden Access. Staff can only edit or delete their own."
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## POST /categories
Description:
- Create a category

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- body:
```json
{
    "name": "string (required)"
}
```

_Response (201 - Created)_

```json
{
    "id": 10,
    "name": "Appetizer",
    "updatedAt": "2023-11-28T05:46:43.437Z",
    "createdAt": "2023-11-28T05:46:43.437Z"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "name is Required"
}
```

&nbsp;

## GET /categories
Description:
- GET all categories

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 1,
            "name": "Pizza",
            "createdAt": "2023-11-27T16:05:08.494Z",
            "updatedAt": "2023-11-27T16:05:08.494Z"
        },
        {
            "id": 2,
            "name": "Pasta",
            "createdAt": "2023-11-27T16:05:08.494Z",
            "updatedAt": "2023-11-27T16:05:08.494Z"
        },
        ...,
    ]
}
```

&nbsp;

## PUT /categories/:id
Description:
- Update/edit a category by id

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "id": "integer (required)"
}
```

- body:

```json
{
    "name": "string (required)"
}
```

_Response (200 - OK)_

```json
{
    "id": 7,
    "name": "Milkshake",
    "createdAt": "2023-11-28T03:49:07.887Z",
    "updatedAt": "2023-11-28T05:51:59.120Z"
}
```

_Response (400 - Bad Request)_

```json
{
    "message": "name is Required"
}
```

_Response (404 - Not Found)_

```json
{
    "message": "Error! not found"
}
```

&nbsp;

## DELETE /categories/:id

Description:
- Delete a category by id

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
    "message": "Soda Success to delete"
}
```

_Response (404 - Not Found)_

```json
{
    "message": "Error! not found"
}
```

&nbsp;

## GET /pub/cuisines
Description:
- GET all cuisines for public site with a limit of 10 data per page


_Response (200 - OK)_

```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 1,
            "name": "Meat Lover",
            "description": "Sosis Sapi, Daging Sapi Cincang, Burger Sapi, Sosis Ayam, dan Keju Mozzarella.",
            "price": 48000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pizza/meat-lovers.png",
            "categoryId": 1,
            "authorId": 4,
            "createdAt": "2023-11-27T16:05:08.506Z",
            "updatedAt": "2023-11-27T16:05:08.506Z"
        },
        {
            "id": 2,
            "name": "Beef Spaghetti",
            "description": "Pasta Spaghetti, Daging Sapi Cincang, Saus Tomat, dan Keju.",
            "price": 43000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/beef-spaghetti.png",
            "categoryId": 2,
            "authorId": 3,
            "createdAt": "2023-11-27T16:05:08.506Z",
            "updatedAt": "2023-11-27T16:05:08.506Z"
        },
        ...,
    ]
}
```

&nbsp;

## (SEARCH) GET /pub/cuisines?search=< string >
Description:
- search cuisine by name

Request:

- query:
```json
{
    "search": "string (required)"
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 12,
            "name": "Winter Punch",
            "description": "Buah Leci, Nata De Coco, Biji Selasih, Sirup Leci, dan Lemon Tea",
            "price": 26000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/drinks/winter-punch.png",
            "categoryId": 4,
            "authorId": 3,
            "createdAt": "2023-11-29T15:18:57.533Z",
            "updatedAt": "2023-11-29T15:18:57.533Z",
            "User": {
                "id": 3,
                "username": "faisal",
                "email": "mfaisal@gmail.com",
                "role": "Staff",
                "phoneNumber": "6671719721",
                "address": "775 Bunker Hill Terrace",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        {
            "id": 15,
            "name": "Tropical Punch",
            "description": "Potongan Buah Peach, Nata de Coco, Semangka, Biji Selasih, Sirup Mangga, dan Lemon Tea.",
            "price": 21000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/drinks/tropical-punch.png",
            "categoryId": 4,
            "authorId": 1,
            "createdAt": "2023-11-29T15:19:00.533Z",
            "updatedAt": "2023-11-29T15:19:00.533Z",
            "User": {
                "id": 1,
                "username": "admin1",
                "email": "admin1@gmail.com",
                "role": "Admin",
                "phoneNumber": "083175216860",
                "address": "882 Lotheville Street",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        }
    ]
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "invalid value!"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## (SORT) GET /pub/cuisines?sort=old OR GET /pub/cuisines?sort=new
Description:
- sort by created date

Request:

- query:
```json
{
    "sort": "old"
}
OR
{
    "sort": "new"
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 20,
            "name": "Lychee Breeze",
            "description": "Buah Leci, Sirup Leci, Soda, dan Jeruk Nipis",
            "price": 20000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/drinks/lychee-breeze.png",
            "categoryId": 4,
            "authorId": 4,
            "createdAt": "2023-11-29T15:19:05.533Z",
            "updatedAt": "2023-11-29T15:19:05.533Z",
            "User": {
                "id": 4,
                "username": "admin2",
                "email": "admin2@gmail.com",
                "role": "Admin",
                "phoneNumber": "5549027168",
                "address": "3 Mcguire Alley",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        {
            "id": 19,
            "name": "Flaming Hot Chicken",
            "description": "Pasta Fettuccine, Ayam, Sosis Ayam, Minyak Cabe, dan Daun Bawang",
            "price": 55000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/flaming-hot.png",
            "categoryId": 2,
            "authorId": 1,
            "createdAt": "2023-11-29T15:19:04.533Z",
            "updatedAt": "2023-11-29T15:19:04.533Z",
            "User": {
                "id": 1,
                "username": "admin1",
                "email": "admin1@gmail.com",
                "role": "Admin",
                "phoneNumber": "083175216860",
                "address": "882 Lotheville Street",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        ...,
    ]
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "invalid value!"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## (FILTER) GET /pub/cuisines?filter[categoryId]=< integer >
Description:
- filter by category id

Request:

- query:
```json
{
    "filter": {
        "categoryId" : "integer (required)"
    }
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 4,
            "name": "Salmon Aglio Olio",
            "description": "Pasta Spaghetti, Cabai, Paprika Hijau, Bawang Putih dengan Salmon Panggang",
            "price": 43000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/salmon-aglio-olio.png",
            "categoryId": 2,
            "authorId": 4,
            "createdAt": "2023-11-29T15:18:49.533Z",
            "updatedAt": "2023-11-29T15:18:49.533Z",
            "User": {
                "id": 4,
                "username": "admin2",
                "email": "admin2@gmail.com",
                "role": "Admin",
                "phoneNumber": "5549027168",
                "address": "3 Mcguire Alley",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        {
            "id": 5,
            "name": "Beef Spaghetti",
            "description": "Pasta Spaghetti, Daging Sapi Cincang, Saus Tomat, dan Keju.",
            "price": 43000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/beef-spaghetti.png",
            "categoryId": 2,
            "authorId": 3,
            "createdAt": "2023-11-29T15:18:50.533Z",
            "updatedAt": "2023-11-29T15:18:50.533Z",
            "User": {
                "id": 3,
                "username": "faisal",
                "email": "mfaisal@gmail.com",
                "role": "Staff",
                "phoneNumber": "6671719721",
                "address": "775 Bunker Hill Terrace",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        ...,
    ]
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "invalid value!"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## (PAGINATION) GET /pub/cuisines?page[size]=< integer >&page[number]=< integer >
Description:
- size : how many data will you get (default 10)
- number : get page

Request:

- query:
```json
{
    "page" : {
        "size" : "integer (required)",
        "number" : "integer (required)",
    }
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully Received Data",
    "data": [
        {
            "id": 6,
            "name": "Cheese Overload",
            "description": "Keju Mozzarella, String Chees, Cream Cheese Mayo, Keju Permesan, dan White Cheese",
            "price": 49000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pizza/cheese-overload.png",
            "categoryId": 1,
            "authorId": 4,
            "createdAt": "2023-11-29T15:18:51.533Z",
            "updatedAt": "2023-11-29T15:18:51.533Z",
            "User": {
                "id": 4,
                "username": "admin2",
                "email": "admin2@gmail.com",
                "role": "Admin",
                "phoneNumber": "5549027168",
                "address": "3 Mcguire Alley",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        {
            "id": 7,
            "name": "Green Chili Calamari",
            "description": "Nasi Cabe Hijau dengan potongan tuna, cumi/udang renyah, dan sayuran",
            "price": 32000,
            "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/pasta-rice/Green-Chili-Calamari.png",
            "categoryId": 3,
            "authorId": 2,
            "createdAt": "2023-11-29T15:18:52.533Z",
            "updatedAt": "2023-11-29T15:18:52.533Z",
            "User": {
                "id": 2,
                "username": "ronaldo",
                "email": "ronaldo@gmail.com",
                "role": "Staff",
                "phoneNumber": "1746053976",
                "address": "65 Kensington Place",
                "createdAt": "2023-11-29T15:18:46.501Z",
                "updatedAt": "2023-11-29T15:18:46.501Z"
            }
        },
        ...,
    ]
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "invalid value!"
}
```

&nbsp;

## GET /pub/cuisines/:id
Description:
- GET a cuisine by id for public site


Request:

- params:

```json
{
    "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
    "id": 4,
    "name": "Tropical Punch",
    "description": "Potongan Buah Peach, Nata de Coco, Semangka, Biji Selasih, Sirup Mangga, dan Lemon Tea.",
    "price": 21000,
    "imgUrl": "https://www.pizzahut.co.id/assets/images/digital_menu/phr/menu/drinks/tropical-punch.png",
    "categoryId": 4,
    "authorId": 1,
    "createdAt": "2023-11-27T16:05:08.506Z",
    "updatedAt": "2023-11-27T16:05:08.506Z"
}
```
_Response (404 - Not Found)_

```json
{
    "message": "Error! not found"
}
```

&nbsp;


## Global Error
_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```