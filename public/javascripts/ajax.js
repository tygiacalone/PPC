window.onload = function() {
    var appKey = 'e2e2b0dfbeeebfe033dc7cf07b1d0dca';
    var appId = 'dadd6670';
    var nutrition_fields = {
        "query": "",
        "fields": [
            "brand_name",
            "brand_id",
            "item_id",
            "item_name",
            "upc",
            "item_type",
            "item_description",
            "nf_ingredient_statement",
            "nf_water_grams",
            "nf_calories",
            "nf_calories_from_fat",
            "nf_total_fat",
            "nf_saturated_fat",
            "nf_monounsaturated_fat",
            "nf_polyunsaturated_fat",
            "nf_trans_fatty_acid",
            "nf_cholesterol",
            "nf_sodium",
            "nf_total_carbohydrate",
            "nf_dietary_fiber",
            "nf_sugars",
            "nf_protein",
            "nf_vitamin_a_iu",
            "nf_vitamin_a_dv",
            "nf_vitamin_c_mg",
            "nf_vitamin_c_dv",
            "nf_calcium_mg",
            "nf_calcium_dv",
            "nf_iron_mg",
            "nf_iron_dv",
            "nf_potassium",
            "nf_refuse_pct",
            "nf_servings_per_container",
            "nf_serving_size_qty",
            "nf_serving_size_unit",
            "nf_serving_weight_grams",
            "allergen_contains_milk",
            "allergen_contains_eggs",
            "allergen_contains_fish",
            "allergen_contains_shellfish",
            "allergen_contains_tree_nuts",
            "allergen_contains_peanuts",
            "allergen_contains_wheat",
            "allergen_contains_soybeans",
            "allergen_contains_gluten",
            "images_front_full_url",
            "updated_at",
            "section_ids"
        ],
        "appId": appId, //appKey variable
        "appKey": appKey //appID variable
    };
    var autocomplete_fields = {
        "q": "",
        "appId": appId, //appKey variable
        "appKey": appKey //appID variable
    };
    var search = document.getElementById('search');
    var content = document.getElementById('itemlist');
    var autocomplete = document.getElementById('autocomplete');
    var searchDict = {};
    var resultDict = {};
    var resultList = [];

    /*
    Activating autoselect query when user types more than 3 characters
     */
    var searched = false;


    document.onkeyup = function (event) {
        if (window.event.keyCode >= 37 && window.event.keyCode <= 40) {
            return;
        }

        if (autocomplete.value.length > 2 && !searched){
            var text = autocomplete.value;
            if (!(text in searchDict)) {
                searchDict[text] = text;
                autocomplete_fields.q = text;
                getAutocomplete();
                searched = true;
            }
        }

        if (autocomplete.value.length < 2 && autocomplete.value.length > 0){
            var text = autocomplete.value;
            if (!(text in searchDict)) {
                autocomplete_fields.q = text;
                searchDict[text] = text;
                getAutocomplete();
                searched = false;
            }
        }

        if (autocomplete.value.length == 0){
            searched = false;
        }

        if (window.event.keyCode == '13') {
            var text = autocomplete.value;
            if (!(text in searchDict)) {
                autocomplete_fields.q = text;
                searchDict[text] = text;
                getAutocomplete();
                searched = false;
            }
        }
    };



    function populateAutocomplete(data) {

        // Make sure no duplicates in autocomplete
        for (var i = 0; i < data.length; i++) {
            var json = { value: data[i].text};
            //console.log('seen: ', json.value);
            if (!(json.value in resultDict)) {
                resultDict[json.value] = json.value;
                resultList.push(json.value);
            }
        }

        // setup autocomplete function pulling from resultList array
        $('#autocomplete').autocomplete({
            lookup: resultList,
            onSelect: function (suggestion) {

                nutrition_fields.query = suggestion.value;

                // Ajax call to nutritionix API
                getFoodItems();
            }
        });
    };

    function displayNutrition(data) {
        var results = data.hits;
        //console.log(data);
        //console.log('response received on frontend');
        //console.log(data);
        //console.log(data[0]);
        var first_item = results[0].fields;
        var thehtml = '<strong>Item: </strong>' + first_item.item_name + '<br>';
        thehtml += '<strong>Brand: </strong>' + first_item.brand_name + '<br>';
        thehtml += '<strong>Calories: </strong>' + first_item.nf_calories + '<br>';
        thehtml += '<strong>Protein: </strong>' + first_item.nf_protein + 'g' + '<br>';
        thehtml += '<strong>Protein / Calorie: </strong>' + 10 * (first_item.nf_protein / first_item.nf_calories) + '<br>';
        $('#outputcontent').html(thehtml);
    };

    function getAutocomplete() {
        $.ajax({
            type: "GET",
            url: "https://apibeta.nutritionix.com/v2/autocomplete/",
            dataType: "json",
            data: autocomplete_fields
        }).done(function(res){
            populateAutocomplete(res);
        }).fail(function(err){console.log(err);});
    };

    function getFoodItems() {
        $.ajax({
            type: "POST",
            url: "https://api.nutritionix.com/v1_1/search",
            dataType: "json",
            data: nutrition_fields
        }).done(function(res){
            console.log('res.results: ', res.hits[0].fields);
            console.log('here');
            displayNutrition(res);
        }).fail(function(err){console.log(err); console.log('fail');});
    };

};
