// checklist what need:
// get MSpending spending number depending on year and name
const gcountryToFind = "Brazil";
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
    // new Chart("myChart2", {
    //     type: "line",
    //     data: {
    //         labels: xValues,
    //         datasets: [{
    //             label: 'GNI',
    //             yAxisID: 'A',
    //             data: gniYValues,
    //             borderColor: "red",
    //             fill: false
    //         }, {
    //             label: 'sRate',
    //             yAxisID: 'B',
    //             data: sRateValues,
    //             borderColor: "blue",
    //             fill: false
    //         }]
    //     },
    //     options: {
    //         legend: {display: true}
    //     }
    // });
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