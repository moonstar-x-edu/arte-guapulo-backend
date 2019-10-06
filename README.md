# Arte Guapulo Backend

This is a backend for the Arte Guapulo project for Ser y Cosmos, it serves the gallery images and its metadata.

## GET

GET routes available:

### /piece/meta

Get metadata of all the pieces.

#### Request

```
GET $API_URL$/api/piece/meta
```

#### Response

```
{
    "status": 200,
    "success": true,
    "data": {
        "quantity": 3,
        "ids": [
            "123",
            "234",
            "456",
            "987"
        ]
    }
}
```

### /piece/:id

Get data of a particular piece.

#### Request

```
GET $API_URL$/api/piece/:id
```

> PARAM `id`: ID of the piece to get.

#### Response

```
{
    "status": 200,
    "success": true,
    "data": {
        "image": "http://site.tld/image.jpg",
        "coordinates": {
            "latitude": 0,
            "longitude": 70
        },
        "authors": [
            {
                "instagram": null,
                "twitter": null,
                "facebook": "facebook.handle"
            }
        ],
        "id": "123",
        "tags": [
            "hello",
            "tag2"
        ]
    }
}
```

### /piece/all

Get data on all pieces.

#### Request

```
GET $API_URL$/api/piece/all
```

#### Response

```
{
    "status": 200,
    "success": true,
    "data": [
        {
            "image": "http://site.tld/image.jpg",
            "coordinates": {
                "latitude": 0,
                "longitude": 70
            },
            "authors": [
                {
                    "instagram": null,
                    "twitter": null,
                    "facebook": "facebook.handle"
                }
            ],
            "id": "123",
            "tags": [
                "hello",
                "tag2"
            ]
        },
        {
            "image": "http://site.tld/image.png",
            "coordinates": {
                "latitude": 10,
                "longitude": 20
            },
            "authors": [
                {
                    "instagram": "instagram.handle",
                    "twitter": null,
                    "facebook": "facebook.handle"
                }
            ],
            "id": "234",
            "tags": [
                "tag1",
                "tag2",
                "tag3",
                "tag4"
            ]
        },
    ]
}
```

## POST

POST routes available:

### /piece/create

Create a new piece.
Send the piece data in the request body.

#### Request

```
POST $API_URL$/api/piece/create
```

> Required body: **application/json**.

**Example Body**:

```
{
    "image": "http://site.tld/image.png",
    "coordinates": {
        "latitude": 10,
        "longitude": 20
    },
    "authors": [
        {
            "instagram": "instagram.handle",
            "twitter": null,
            "facebook": "facebook.handle"
        }
    ],
    "id": "234",
    "tags": [
        "tag1",
        "tag2",
        "tag3",
        "tag4"
    ]
}
```

#### Response

```
{
    "status": 201,
    "success": true,
    "data": {
        "writeTime": 0.800,
        "document": {
            "image": "http://site.tld/image.png",
            "coordinates": {
                "latitude": 10,
                "longitude": 20
            },
            "authors": [
                {
                    "instagram": "instagram.handle",
                    "twitter": null,
                    "facebook": "facebook.handle"
                }
            ],
            "id": "234",
            "tags": [
                "tag1",
                "tag2",
                "tag3",
                "tag4"
            ]
        }
    }
}
```

## PUT

PUT routes available:

### /piece/update/:id

Update a particular piece with only the data that needs to be updated.
Use `object.property` as a property of the body to replace only that sub-property.
Arrays need to be complete if they're updated.

#### Request

```
PUT $API_URL$/api/piece/update/:id
```

> PARAM `id`: ID of the piece to update.

> Required body: **application/json**.

**Example Body**:

```
{
    "image": "http://newurl.tld/newimage.jpg",
    "coordinates.latitude": 10,
    "coordinates.longitude": 20,
    "authors": [
        {
            "facebook": "new.fb.handle",
            "instagram": null,
            "twitter": "old.tw.handle"
        }
    ]
}
```



#### Response

```
{
    "status": 200,
    "success": true,
    "data": {
        "writeTime": 0.3,
        "updated": {
            "image": "http://newurl.tld/newimage.jpg",
            "coordinates": {
                "latitude": 10,
                "longitude": 20
            },
            "authors": [
                {
                    "facebook": "new.fb.handle",
                    "instagram": null,
                    "twitter": "old.tw.handle"
                }
            ],
            "tags": [
                "oldtag1",
                "oldtag2"
            ],
            "id": "123123123"
        }
    }
}
```

## DELETE

DELETE routes available:

### /piece/delete/:id

Delete a particular piece.

#### Request

```
DELETE $API_URL$/api/piece/delete/:id
```

> PARAM `id`: ID of the piece to delete.

#### Response

```
{
    "status": 200,
    "success": true,
    "data": {
        "writeTime": 0.4
    }
}
```

## Author

This API was made by [moonstar-x](https://github.com/moonstar-x).
