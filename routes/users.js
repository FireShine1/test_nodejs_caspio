import CaspioHelper from '../helpers/caspio';
var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    const token = await CaspioHelper.getAccessToken();
    const rows = await CaspioHelper.getAll('tables', 'Users_ES', '', token);
    res.status(200).render('users', { title: 'Users', users: rows });
});

router.post('/', async function (req, res, next) {
    const token = await CaspioHelper.getAccessToken();
    /*const { firstName, lastName, dateOfBirth, country, city, zipCode, address } = req.body;
    const user = {
        'firstName': firstName,
        'LastName': lastName,
        'DateOfBirth': dateOfBirth,
        'Country': country,
        'City': city,
        'ZipCode': zipCode,
        'Address': address,
    };*/
    //In case req.body contains exact data that needs to be inserted into database,
    //we can pass it directly, but in case we need to remove or add some data from/to
    //req.body, the above code can be useful
    const createdUser = await CaspioHelper.post('tables', 'Users_ES', req.body, token);
    res.status(201).send(JSON.stringify(createdUser));
});

router.put('/:id', async function (req, res, next) {
    const token = await CaspioHelper.getAccessToken();
    let userId = req.params.id;
    const oldUser = await CaspioHelper.get('tables', 'Users_ES', `q.where=UserID='${userId}'`, token);
    if (oldUser && oldUser.length > 0) {
        const newUser = await CaspioHelper.put('tables', 'Users_ES', `q.where=UserID='${userId}'`, req.body, token);
        res.status(200).send(JSON.stringify(newUser));
    } else {
        res.status(404).send('There is no such user');
    }
});

router.delete('/:id', async function (req, res, next) {
    const token = await CaspioHelper.getAccessToken();
    let userId = req.params.id;
    const oldUser = await CaspioHelper.get('tables', 'Users_ES', `q.where=UserID='${userId}'`, token);
    if (oldUser && oldUser.length > 0) {
        const deletedUser = await CaspioHelper.deleteRows('tables', 'Users_ES', `q.where=UserID='${userId}'`, token);
        res.status(200).send(JSON.stringify(deletedUser));
    } else {
        res.status(404).send('There is no such user');
    }
});

module.exports = router;
