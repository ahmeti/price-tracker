const priceTrackerAmazon = {

    start: function()
    {
        priceTracker.market = 'amazon';

        priceTrackerAmazon.checkAmazonOpen().then(function () {

            priceTracker.emptyHtml().then(function () {

                // INIT - FIRST TIME
                moment.locale('tr');
                priceTracker.loading(false);
                priceTracker.submitSettings();
                priceTrackerAmazon.submitItem();
                priceTrackerAmazon.clickDeleteItem();

                // $.notify('Eklenti çalışıyor...', {type: 'success'});

                // TEST TEST TEST TEST TEST TEST
                /*priceTracker.getStorageLocal('amazon_items').then(function(currItems){

                    let updatedItems = _.filter(currItems, function(currItem) {

                        if(currItem.code === 'B07RP2KRM9'){

                            currItem.old_price = 2200;
                            currItem.new_price = 2200;
                            currItem.last_update = moment().format('YYYY-MM-DD HH:mm:ss');

                            return currItem;

                        }else{
                            return currItem;
                        }

                    });

                    priceTracker.setStorageLocal('amazon_items', updatedItems).then(function () {

                        // Storage Local Updated

                    });

                });*/
                // TEST TEST TEST TEST TEST TEST


                priceTracker.checkApiKey().then(function () {

                    priceTrackerAmazon.setProductTable();

                    // priceTracker.removeStorageLocal('amazon_items');

                    priceTracker.getStorageLocal('amazon_items').then(function (items) {

                        // console.log(items);

                        if( ! Array.isArray(items) ){
                            // Hiç ürün yok!
                            return false;
                        }

                        // First Inıt Table
                        $.each(items, function(index, item) {

                            let rowNr = $('#price-tracker tr').length;
                            let lastUpdate = moment(item.last_update, 'YYYY-MM-DD HH:mm:ss').format('DD.MM.YYYY / HH:mm:ss');
                            let oldPrice = priceTracker.numberFormat(item.old_price, 2, ',', '.') + ' TL';
                            let newPrice = priceTracker.numberFormat(item.new_price, 2, ',', '.') + ' TL';
                            let lastUpdateHuman = moment(item.last_update, 'YYYY-MM-DD HH:mm:ss').fromNow();

                            let newTr = `
                            <tr id="${ item.code }">
                                <td class="pt-delete"><a class="pt-delete-item" href="javascript:void(0)">Sil</a></td>
                                <td class="pt-index">${ rowNr }</td>
                                <td class="pt-code">${ item.code }</td>
                                <td class="pt-title"><a target="_blank" href="${ item.url }">${ item.name }</a></td>
                                <td class="pt-price">${ oldPrice }</td>
                                <td class="pt-waiting-price">${ newPrice }</td>
                                <td class="pt-last-update">${ lastUpdate }</td>
                                <td class="pt-last-update-human">${ lastUpdateHuman }</td>
                            </tr>
                            `;

                            $('#price-tracker tr:last').after(newTr);

                        });

                        setTimeout(function () {

                            priceTracker.remainingCounter();

                            priceTracker.getStorageLocal('interval').then(function (interval) {

                                if( ! interval ){

                                    eachInterval = (3 * 60) * 1000;

                                } else if( interval >= 3 && interval <= 10 ){

                                    eachInterval = (interval * 60) * 1000 ;

                                }else{
                                    eachInterval = (3 * 60) * 1000;
                                }

                                // TEST
                                // eachInterval = (0.2 * 60) * 1000;

                                // console.log('SET INTERVAL: ' + ((eachInterval / 60) / 1000) + ' sn');

                                setInterval(function () {

                                    // console.log('SET INTERVAL ÇALIŞTI...' + moment().format('DD.MM.YYYY / HH:mm:ss'));

                                    priceTrackerAmazon.eachItems();

                                }, eachInterval);

                            });

                        }, 3000);

                    });

                }, function () {

                    // Api Key Fail
                    return Swal.fire({
                        title: 'API Anahtarı Geçersiz!',
                        text: 'Lütfen API anatharınızı kontrol ediniz.',
                        type: 'error',
                        confirmButtonText: 'Tamam'
                    });
                });

            });
        });
    },

    // 1
    checkAmazonOpen: function () {
        return new Promise(function(resolve, reject){
            priceTracker.getStorageLocal('open_amazon').then(function (data) {
                if( data !== 1 ){
                    reject(false);
                }else{
                    priceTracker.setStorageLocal('open_amazon', 0).then(function () {
                        resolve(true);
                    })
                }
            });
        });
    },

    // 2
    setProductTable: function(){
        $('#app').append(`
        <div id="pt-new-item" class="panel panel-default">
            <div class="panel-heading">
                <strong>Yeni Ürün Ekle</strong>
            </div>
            <div class="panel-body">
                
                <form onsubmit="return false;">
                  
                    <div class="row">
                    
                        <div class="col-sm-4">
                            <div class="form-group form-group-sm">
                                <label>ASIN Kodu</label>
                                <input type="text" class="form-control pt-new-code" maxlength="10" placeholder="Amazon ASIN kodunu yazınız.">
                            </div>    
                        </div>
                        
                        <div class="col-sm-4">
                            <div class="form-group form-group-sm">
                                <label>&nbsp;</label>
                                <button type="submit" class="btn btn-sm btn-success btn-block pt-submit-item">Kaydet</button>
                            </div>    
                        </div>
                        
                    </div>
        
                </form>
                
            </div>
        </div>
        
        
        <div id="pt-settings" class="panel panel-default">
            <div class="panel-heading">
                <strong>Ürünler</strong> - Yeniden Kontrol: <strong><span id="remainingCounter" class="text-danger">0</span></strong> saniye sonra...
            </div>
            <div class="panel-body">
                <div class="table-responsive">
                    <table id="price-tracker" class="table table-bordered table-condensed" style="font-size: 12px">
                        <tr>
                            <th>Sil</th>
                            <th>Sıra</th>
                            <th>Ürün Kodu</th>
                            <th>Ürün</th>
                            <th>Önceki Fiyat</th>
                            <th>Güncel Fiyat</th>
                            <th>Son Güncelleme</th>
                            <th>Son Güncelleme</th>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        `);
    },

    // 3
    submitItem: function ()
    {
        $(document).on("click", ".pt-submit-item", function() {

            priceTracker.loading(true);

            let code = $.trim($('.pt-new-code').val() + '');

            if(code.length !== 10){

                priceTracker.loading(false);

                return Swal.fire({
                    text: 'Hatalı ürün kodu girdiniz.',
                    type: 'error',
                    confirmButtonText: 'Tamam'
                });
            }

            priceTracker.getStorageLocal('amazon_items').then(function (items) {

                if( ! Array.isArray(items) ){
                    items = [];
                }

                let checkExists = _.filter(items, function(item) {
                    return item.code === code
                });

                if( checkExists.length > 0 ){

                    priceTracker.loading(false);

                    return Swal.fire({
                        text: 'Bu ürünü zaten eklemişsiniz.',
                        type: 'error',
                        confirmButtonText: 'Tamam'
                    });
                }

                priceTrackerAmazon.getProduct(code).then(function (productData){

                    if(
                        productData.code.length === 10 &&
                        productData.name.length > 0 &&
                        productData.priceFloat > 0 &&
                        productData.url.length > 0 &&
                        productData.lastUpdate
                    ){
                        items.push({
                            code: productData.code,
                            name: productData.name,
                            old_price: productData.priceFloat,
                            new_price: productData.priceFloat,
                            url: productData.url,
                            last_update: productData.lastUpdate
                        });

                        priceTracker.setStorageLocal('amazon_items', items).then(function () {

                            let rowNr = $('#price-tracker tr').length;
                            let lastUpdate = moment(productData.lastUpdate, 'YYYY-MM-DD HH:mm:ss').format('DD.MM.YYYY / HH:mm:ss');
                            let oldPrice = priceTracker.numberFormat(productData.priceFloat, 2, ',', '.') + ' TL';
                            let newPrice = priceTracker.numberFormat(productData.priceFloat, 2, ',', '.') + ' TL';
                            let lastUpdateHuman = moment(productData.lastUpdate, 'YYYY-MM-DD HH:mm:ss').fromNow();

                            let newTr = `
                            <tr id="${ productData.code }">
                                <td class="pt-delete"><a class="pt-delete-item" href="javascript:void(0)">Sil</a></td>
                                <td class="pt-index">${ rowNr }</td>
                                <td class="pt-code">${ productData.code }</td>
                                <td class="pt-title"><a target="_blank" href="${ productData.url }">${ productData.name }</a></td>
                                <td class="pt-price">${ oldPrice }</td>
                                <td class="pt-waiting-price">${ newPrice }</td>
                                <td class="pt-last-update">${ lastUpdate }</td>
                                <td class="pt-last-update-human">${ lastUpdateHuman }</td>
                            </tr>
                            `;

                            $('#price-tracker tr:last').after(newTr);

                            priceTracker.loading(false);

                            return Swal.fire({
                                text: 'Ürün başarıyla listeye eklendi.',
                                type: 'success',
                                confirmButtonText: 'Tamam'
                            });

                        });

                    }else{

                        priceTracker.loading(false);

                        return Swal.fire({
                            text: 'Ürün bilgisine ulaşılamadı.',
                            type: 'error',
                            confirmButtonText: 'Tamam'
                        });
                    }

                });

            });

        });
    },

    // 4
    clickDeleteItem: function ()
    {
        $(document).on("click", ".pt-delete-item", function() {

            let code = $(this).closest('tr').attr('id');

            priceTracker.getStorageLocal('amazon_items').then(function(items){

                let filtered = _.filter(items, function(item) {
                    return item.code !== code
                });

                priceTracker.setStorageLocal('amazon_items', filtered).then(function () {

                    $('#'+code).remove();

                    return Swal.fire({
                        title: 'İşlem Başarılı!',
                        text: 'Ürün silindi.',
                        type: 'success',
                        confirmButtonText: 'Tamam'
                    });

                });

            });
        });
    },

    // 5
    getProduct: function(code)
    {
        return new Promise(function(resolve, reject){

            let url = 'https://www.amazon.com.tr/gp/product/' + code;

            $.ajaxSetup({
                beforeSend: function(jqXHR, settings) {
                    jqXHR.setRequestHeader('x-requested-with', null);
                }
            });

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                headers: {
                    // 'sec-fetch-site': 'same-origin',
                    'Content-Type': 'text/html;charset=UTF-8',
                    // 'x-requested-with': null,
                },
                success: function (data) {

                    let parseHtml = $(data);

                    let title = parseHtml.find('#productTitle').text().replace(/\s/g,'');
                    let price = parseHtml.find('#price .priceBlockBuyingPriceString').text().replace(/\s/g,'');

                    let item = {
                        code: code,
                        name: title,
                        url: url,
                        price: price,
                        priceFloat: parseFloat(price.replace('₺', '').replace('.', '').replace(',', '.')),
                        lastUpdate: moment().format('YYYY-MM-DD HH:mm:ss')
                    };

                    resolve(item);
                },
                error: function (error) {
                    console.log('Bir hata oluştu. Ürün bilgilerine ulaşılamadı.');
                    reject(false);
                }
            });
        });

    },

    // 6
    eachItems: function() {

        priceTracker.getStorageLocal('amazon_items').then(function (items) {

            if( ! Array.isArray(items) ){
                return false;
            }

            $.each(items, function(index, item) {

                // return console.log(item);

                $('#' + item.code).css("background-color", "yellow");

                priceTrackerAmazon.getProduct(item.code).then(function (productData){

                    if(
                        productData.priceFloat > 0 &&
                        productData.lastUpdate
                    ){

                        let lastUpdate = moment(productData.lastUpdate, 'YYYY-MM-DD HH:mm:ss').format('DD.MM.YYYY / HH:mm:ss');
                        let lastUpdateHuman = moment(productData.lastUpdate, 'YYYY-MM-DD HH:mm:ss').fromNow();
                        let lastPriceFormat = priceTracker.numberFormat(productData.priceFloat, 2, ',', '.') + ' TL';

                        // console.log(item);
                        // console.log(productData);
                        // console.log(lastUpdateHuman);

                        let itemCodeSelector = $('#' + item.code);
                        itemCodeSelector.css('background-color', 'white');
                        itemCodeSelector.find('.pt-last-update').text(lastUpdate);
                        itemCodeSelector.find('.pt-last-update-human').text(lastUpdateHuman);
                        itemCodeSelector.find('.pt-waiting-price').text(lastPriceFormat);

                        let productName = item.name;
                        let productCode = item.code;
                        let oldPrice = item.new_price;
                        let newPrice = productData.priceFloat;

                        let exceptDiscountPercent;
                        let ptType;

                        if( oldPrice === newPrice ){
                            // Fiyat Değişmemiş !
                            console.warn('Fiyat değişmemiş');
                            return false;
                        }

                        // Fiyat Değişti !
                        console.log('Fiyat değişti...');
                        console.log(item.new_price);
                        console.log(productData.priceFloat);


                        // Paste

                        priceTracker.getStorageLocal('except_discount_percent').then(function (result1) {

                            exceptDiscountPercent = result1;

                            priceTracker.getStorageLocal('type').then(function (result2) {

                                ptType = result2;

                                // 1 = İndirim & Artış
                                // 2 = Sadece İndirim
                                // 2 = Sadece Artış

                                if( ptType === 2 && oldPrice > newPrice ){

                                    // İndirim
                                    if( exceptDiscountPercent > 0 ){

                                        // İndirim Yüzdesi Kontrol Et
                                        if( priceTracker.discountPercent(oldPrice, newPrice) >  exceptDiscountPercent ){

                                            // Bildirim
                                            priceTrackerAmazon.sendMessage(1, productCode, productName, oldPrice, newPrice, lastPriceFormat, itemCodeSelector);

                                        }else{

                                            // İşle
                                            priceTrackerAmazon.processChanges(productCode, newPrice, lastPriceFormat, itemCodeSelector);

                                        }

                                    }else{

                                        // Yüzde Kontrol Etme
                                        // Bildirim
                                        priceTrackerAmazon.sendMessage(1, productCode, productName, oldPrice, newPrice, lastPriceFormat, itemCodeSelector);

                                    }


                                }else if( ptType === 3 && oldPrice < newPrice ){

                                    // Artış
                                    // Bildirim
                                    priceTrackerAmazon.sendMessage(1, productCode, productName, oldPrice, newPrice, lastPriceFormat, itemCodeSelector);

                                }else{

                                    // Hepsi
                                    // Bildirim
                                    priceTrackerAmazon.sendMessage(1, productCode, productName, oldPrice, newPrice, lastPriceFormat, itemCodeSelector);
                                }

                                /*console.log({
                                    except: exceptDiscountPercent,
                                    type: ptType,
                                    oldPrice: oldPrice,
                                    newPrice: newPrice
                                });*/

                            });

                        });

                    }

                });



            });

        });

    },

    processChanges: function (productCode, newPrice, lastPriceFormat, itemCodeSelector)
    {
        // Storage Local Update
        priceTracker.getStorageLocal('amazon_items').then(function(currItems){

            let updatedItems = _.filter(currItems, function(currItem) {

                if(currItem.code === productCode){

                    currItem.old_price = newPrice;
                    currItem.new_price = newPrice;
                    currItem.last_update = moment().format('YYYY-MM-DD HH:mm:ss');

                    return currItem;

                }else{
                    return currItem;
                }

            });

            priceTracker.setStorageLocal('amazon_items', updatedItems).then(function () {

                // Storage Local Updated
                itemCodeSelector.find('.pt-price').text(lastPriceFormat);

            });

        });

    },

    sendMessage: function (trackerId, productCode, productName, oldPrice, newPrice, lastPriceFormat, itemCodeSelector)
    {
        priceTracker.sendMessage(trackerId, productCode, productName, oldPrice, newPrice).then(function (success) {

            // İşlem başarılı. Telegram mesajı gönderildi.
            console.log('İşlem başarılı. Telegram mesajı gönderildi.');

            // Storage Local Update
            priceTrackerAmazon.processChanges(productCode, newPrice, lastPriceFormat, itemCodeSelector)

        }, function (error) {

            // İşlem başarısız. Telegram mesajı gönderilemedi.
            console.log('İşlem başarısız. Telegram mesajı gönderilemedi.');
        });
    }

};

$(document).ready(function () {

    priceTrackerAmazon.start();

});