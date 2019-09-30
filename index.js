const xmlFile = "./tecaj.xml";
$(document).ready(function () {
    let drzava, valuta, jedinica, prodajni, srednji, kupovni;
    const referenceTable = {};
    $.ajax({
        type: 'GET',
        url: xmlFile,
        dataType: 'xml',
        success: function (xml) {
            $(xml).find('item').each(function () {
                valuta = $(this).find('valuta').text();
                jedinica = $(this).find('jedinica').text();
                prodajni = $(this).find('prodajni_tecaj').text().replace(',', '.');
                srednji = $(this).find('srednji_tecaj').text().replace(',', '.');
                kupovni = $(this).find('kupovni_tecaj').text().replace(',', '.');
                let newRowItem = "<tr id='" + valuta + "'><td class='" + valuta + "'>" + valuta + "</td><td class='jedinica'>" + jedinica + "</td><td class='kupovni'>" + kupovni + "</td><td class='srednji'>" + srednji + "</td><td class='prodajni'>" + prodajni + "</td></tr>";
                $('#tblEntry').append(newRowItem);
                let optionItem = "<option value='" + valuta + "'>" + valuta + "</option>"
                $('#currency').append(optionItem);
                referenceTable[`${valuta}`] = {
                    'jedinica': parseFloat(jedinica),
                    'kupovni': (parseFloat(kupovni).toFixed(6)),
                    'srednji': (parseFloat(srednji).toFixed(6)),
                    'prodajni': (parseFloat(prodajni).toFixed(6))
                };
            })
        }
    });
    
        $(document).on('change', '#amount', function () {
            if (!Number(this.value))
                alert('Dopušten je samo unos brojeva!');
            else {
                let amount = $('#amount').val();
                let currency = $('#currency').val();
                let k = (amount * referenceTable[`${currency}`]['kupovni'])/(referenceTable[`${currency}`]['jedinica']);
                let s = (amount * referenceTable[`${currency}`]['srednji'])/(referenceTable[`${currency}`]['jedinica']);
                let p = (amount * referenceTable[`${currency}`]['prodajni'])/(referenceTable[`${currency}`]['jedinica']);
                $(`td#${currency}`).remove();
                const entries = Object.entries(referenceTable);
                for(const [curr, entry] of entries)
                {
                    if(curr !== currency)
                        {
                            let ak = (k/entry['kupovni'])*(entry['jedinica']);
                            let as = (s/entry['srednji'])*(entry['jedinica']);
                            let ap = (p/entry['prodajni'])*(entry['jedinica']);
                            $(`tr#${curr}>td.kupovni`).text(ak.toFixed(6));
                            $(`tr#${curr}>td.srednji`).text(as.toFixed(6));
                            $(`tr#${curr}>td.prodajni`).text(ap.toFixed(6));
                        }
                    else{ 
                        $(`tr#${curr}>td.kupovni`).text(amount);
                        $(`tr#${curr}>td.srednji`).text(amount);
                        $(`tr#${curr}>td.prodajni`).text(amount);
                    }
                }

            };
        });
        $(document).on('change', '#currency', function(){
            $('#amount').val(1.00).trigger('change');

        })
})