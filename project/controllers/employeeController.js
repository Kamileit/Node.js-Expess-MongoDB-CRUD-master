const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
var Handlebars = require('handlebars');
router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

/* Handlebars.registerHelper ("setChecked", function (value, currentValue) {
    if ( value == currentValue ) {
       return "Checked";
    } else {
       return "";
    }
 }); */


function insertRecord(req, res) {
    var employee = new Employee();
    employee.equipment = req.body.equipment;
    employee.warranty = req.body.warranty;
    employee.release = req.body.release;
    employee.cost = req.body.cost;
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    }).lean();
}


router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
});

router.all('/match', (req, res) => {
    console.log(req.body.mode)

    let $search = this.search;

    var equipment=req.body.equipment;
    var element=req.body.element;
    
    var limit=1;
    
    console.log(limit)
    console.log(element)

    if (req.body.mode == 'on') {
        var order = 1
    }
    else {
        var order = -1
    }

    if (req.body.limit == '1') {
        var limit = 1
    }
    else if (req.body.limit == '10'){
        var limit = 10
    }
    else if (req.body.limit == '30'){
        var limit = 30
    }
    else if (req.body.limit == '50'){
        var limit = 50
    }
    
    Employee.aggregate( [{
        '$match': {
            'equipment':equipment
        }},
        {'$sort': {
            'fullName': order
        }}, 
        {'$limit': limit
        }

    ],(err, docs) => {
        if (!err) {
            res.render("employee/search", {
                list: docs
            });
            
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
    
    
});




function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    }).lean();
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    }).lean();
});





module.exports = router;