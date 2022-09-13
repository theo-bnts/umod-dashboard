export default function handler(req, res) {
  setTimeout(() => {
    res
      .status(200)
      .json({
        "timestamp": new Date().getTime(),
        "result": true,
        "data": [
          {
            "id": 1,
            "name": "Guild 1",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=1",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Administrator"
              }
            }
          },
          {
            "id": 2,
            "name": "Another guild",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=2",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Moderator"
              }
            }
          },
          {
            "id": 3,
            "name": "Guild 3",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=3",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Administrator"
              }
            }
          },
          {
            "id": 4,
            "name": "Guild 4",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=4",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Administrator"
              }
            }
          },
          {
            "id": 5,
            "name": "Another guild",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=5",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Administrator"
              }
            }
          },
          {
            "id": 6,
            "name": "Also another guild",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=6",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Moderator"
              }
            }
          },
          {
            "id": 7,
            "name": "Guild 7",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=7",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Administrator"
              }
            }
          },
          {
            "id": 8,
            "name": "Guild 8",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=8",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Administrator"
              }
            }
          },
          {
            "id": 9,
            "name": "Guild 9",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=9",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Administrator"
              }
            }
          },
          {
            "id": 10,
            "name": "Guild 10",
            "icon": "https://api.lorem.space/image/drink?w=256&h=256&random=10",
            "user": {
              "role": {
                "name": "admin",
                "display_name": "Administrator"
              }
            }
          }
        ]
    })
  }, 1000)
}
