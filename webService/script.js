// checklist what need:
// get MSpending spending number depending on year and name
const gcountryToFind = "Brazil";
let gniXml, sRateXml, mSpendingXml;
const userActionPost = async () => {
    const countryToFind = document.getElementById("userInput").value;
    if(countryToFind){
        //const countryToFind = "Germany";

        let gni, sRate, mSpending;


        // Displaying the value

        try{
            const response = await fetch('http://localhost:6061/mSpending', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const myJson = await response.json(); //extract JSON from the http response
            // do something with myJson
            console.log(myJson)
            // console.log(myJson.result[86].Name)
            mSpending = myJson;
        }catch (e) {
            console.log(e)
            alert(e)
        }

        try{
            const response = await fetch('http://localhost:6061/gniCountry', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const myJson = await response.json(); //extract JSON from the http response
            gni = myJson
        }catch (e) {
            console.log(e)
            alert(e)
        }

        try{
            const response = await fetch('http://localhost:6061/sRate/' + countryToFind, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const myJson = await response.json(); //extract JSON from the http response
            sRate = myJson;
        }catch (e) {
            console.log(e)
            alert(e)
        }

        //-------------------------------------------------------------------------------------- get data in xml
        try{
            const response = await fetch('http://localhost:6061/mSpending', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/xml'
                }
            });
            //const myJson = await response.json(); //extract JSON from the http response
            const myXml = await response.text() //extract JSON from the http response
            //console.log("RESPONSE MSPENDING XML REQUEST::", myXml)
            //var convert = require('xml-js');

            //var convertedXmlToJson = convert.xml2json(myXml, {compact: true, spaces: 4});

            //let jsonFromXml = xml2json(myXml);

            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(myXml,"text/xml");

            console.log("Length of data: ", xmlDoc.getElementsByTagName(countryToFind).length)
            let xmlExteractedMSpedningData = [];

            for(let i = 0; i < xmlDoc.getElementsByTagName(countryToFind).length; i++)
            {
                var firstRow = xmlDoc.getElementsByTagName(countryToFind)[i];
                var dataChart = firstRow.firstChild.nextSibling.textContent;
                xmlExteractedMSpedningData.push(dataChart);
            }
            console.log("Final result::: ", xmlExteractedMSpedningData)

            mSpendingXml = xmlExteractedMSpedningData;
        }catch (e) {
            console.log(e)
            alert(e)
        }

        try{
            const response = await fetch('http://localhost:6061/gniCountry', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/xml'
                }
            });
            const myGniXmlData = await response.text();

            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(myGniXmlData,"text/xml");

            let xmlExteractedGniData = [];

            for(let i = 0; i < xmlDoc.getElementsByTagName(countryToFind).length; i++)
            {
                var firstRow = xmlDoc.getElementsByTagName(countryToFind)[i];
                var dataChart = firstRow.firstChild.nextSibling.textContent;
                xmlExteractedGniData.push(dataChart);
            }
            console.log("Final result2::: ", xmlExteractedGniData)

            gniXml = xmlExteractedGniData;

        }catch (e) {
            console.log(e)
            alert(e)
        }
        //
        try{
            const response = await fetch('http://localhost:6061/sRate/' + countryToFind, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/xml'
                }
            });
            const mySrateXmlData = await response.text();
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(mySrateXmlData,"text/xml");

            var firstRow = xmlDoc.getElementsByTagName(countryToFind)[21];
            var dataChart = firstRow.firstChild.nextSibling;
            var dataChart = firstRow.firstChild.nextSibling.textContent;

            let xmlExteractedSRateData = [];

            for(let i = 0; i < xmlDoc.getElementsByTagName(countryToFind).length; i++)
            {
                var firstRow = xmlDoc.getElementsByTagName(countryToFind)[i];
                var dataChart = firstRow.firstChild.nextSibling.textContent;
                if(firstRow.firstChild.nextSibling.nodeName === "sRateSum")
                {
                    xmlExteractedSRateData.push(dataChart);
                }
            }
            console.log("Final result3::: ", xmlExteractedSRateData)

            sRateXml = xmlExteractedSRateData;
        }catch (e) {
            console.log(e)
            alert(e)
        }


        if(checkCountry(sRate, mSpending, gni))
        {
            console.log("HEREAAAA::::: ", gni)
            createChart(sRate, mSpending, gni, countryToFind)
        } else {
            alert('No data could be retrieved under that name')
        }
    } else {
        alert('Please fill in the input box with a correct country name')
    }
}

