var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// display books page
router.get('/', function(req, res, next) {

    dbConn.query('SELECT * FROM items ORDER BY itemid desc',function(err,rows)     {

        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('items',{data:''});
        } else {
            // render to views/books/index.ejs
            res.render('items',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {
    // render to add.ejs
    res.render('items/add', {
        itemid: '',
        itemname: '',
        stock: '',
        category: '',
        costprice: '',
        sellingprice: '',
        sellingpricegst: '',
        gst: ''
    })
})

// add a new book
router.post('/add', function(req, res, next) {

    let itemid = req.body.itemid;
    let itemname = req.body.itemname;
    let stock = req.body.stock;
    let category = req.body.category;
    let costprice = req.body.costprice;
    let sellingprice = req.body.sellingprice;
    let sellingpricegst = req.body.sellingpricegst;
    let gst = req.body.gst;
    let errors = false;

    if(itemid.length === 0 || itemname.length === 0 || stock.length === 0 || category.length === 0 || costprice.length === 0 || sellingprice.length === 0 || sellingpricegst.length === 0 || gst.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please fill all the fields");
        // render to add.ejs with flash message
        res.render('items/add', {
          itemid: itemid,
          itemname: itemname,
          stock: stock,
          category: category,
          costprice: costprice,
          sellingprice: sellingprice,
          sellingpricegst: sellingpricegst,
          gst: gst
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
          itemid: itemid,
          itemname: itemname,
          stock: stock,
          category: category,
          costprice: costprice,
          sellingprice: sellingprice,
          sellingpricegst: sellingpricegst,
          gst: gst
        }

        // insert query
        dbConn.query('INSERT INTO items SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('items/add', {
                    itemid: form_data.itemid,
                    itemname: form_data.itemname,
                    stock: form_data.stock,
                    category: form_data.category,
                    costprice: form_data.costprice,
                    sellingprice: form_data.sellingprice,
                    sellingpricegst: form_data.sellingpricegst,
                    gst: form_data.gst
                })
            } else {
                req.flash('success', 'Item successfully added');
                res.redirect('/items');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:itemid)', function(req, res, next) {

    let itemid = req.params.itemid;

    dbConn.query('SELECT * FROM items WHERE itemid = ' + itemid, function(err, rows, fields) {
        if(err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Item not found with item ID = ' + itemid)
            res.redirect('/items')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('items/edit', {
                title: 'Edit Item',
                itemid: rows[0].itemid,
                itemname: rows[0].itemname,
                stock: rows[0].stock,
                category: rows[0].category,
                costprice: rows[0].costprice,
                sellingprice: rows[0].sellingprice,
                sellingpricegst: rows[0].sellingpricegst,
                gst: rows[0].gst
            })
        }
    })
})

// update book data
router.post('/update/:itemid', function(req, res, next) {

    let itemid = req.params.itemid;
    let itemname = req.body.itemname;
    let stock = req.body.stock;
    let category = req.body.category;
    let costprice = req.body.costprice;
    let sellingprice = req.body.sellingprice;
    let sellingpricegst = req.body.sellingpricegst;
    let gst = req.body.gst;
    let errors = false;

    if(itemid.length === 0 || itemname.length === 0 || stock.length === 0 || category.length === 0 || costprice.length === 0 || sellingprice.length === 0 || sellingpricegst.length === 0 || gst.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('items/edit', {
            itemid: req.params.itemid,
            itemname: itemname,
            stock: stock,
            category: category,
            costprice: costprice,
            sellingprice: sellingprice,
            sellingpricegst: sellingpricegst,
            gst: gst
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
          itemid: itemid,
          itemname: itemname,
          stock: stock,
          category: category,
          costprice: costprice,
          sellingprice: sellingprice,
          sellingpricegst: sellingpricegst,
          gst: gst
        }
        // update query
        dbConn.query('UPDATE items SET ? WHERE itemid = ' + itemid, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('items/edit', {
                    itemid: req.params.itemid,
                    itemname: form_data.itemname,
                    stock: form_data.stock,
                    category: form_data.category,
                    costprice: form_data.costprice,
                    sellingprice: form_data.sellingprice,
                    sellingpricegst: form_data.sellingpricegst,
                    gst: form_data.gst
                })
            } else {
                req.flash('success', 'Item successfully updated');
                res.redirect('/items');
            }
        })
    }
})

// delete book
router.get('/delete/(:itemid)', function(req, res, next) {

    let itemid = req.params.itemid;

    dbConn.query('DELETE FROM items WHERE itemid = ' + itemid, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/items')
        } else {
            // set flash message
            req.flash('success', 'Item successfully deleted! ID = ' + itemid)
            // redirect to books page
            res.redirect('/items')
        }
    })
})

// display add biiling items page
router.get('/billing', function(req, res, next) {
    // render to billing.ejs
    res.render('items/billing', {
        productname: '',
        unit: '',
        sellingpricebill: '',
        amount: ''
    })
})

// add a new book
router.post('/billing', function(req, res, next) {

    let productname = req.body.productname;
    let unit = req.body.unit;
    let sellingpricebill = req.body.sellingpricebill;
    let amount = req.body.amount;
    let errors = false;

    console.log(productname);
    console.log(unit);
    console.log(sellingpricebill);
    console.log(amount);

    if(productname.length === 0 || unit.length === 0 || sellingpricebill.length === 0 || amount.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please fill all the fields");
        // render to add.ejs with flash message
        res.render('items/billing', {
          productname: productname,
          unit: unit,
          sellingpricebill: sellingpricebill,
          amount: amount
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
          productname: productname,
          unit: unit,
          sellingpricebill: sellingpricebill,
          amount: amount
        }

        // insert query
        dbConn.query('INSERT INTO billing SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('items/billing', {
                    productname: form_data.productname,
                    unit: form_data.unit,
                    sellingpricebill: form_data.sellingpricebill,
                    amount: form_data.amount
                })
            } else {
                req.flash('success', 'Bill successfully added');
                res.redirect('/billing');
            }
        })
    }
})

module.exports = router;
