# E-wallet Backend
## About 
A backend program for Boo-Wallet E-wallet

## CRUD database for:
- users
- profile
- transaction
- type transaction
- auth
- authenticated

### note:
- some endpoint not working because adjustment for auth and authenticated
- change serviceAccount on `./src/helpers/firebaseNotif.js` with your own firebase json, without that this backend won't running
- file postman at folder postman collection 


## Build with
- [Node js](https://nodejs.org)
- [Express js](https://expressjs.com/)


## How to run app?
1. Clone this project to your local computer
2. Import boowallet.tar to your local postgresql database (before use database, you can clean data first. because i don't know how to backup without data :rofl:)
3. Create .env file and fill the data like in .env.example
4. Install required package with command `npm i`
5. Run the app with `npm run dev`

## Main EndPoint (auth and authenticated)

| url        | Method           | Description  |
| ------------- |:-------------:| -----:|
| /auth/registerNew      | POST | Register new users |
| /auth/resetPassword      | POST | Reset password |
| /auth/setTokenNotif      | POST | Set token if device(mobile) have new token(if doesn't exist) |
| /auth/createPin      | POST | Create new pin for new user |
| /auth/login      | POST | Login user |
| /auth/removeUserFromToken      | PATCH | Remove id user from table notification when user logout |
| /authenticated/joinUserAndProfile      | GET | Get data user login |
| /authenticated/joinTransactionsJoin      | GET | Get history transaction user |
| /authenticated/joinTNotificationJoin      | GET | Get notifications user |
| /authenticated/getAllNotif      | GET | Get all notifications user  |
| /authenticated/countNotifications      | GET | Get count notifications user |
| /authenticated/getAllUsersMk      | GET | Get all other user |
| /authenticated/getUserById/:user_id      | GET | Get user by id |
| /authenticated/phone      | POST | Add Phone number |
| /authenticated/transfer      | POST | Transfer balance to other user |
| /authenticated/topup      | POST | Top up user login |
| /authenticated/deletePicture      | PATCH | Delete picture user login |
| /authenticated/readNotification/:id      | PATCH | Read notification by id  |
| /authenticated/readAllNotifs      | PATCH | Read all notification |
| /authenticated/profile      | PATCH | update profile user |
| /authenticated/profileName      | PATCH | Update first name and last name |
| /authenticated/changePassword      | PATCH | Change password user login |
| /authenticated/changePin      | PATCH | Change pin user login |
| /authenticated/phone      | PATCH | Change phone number user login |

