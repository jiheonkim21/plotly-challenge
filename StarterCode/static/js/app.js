d3.json("samples.json").then((data) => {
    
    var dataset = data.samples;
    var nameLabels = data.names;
    var dropdownMenu = d3.select("#selDataset");
   
    // Populate Dropdown Menu with all IDs
    nameLabels.forEach(function(nameLabel){
        dropdownMenu.append("option").text(nameLabel).property("value", nameLabel)
    });
    
    d3.selectAll("#selDataSet").on("change", optionChanged);

    // function to handle event (differen ID selected in dropdown menu)
    function optionChanged(){
        // select dropdownMenu and set subjectId to selected Id
        var dropdownMenu = d3.select("#selDataset");
        var subjectId = dropdownMenu.property("value");

        // Call updateBarChart and updateDemographicInfo functions
        updateBarChart(subjectId);
        updateBubbleChart(subjectId);
        updateDemographicInfo(parseInt(subjectId));
    };


    // function to filter data and retrieve info
    function filterData(subjectId){
        var filteredDataset = dataset.filter(d => d.id === subjectId);
        var otuIds = filteredDataset.map(d => d.otu_ids);
        var slicedOtuIds = otuIds[0].slice(0,10);
        var otuIdString = slicedOtuIds.map(d => `OTU ${d}`);
        var sampleValues = filteredDataset.map(d => d.sample_values);
        var slicedSampleValues = sampleValues[0].slice(0,10);
        var otuLabels = filteredDataset.map(d => d.otu_labels);
        var slicedOtuLabels = otuLabels[0].slice(0,10);
    
        return([slicedOtuIds, otuIdString, slicedSampleValues, slicedOtuLabels]);
    };

    // function to update bar chart when new subject ID is selected
    function updateBarChart(subjectId){

        // Console log Selected ID
        console.log(`Selected ID: ${subjectId}`);

        var trace1 = {
            x: filterData(subjectId)[2].reverse(),
            y: filterData(subjectId)[1].reverse(),
            text: filterData(subjectId)[3],
            type: "bar",
            orientation: "h"
        };

        var data = [trace1];
        var layout = {
            title: "Bar Chart - Top 10 OTU for Selected Subject ID",
            xaxis: {title: "Sample Values"}, 
            yaxis: {title: "OTU"},
            height: 600,
            width: 1200,
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 50
            }
        };

        Plotly.newPlot("bar", data, layout);
    };

    // function to update bubble chart when new subject ID is selected
    function updateBubbleChart(subjectId){
        var trace2 = {
            x: filterData(subjectId)[0],
            y: filterData(subjectId)[2],
            text: filterData(subjectId)[3],
            mode: "markers",
            marker: {
                size: filterData(subjectId)[2],
                color: filterData(subjectId)[0],
                opacity: 0.85
            }
        };

        var data = [trace2];
        var layout = {
            title: "Bubble Chart - Top 10 OTU for Selected Subject ID",
            xaxis: {title: "OTU"},
            yaxis: {title: "Sample Values"},
            height: 800,
            width: 1200,
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 50
            }
        };

        Plotly.newPlot("bubble", data, layout);
    };

    // function to update demographic info box
    function updateDemographicInfo(subjectId){

        var metadata = data.metadata;

        d3.selectAll(".panel-body > h5").remove()

        var filteredMetadata = metadata.filter(d => d.id === subjectId)[0]

        Object.entries(filteredMetadata).forEach(function([k,i]){
            d3.selectAll(".panel-body").append("h5").html("<strong>" + k + ": " + i + "<strong>");
        });
    };

    //initial function, set to ID = 940
    function init(){
        updateBarChart("940");
        updateBubbleChart("940");
        updateDemographicInfo(940);
    };

    init();

});





