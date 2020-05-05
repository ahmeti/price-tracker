const priceTracker = {

    market: null,

    loading: function(status)
    {
        let loading = $('#loading');

        if(status===true){
            return loading.show();
        }

        return loading.hide();
    },

    numberFormat: function(number, decimals, dec_point, thousands_sep)
    {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },

    emptyHtml: function ()
    {
        setTimeout(function () {
            $.each($("body").children().not("#loading, .navbar, .container-fluid"), function(index, item){
                // console.log(item);
                item.remove();
            });
        }, 20000);

        return new Promise(function(resolve, reject){

            let html = $('html')[0];
            let body = $('body')[0];

            while(html.attributes.length > 0){
                html.removeAttribute(html.attributes[0].name);
            }

            while(body.attributes.length > 0){
                body.removeAttribute(body.attributes[0].name);
            }

            $('head').html('');
            $('body').html('');

            setTimeout(function () {

                let html = $('html')[0];
                let body = $('body')[0];

                while(html.attributes.length > 0){
                    html.removeAttribute(html.attributes[0].name);
                }

                while(body.attributes.length > 0){
                    body.removeAttribute(body.attributes[0].name);
                }

                $('head').html('');
                $('body').html('');

                $('head').html(`
                    <meta charset="UTF-8">
                    <title>Fiyat Takipçi</title>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="${ chrome.runtime.getURL('priceTracker.css') }" type="text/css" />
                `);

                $('body').html(`
                <div id="loading" class="loading">&nbsp;</div>
                <nav class="navbar navbar-default">
                    <div class="container">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                            <a class="navbar-brand" href="javascript:void(0)">Fiyat Takipçi</a>
                        </div>
                    
                        <div id="navbar" class="navbar-collapse collapse">
                            <ul class="nav navbar-nav">
                                <li><a href="https://www.amazon.com.tr/?price_tricker=1">Amazon</a></li>
                            </ul>
                        </div><!--/.nav-collapse -->
                    
                    </div><!--/.container-fluid -->
                </nav>

                
                <div class="container-fluid" id="app">
                
                    <div id="pt-settings" class="panel panel-default">
                        <div class="panel-heading">
                            <strong>Ayarlar</strong>
                        </div>
                        <div class="panel-body">
                            
                            <form onsubmit="return false;">
                              
                                <div class="row">
                              
                                    <div class="col-sm-3">
                                        <div class="form-group form-group-sm">
                                            <label>Kontrol Sıklığı</label>
                                            <select class="form-control input-sm pt-interval">
                                                <option value="3">3 Dakikada Bir</option>                                            
                                                <option value="4">4 Dakikada Bir</option>
                                                <option value="5">5 Dakikada Bir</option>
                                                <option value="6">6 Dakikada Bir</option>
                                                <option value="7">7 Dakikada Bir</option>
                                                <option value="8">8 Dakikada Bir</option>
                                                <option value="9">9 Dakikada Bir</option>
                                                <option value="10">10 Dakikada Bir</option>
                                            </select>
                                        </div>    
                                    </div>
                                    
                                    <div class="col-sm-3">
                                        <div class="form-group form-group-sm">
                                            <label>İndirim / Artış Durumu</label>
                                            <select class="form-control input-sm pt-type">
                                                <option value="1">İndirim ve Artış</option>                                            
                                                <option value="2">Sadece İndirim</option>
                                                <option value="3">Sadece Artış</option>
                                            </select>
                                        </div>    
                                    </div>
                                    
                                    <div class="col-sm-3">
                                        <div class="form-group form-group-sm">
                                            <label>Önemsiz İndirim % (Bildirmez)</label>
                                            <input data-autonumeric="1" data-a-sep="." data-a-dec="," data-a-pad="false" data-v-min="0.00" data-v-max="99.99" type="text" class="form-control pt-except-discount-percent" 
                                                placeholder="Göz ardı edilecek yüzde indirim oranını yazınız.">
                                        </div>    
                                    </div>
                                    
                                    <div class="col-sm-3">
                                        <div class="form-group form-group-sm">
                                            <label>&nbsp;</label>
                                            <button type="submit" class="btn btn-sm btn-success btn-block pt-submit-settings">Kaydet</button>
                                        </div>    
                                    </div>
                                    
                                </div>
 
                            </form>
                            
                        </div>
                    </div>
                
                </div>
                `);

                setTimeout(function () {
                    priceTracker.setAutoNumeric();
                    priceTracker.setNoty();
                    priceTracker.listenHashChange();
                    console.clear();
                    resolve(true);
                }, 8000);

            }, 400);

        });
    },

    setAutoNumeric: function ()
    {
        selector = $('input[data-autonumeric=1]');

        if ( jQuery().autoNumeric && selector.length > 0 ){

            selector.each(function() {
                $(this).autoNumeric('init');
            });

        }
    },

    setNoty: function ()
    {
        /*noty.overrideDefaults({
            layout: 'topRight',
            theme: 'relax',
            timeout: '600000',
            progressBar: true,
            closeWith: ['button'],
            maxVisible: 100,
        });*/
    },

    sendMessage: function (market_id, product_code, product_name, old_price, new_price )
    {
        return new Promise(function(resolve, reject){

            priceTracker.getStorageLocal('api_key').then(function (api_key) {

                priceTracker.playSound();

                noty({
                    text:
                        `<div>
                            <div><strong>Fiyat değişti!</strong></div>
                            <div>Eski: ${old_price} Yeni: ${new_price}</div>
                            <div><a href="#${product_code}">${product_code}</a></div>
                        </div>`,
                    type: "warning",
                    layout: 'topRight',
                    theme: 'relax',
                    timeout: '600000',
                    progressBar: true,
                    closeWith: ['button'],
                    maxVisible: 100,
                });

                resolve(true);
            });

        });
    },

    getStorageLocal: function(itemKey)
    {
        return new Promise(function(resolve, reject){

            chrome.storage.local.get([itemKey], function(result) {
                resolve(result[itemKey]);
            });

        });
    },

    setStorageLocal: function(key, value)
    {
        return new Promise(function(resolve, reject){

            let setItem = {};
            setItem[key] = value;

            chrome.storage.local.set(setItem, function() {
                resolve(value);
            });
        })
    },

    removeStorageLocal: function(itemKey)
    {
        return new Promise(function(resolve, reject){
            chrome.storage.local.remove([itemKey], function() {
                resolve(true);
            });
        });
    },

    submitSettings: function ()
    {
        $(document).on("click", ".pt-submit-settings", function() {

            let submitButton = $(this);
            submitButton.prop('disabled', true);

            let interval = parseInt($('.pt-interval').val());
            let ptType = parseInt($('.pt-type').val()) || 0;
            let exceptDiscountPercent = parseFloat($('.pt-except-discount-percent').autoNumeric('get')) || 0.0;

            if( interval < 3 || interval > 10 ){

                submitButton.prop('disabled', false);

                return Swal.fire({
                    text: 'Kontrol sıklığını seçiniz.',
                    type: 'error',
                    confirmButtonText: 'Tamam'
                });

            }else if( ptType < 1 || ptType > 3 ){

                submitButton.prop('disabled', false);

                return Swal.fire({
                    text: 'İndirim / Artış durumunu seçiniz.',
                    type: 'error',
                    confirmButtonText: 'Tamam'
                });

            }else if( typeof exceptDiscountPercent !== 'number' ){

                submitButton.prop('disabled', false);

                return Swal.fire({
                    text: 'Göz ardı edilecek indirim yüzdesi formatı geçersiz.',
                    type: 'error',
                    confirmButtonText: 'Tamam'
                });
            }

            priceTracker.setStorageLocal('interval', interval);
            priceTracker.setStorageLocal('except_discount_percent', exceptDiscountPercent);
            priceTracker.setStorageLocal('type', ptType);

            submitButton.prop('disabled', false);

            Swal.fire({
                text: 'İşlem başarılı.',
                type: 'success',
                confirmButtonText: 'Tamam'
            }).then(function () {
                return location.reload(true);
            });

        });
    },

    remainingCounter: function ()
    {
        setInterval(function () {

            let remainingCounter = $('#remainingCounter');
            let remaining = Number(remainingCounter.text()) || 0;

            if( remaining > 0 ){
                remainingCounter.text(remaining - 1);

            }else {
                // Reset

                priceTracker.getStorageLocal('interval').then(function (interval) {

                    let eachInterval = 0;

                    if (!interval) {
                        eachInterval = (3 * 60);

                    } else if (interval >= 3 && interval <= 10) {
                        eachInterval = interval * 60;

                    } else {
                        eachInterval = 3 * 60;
                    }

                    remainingCounter.text(eachInterval);

                    // Replay
                    setTimeout(function () {
                        priceTrackerAmazon.eachItems();
                    }, 1000);

                });
            }
        }, 1000);
    },

    discountPercent: function (oldPrice, newPrice)
    {
        oldPrice = parseFloat(oldPrice) || 0;
        newPrice = parseFloat(newPrice) || 0;

        if( oldPrice > newPrice && newPrice > 0 ){
            let precent = ((oldPrice - newPrice) / oldPrice) * 100;
            return parseFloat(precent.toFixed(2));
        }
        return 0;
    },

    playSound: function ()
    {
        let audio = new Audio(chrome.runtime.getURL('alert.mp3'));
        audio.play();
    },

    listenHashChange: function ()
    {
        $(window).on('hashchange', function(e) {
            $('#price-tracker tr').css({backgroundColor: "white"});
            $('tr'+location.hash).css({backgroundColor: "springgreen"});
        });
    }

};
