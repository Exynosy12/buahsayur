var InitialCount = -1;



const deleteProducts = async() => {
    url = 'https://buahsayursultan.onrender.com/product';

    let res = await axios.get(url);
    responseText = res.data;
    const products = responseText;

    for (let product of products) {
        const response = await axios.delete(`https://buahsayursultan.onrender.com/product/${product.id}`)

    }
    location.reload();
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

const loadProducts = async() => {
    url = 'https://buahsayursultan.onrender.com/product';

    let res = await axios.get(url);
    responseText = await res.data;
    const products = responseText;
    var len = products.length;

    if (len > InitialCount + 1) {
        $("#1").css("display", "none");
        $("#home").css("display", "grid");
        $("#2").css("display", "grid");
        var payable = 0;
        const products = responseText;
        console.log(products);
        for (let product of products) {
            payable = payable + parseFloat(product.payable);

        }

        var product = products.pop();
        const x = `
        <section>
                <div class="card card-long animated fadeInUp once">
                    <img src="asset/img/${product.id}.jpg" class="album">
                    <div class="span1">Product Name</div>
                    <div class="card__product">
                        <span>${product.name}</span>
                    </div>
                    <div class="span2">Per Unit</div>
                    <div class="card__price">
                        <span>${product.price} </span>
                    </div>
                    <div class="span3">Units</div>
                    <div class="card__unit">
                        <span>${product.taken} ${product.unit}</span>
                    </div>

                    <div class="span4">Payable</div>
                    <div class="card__amount">
                        <span>${product.payable}</span>
                    </div>
                </div>
            </section>
        <section>
        `

        document.getElementById('home').innerHTML = document.getElementById('home').innerHTML + x;
        document.getElementById('2').innerHTML = "CHECKOUT $" + payable;
        InitialCount += 1;
    }


}

var checkoutAction = async() => {
  try {
    url = 'https://buahsayursultan.onrender.com/create-invoice';
    let res = await axios.post(url);
    responseText = await res.data;

    // Masukkan data respons ke dalam variabel dan lanjutkan dengan proses checkout
    checkout.process(responseText.reference, {
      defaultLanguage: "id", //opsional pengaturan bahasa
      successEvent: function(result) {
        // Tambahkan fungsi sesuai kebutuhan anda
        console.log('success');
        console.log(result);
        alert('Payment Success');
        
        deleteProducts();
      },
      pendingEvent: function(result) {
        // Tambahkan fungsi sesuai kebutuhan anda
        console.log('pending');
        console.log(result);
        alert('Payment Pending');
        
        deleteProducts();
      },
      // Tambahkan event lainnya sesuai dengan yang sudah kamu definisikan
    });

  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }

        

    // window.location.href = "upi://pay?pa=shebinjosejacob2014@oksbi&pn=TXN9656549238&tn=A&am=1&cu=INR&url=https://assettracker.cf/"*/
   
}