function createChart(sRate, mSpending, gni, country){
    const ctx = document.getElementById('myChart').getContext('2d');

    let xValues = getXAxisArray(sRate);
    let gniYValues = getGniYValues(gni, country);
    let mSpendingValues = getMSpendingValues(mSpending, country);
    let sRateValues = getSRateValues(sRate);

    new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label: 'GNI',
                yAxisID: 'A',
                data: gniYValues,
                borderColor: "red",
                fill: false
            }, {
                label: 'Military Spending',
                data: mSpendingValues,
                borderColor: "green",
                fill: false
            }, {
                label: 'sRate',
                yAxisID: 'B',
                data: sRateValues,
                borderColor: "blue",
                fill: false
            }]
        },
        options: {
            legend: {display: true},
            scales: {
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                }, {
                    id: 'B',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        max: 1000,
                        min: 0
                    }
                }]
            }
        }
    });

    var canvas = document.getElementById('myChart2');
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'GNI',
                yAxisID: 'A',
                data: gniYValues,
                borderColor: "red",
            }, {
                label: 'S Rate',
                yAxisID: 'B',
                data: sRateValues,
                borderColor: "blue",
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                }, {
                    id: 'B',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        max: 1000,
                        min: 0
                    }
                }]
            }
        }
    });

    //----------------------------------------------------------- XML CHARTS
    var canvasXml1 = document.getElementById('myChart3');
    new Chart(canvasXml1, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'M Spending',
                yAxisID: 'A',
                data: mSpendingXml,
                borderColor: "red",
            }, {
                label: 'Gni',
                yAxisID: 'B',
                data: gniXml,
                borderColor: "blue",
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                }, {
                    id: 'B',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        max: 100000,
                        min: 0
                    }
                }]
            }
        }
    });

    var canvasXml2 = document.getElementById('myChart4');
    new Chart(canvasXml2, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'gni',
                yAxisID: 'A',
                data: gniXml,
                borderColor: "red",
            }, {
                label: 'sRate',
                yAxisID: 'B',
                data: sRateXml,
                borderColor: "blue",
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                }, {
                    id: 'B',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        max: 6000,
                        min: 0
                    }
                }]
            }
        }
    });
}

function checkCountry(sRate, mSpending, gni){
    return sRate.result.length > 0 && mSpending.result.length > 0 && gni.result.length > 0;
}

function getXAxisArray(sRate){
    let returnArray = [];
    for (let i = 0; i < sRate.result.length; i++){
        // look for the entry with a matching `code` value
        returnArray.push(sRate.result[i].year);
    }
    console.log(returnArray)
    return returnArray;
}

// returns the gni values for the specified country between 1990 and 2014
function getGniYValues(gni, countryToFind){
    let returnArray = [];
    console.log('FIND::::::::::', countryToFind)
    // loop through array of results
    for (let i = 0; i < gni.result.length; i++){
        // look through every entry and find a country we desire data from
        if(gni.result[i].Country === countryToFind){
            // loop through the keys to find the year of the data that is required
            for (var key of Object.keys(gni.result[i])) {
                let yearKey = key.substring(1);
                // ensure the data is within the specidied time and push on return array.
                if(parseInt(yearKey) <= 2014 && parseInt(yearKey) >= 1990){
                    returnArray.push(parseInt(gni.result[i][key]))
                }
            }
        }
    }
    console.log("RETURN ARRAY WITH COUNTRY GNI VALUES", returnArray)
    return returnArray;
}

function getMSpendingValues(mSpending, countryToFind){
    let returnArray = [];
    for (let i = 0; i < mSpending.result.length; i++){
        // look for the entry with a matching `code` value
        if(mSpending.result[i].Name === countryToFind){
            for (var key of Object.keys(mSpending.result[i])) {
                let yearKey = key.substring(1);
                if(parseInt(yearKey) <= 2014 && parseInt(yearKey) >= 1990){
                    returnArray.push(parseInt(mSpending.result[i][key]))
                }
            }
        }
    }
    console.log(returnArray)
    return returnArray;
}

function getSRateValues(sRate){
    let returnArray = [];
    for (let i = 0; i < sRate.result.length; i++){
        // look for the entry with a matching `code` value
        returnArray.push(sRate.result[i].sRateSum)
    }
    console.log("SRATE VALUES IN RETURN ARRAY::: ", returnArray)
    return returnArray;
}

/// SAME FUNCTIONS FOR XML
function checkCountryXml(sRate, mSpending, gni){
    return sRate.result.length > 0 && mSpending.result.length > 0 && gni.result.length > 0;
}

function getXAxisArrayXml(sRate){
    let returnArray = [];
    for (let i = 0; i < sRate.result.length; i++){
        // look for the entry with a matching `code` value
        returnArray.push(sRate.result[i].year);
    }
    console.log(returnArray)
    return returnArray;
}

// returns the gni values for the specified country between 1990 and 2014
function getGniYValuesXml(gni, countryToFind){
    let returnArray = [];
    console.log('FIND::::::::::', countryToFind)
    // loop through array of results
    for (let i = 0; i < gni.result.length; i++){
        // look through every entry and find a country we desire data from
        if(gni.result[i].Country === countryToFind){
            // loop through the keys to find the year of the data that is required
            for (var key of Object.keys(gni.result[i])) {
                let yearKey = key.substring(1);
                // ensure the data is within the specidied time and push on return array.
                if(parseInt(yearKey) <= 2014 && parseInt(yearKey) >= 1990){
                    returnArray.push(parseInt(gni.result[i][key]))
                }
            }
        }
    }
    console.log("RETURN ARRAY WITH COUNTRY GNI VALUES", returnArray)
    return returnArray;
}

function getMSpendingValuesXml(mSpending, countryToFind){
    let returnArray = [];
    for (let i = 0; i < mSpending.result.length; i++){
        // look for the entry with a matching `code` value
        if(mSpending.result[i].Name === countryToFind){
            for (var key of Object.keys(mSpending.result[i])) {
                let yearKey = key.substring(1);
                if(parseInt(yearKey) <= 2014 && parseInt(yearKey) >= 1990){
                    returnArray.push(parseInt(mSpending.result[i][key]))
                }
            }
        }
    }
    console.log(returnArray)
    return returnArray;
}

function getSRateValuesXml(sRate){
    let returnArray = [];
    for (let i = 0; i < sRate.result.length; i++){
        // look for the entry with a matching `code` value
        returnArray.push(sRate.result[i].sRateSum)
    }
    console.log("SRATE VALUES IN RETURN ARRAY::: ", returnArray)
    return returnArray;
}
