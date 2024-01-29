var InitialCount = -1;

const sandbox = false;

const baseUrl = sandbox ? "http://127.0.0.1:3000" : "https://buahsayursultan.onrender.com";

const deleteProducts = async () => {
    url = baseUrl + '/product';

    let res = await axios.get(url);
    responseText = res.data;
    const products = responseText;

    for (let product of products) {
        const response = await axios.delete(`${baseUrl}/product/${product.id}`)

    }
    location.reload();
    window.scroll({
        top: 0, left: 0, behavior: 'smooth'
    });
}

// Initialize a Set to keep track of displayed product IDs
const displayedProductIds = new Set();
let totalPayable = 0;

const loadProducts = async () => {
    const url = baseUrl + '/product';

    let res = await axios.get(url);
    const responseText = await res.data;
    const products = [...responseText]; // Create a copy of the array

    var len = products.length;

    if (len > InitialCount + 1) {
        $("#1").css("display", "none");
        $("#home").css("display", "grid");
        $("#2").css("display", "grid");

        console.log(products);

        for (let product of products) {
            // Check if product ID is already displayed
            if (!displayedProductIds.has(product.id)) {
                const x = `
                    <section>
                        <div class="card card-long animated fadeInUp once">
                            <img src="asset/img/${product.id}.jpg" class="album">
                            <div class="span1">Nama Produk</div>
                            <div class="card__product">
                                <span>${product.name}</span>
                            </div>
                            <div class="span2">Harga /KG</div>
                            <div class="card__price">
                                <span>${product.price} </span>
                            </div>
                            <div class="span3">Berat</div>
                            <div class="card__unit">
                                <span>${product.taken} ${product.unit}</span>
                            </div>

                            <div class="span4">Total Harga</div>
                            <div class="card__amount">
                                <span>${product.payable}</span>
                            </div>
                        </div>
                    </section>
                `;

                document.getElementById('home').innerHTML = document.getElementById('home').innerHTML + x;

                // Add the displayed product ID to the Set
                displayedProductIds.add(product.id);

                // Accumulate total payable
                totalPayable += parseFloat(product.payable);
            }
        }

        document.getElementById('2').innerHTML = "BAYAR Rp" + totalPayable;
        InitialCount += 1;
    }
}

var checkoutAction = async () => {
    url = baseUrl + '/product';

    let res = await axios.get(url);
    let responseText = await res.data;
    const products = responseText;
    var payable = 0;
    let items = [];
    for (let product of products) {
        payable = payable + parseFloat(product.payable);
        items.push({
            id: parseInt(product.id),
            name: (product.unit != "KG") ? product.name : product.name + " " + parseFloat(product.taken) + " KG",
            price: parseInt(product.price),
            unit: (product.unit != "KG") ? parseInt(product.unit) : 1,
            taken: parseInt(product.taken),
            payable: parseInt(product.payable)
        });
    }

    try {
        url = baseUrl + '/create-invoice';
        let postData = {
            total: payable,
            items: items,
        };
        console.log(postData);

        
        let res = await axios.post(url, postData);
        responseText = await res.data;
        // Masukkan data respons ke dalam variabel dan lanjutkan dengan proses checkout
        checkout.process(responseText.reference, {
            defaultLanguage: "id", //opsional pengaturan bahasa
            successEvent: function (result) {
                // Tambahkan fungsi sesuai kebutuhan anda
                console.log('success');
                console.log(result);
                $('#success').css('display', 'grid');
                setTimeout(function () {
                    deleteProducts();
                }, 4500);
            }, pendingEvent: function (result) {
                // Tambahkan fungsi sesuai kebutuhan anda
                console.log('pending');
                console.log(result);
            },
            errorEvent: function (result) {
                // tambahkan fungsi sesuai kebutuhan anda
                console.log('error');
                console.log(result);
            },
            closeEvent: function (result) {
                // tambahkan fungsi sesuai kebutuhan anda
                console.log('customer closed the popup without finishing the payment');
                console.log(result);
            }
        });

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }


    // window.location.href = "upi://pay?pa=shebinjosejacob2014@oksbi&pn=TXN9656549238&tn=A&am=1&cu=INR&url=https://assettracker.cf/"*/

}
