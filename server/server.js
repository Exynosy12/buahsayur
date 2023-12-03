const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express()
var port = process.env.PORT || 3000;

let products = [];
let orders = [];
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("API deployment successful");
});

// Konfigurasi Duitku
const merchantCode = 'DS17453';
const merchantKey = '0b5182cc15e4774f6af74c0c6c5f759c';

app.post('/create-invoice', async (req, res) => {
    const timestamp = Date.now().toString();
    const signature = crypto.createHash('sha256').update(merchantCode + timestamp + merchantKey).digest('hex');

  const data = {
        paymentAmount: 40000,
        merchantOrderId: timestamp.toString(), // unique ID dari merchant
        productDetails: 'Test Pay with duitku',
        email: 'test@test.com', // email pelanggan
        phoneNumber: '08123456789', // nomor telepon pelanggan
        additionalParam: '',
        merchantUserInfo: '',
        customerVaName: 'John Doe', // nama pelanggan pada konfirmasi bank
        callbackUrl: 'http://example.com/api-pop/backend/callback.php', // URL untuk callback
        returnUrl: 'http://example.com/api-pop/backend/redirect.php', // URL untuk redirect
        expiryPeriod: 10, // waktu kedaluwarsa dalam menit
        customerDetail: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@test.com',
            phoneNumber: '08123456789',
            billingAddress: {
                firstName: 'John',
                lastName: 'Doe',
                address: 'Jl. Kembangan Raya',
                city: 'Jakarta',
                postalCode: '11530',
                phone: '08123456789',
                countryCode: 'ID'
            },
            shippingAddress: {
                // Sama dengan billing address atau sesuaikan
            }
        },
        itemDetails: [
            { name: 'Test Item 1', price: 10000, quantity: 1 },
            { name: 'Test Item 2', price: 30000, quantity: 1 }
        ],
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-duitku-signature': signature,
            'x-duitku-timestamp': timestamp,
            'x-duitku-merchantcode': merchantCode
        }
    };

    try {
        const response = await axios.post('https://api-sandbox.duitku.com/api/merchant/createinvoice', data, config);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.post('/product', (req, res) => {
    const product = req.body;

    // output the product to the console for debugging
    console.log(product);
    products.push(product);

    res.send('Product is added to the database');
});

app.get('/product', (req, res) => {
    res.json(products);
});

app.get('/product/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;

    // searching products for the id
    for (let product of products) {
        if (product.id === id) {
            res.json(product);
            return;
        }
    }

    // sending 404 when not found something is a good practice
    res.status(404).send('Product not found');
});

app.delete('/product/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;

    // remove item from the products array
    products = products.filter(i => {
        if (i.id !== id) {
            return true;
        }

        return false;
    });

    // sending 404 when not found something is a good practice
    res.send('Product is deleted');
});

app.post('/product/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;
    const newProduct = req.body;

    // remove item from the products array
    for (let i = 0; i < products.length; i++) {
        let product = products[i]

        if (product.id === id) {
            products[i] = newProduct;
        }
    }

    // sending 404 when not found something is a good practice
    res.send('Product is edited');
});

app.post('/checkout', (req, res) => {
    const order = req.body;

    // output the product to the console for debugging
    orders.push(order);

    res.redirect(302, 'https://assettracker.cf');
});

app.get('/checkout', (req, res) => {
    res.json(orders);

});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
