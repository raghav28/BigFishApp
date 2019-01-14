/*************************************************************************/
/*                                                                       */
/*  ANGULAR JS - communicates with client side (aka. html)               */
/*                                                                       */
/*  AUTHORS:                                                             */
/*  Queries 1 & 8:   Bhavna Saluja                                       */
/*  Queries 2 & 5:   Raghavender Vedire                                  */
/*  Queries 3 & 4:   Alice Chao                                          */  
/*  Queries 6 & 7:   Sanjana Prakash                                     */
/*                                                                       */
/*************************************************************************/

var app = angular.module('angularjsNodejsTutorial',[]);


/*************************************************************************/
/*                                                                       */
/*  CONTROLLER FOR QUERY TIMES                                           */
/*                                                                       */
/*************************************************************************/


app.controller('showQueryTimeController', function ($scope,$http){

    $scope.DoHide = true;
    queryList = [];
    console.log("entered");
    queryList.push('query1');
    queryList.push('query2');
    queryList.push('query3');
    queryList.push('query4');
    queryList.push('query5');
    queryList.push('query6');
    queryList.push('query7');
    queryList.push('query8');
    $scope.queryList = queryList;

    $scope.Submit = function(){
        querynames = [];
        querytimes = [];
        var request = $http.get('/query/mongo');
        request.success(function(data){
            console.log('got response Bhavna');
            $scope.DoHide = false;
            console.log(data);
            for(i=0;i<data.length;i++)
            {
                querynames.push(data[i].query_num);
                console.log(data[i].query_num);
                querytimes.push(data[i].performanceTime);
                   
            } 

            $scope.querynames = queryList;
            $scope.querytimes = querytimes;
            var json_res = {};
            querynames.forEach((queryname, i) => json_res[queryname] = querytimes[i]);
            console.log(json_res);
            console.log(querynames);
            $scope.json_res = json_res;
             var trace1 = {          // category 
                  x: queryList,
                  y: querytimes,
                  type: 'bar'
                };

            var dataForGraph = [trace1];
            var layout = {barmode: 'stack'};

            Plotly.newPlot('image_holder', dataForGraph, layout);

        });
        request.error(function(data){
            console.log('err');
        });

    };


});




/*************************************************************************/
/*                                                                       */
/*  CONTROLLER FOR QUERY 1                                               */
/*                                                                       */
/*************************************************************************/


app.controller('query1', function ($scope,$http){
    $scope.DoHide = true; 
    var familyList = [];
    console.log('aaa');
    // $scope.Parents = "Parent Company";
    // $scope.Children = "Child Company";
    var request = $http.get('/getFamily');
            request.success(function(data){
            console.log('got response');
            var parentList = [];
            for (x =0;x<data.length;x++)
            {
                familyList.push(data[x]);
                parentList.push(data[x].ParentCompany)
            }
            $scope.familymembers = familyList;
            parentUniqueList = parentList.filter(onlyUnique);
            $scope.parentUniqueList = parentUniqueList;

        });
        request.error(function(data){
            console.log('err');
        });

    $scope.Change = function(parentItem){

        childrenList = [];
        for(x=0;x<familyList.length;x++)
        {
        if(familyList[x].ParentCompany === parentItem)
        {
            childrenList.push(familyList[x].ChildCompany);
        }
        }    

        $scope.childrenList = childrenList;
    };

    $scope.Submit = function(parentCompany,childCompany){
        console.log(parentCompany);
        console.log(childCompany);
        var request = $http.get('/query1/parent/'+parentCompany+'/child/'+childCompany);
        request.success(function(data){
            console.log('got response');
            $scope.DoHide = false;
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });

    };

});






/*************************************************************************/
/*                                                                       */
/*  CONTROLLER FOR QUERY 2                                               */
/*                                                                       */
/*************************************************************************/


app.controller('myController', function($scope, $http) {
        $scope.message="";
        $scope.Submit = function() {
        //console.log('entered with'+ $scope.email);
        var request = $http.get('/data/'+$scope.email);
        request.success(function(data) {
            console.log('got response');
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    }; 
});


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

// // usage example:
// var a = ['a', 1, 'a', 2, '1'];
// var unique = a.filter( onlyUnique );

app.controller('showfamilyController', function ($scope,$http){

        $scope.DoHide = true;
            var familyList = [];
        var request = $http.get('/getFamily');
            request.success(function(data){
            console.log('got response');
            var parentList = [];
            for (x =0;x<data.length;x++)
            {
                familyList.push(data[x]);
                parentList.push(data[x].ParentCompany)
            }
            $scope.familymembers = familyList;
            parentUniqueList = parentList.filter(onlyUnique);
            $scope.parentUniqueList = parentUniqueList;

        });
        request.error(function(data){
            console.log('err');
        });

    $scope.Change = function(parentItem){

        childrenList = [];
        console.log("entered");
        //$scope.childrenList = familyList.get(parentItem.x);
        //console.log(parentItem);
        for(x=0;x<familyList.length;x++)
        {
        //console.log(familyList[x].ParentCompany);
        if(familyList[x].ParentCompany === parentItem)
        {
        //console.log(familyList[x].ChildCompany);
        childrenList.push(familyList[x].ChildCompany);
        }
        }    

        $scope.childrenList = childrenList;

    };

    $scope.ShowFamily = function(parentCompany,childCompany){
        $scope.DoHide = false;
        console.log(parentCompany);
        console.log(childCompany);
        $scope.Category = "Category";
        $scope.number_patents = "Number of Patents";
        var request = $http.get('/query2/parent/'+parentCompany+'/child/'+childCompany);
        request.success(function(data){
            console.log('got response');
              if(childCompany != undefined && childCompany != 'undefined')
                {
                $scope.parentdata = data[0];
                $scope.childdata = data[1];
                }
                else
                {
                   $scope.parentdata = data; 
                }

        });
        request.error(function(data){
            console.log('error occurred');
        });

    };


    $scope.ShowPie = function(parentCompany,childCompany){
        $scope.parentImage = '/piecharts/Plots/'+parentCompany+'.png';
        $scope.childImage = '/piecharts/Plots/'+childCompany+'.png';
        console.log($scope.parentImage);
        $scope.DoHide = false;

    };

});






/*************************************************************************/
/*                                                                       */
/*  CONTROLLER FOR QUERY 3                                               */
/*                                                                       */
/*************************************************************************/

app.controller('query3', function($scope, $http) {
    $scope.Hide = true;
    $scope.message="";

    // populating drop down menu
    var request = $http.get('/parentCo');

    request.success(function(data) {
        $scope.data = data;
        console.log("$scope.data is "+JSON.stringify($scope.data));
    });

    request.error(function(data){
        console.log('err');
    });

    // submit button functionality
    $scope.Submit = function() {    

        yearList = [];
        categoryList = [];
        categoryValue = [];
        categoryDesc= [];
        allData = [];
        var request = $http.get('/parentCo/'+$scope.selectedCo);
        console.log("selectedCompany is: " + $scope.selectedCo);

        request.success(function(answer) {
            $scope.Hide = false;
            $scope.answer = answer;

            // arrayify the results table:
            for(i=0;i<answer.length;i++) {
                yearList.push(answer[i].year);          //x
                categoryList.push(answer[i].id);        // series "name"
                categoryValue.push(answer[i].count);    //y
                categoryDesc.push(answer[i].title);     //for legend
            }                            
            console.log(yearList);
            console.log(categoryList);
            console.log(categoryValue);

            // making the graph legend:
            categoryListUnique = categoryList.filter(onlyUnique);
            categoryDescUnique = categoryDesc.filter(onlyUnique);

            legend = [];
            for (i=0; i<categoryListUnique.length; i++) {
                var tuple = {
                    id: categoryListUnique[i],
                    title: categoryDescUnique[i]
                }
                legend.push(tuple);
            }

            $scope.legend = legend;

            // making the graph:
            data = [];
                
            for (j=0; j<categoryListUnique.length; j++) {
                xData = [];
                yData = [];
                for (i=1; i<categoryList.length; i++) {  
                    console.log(categoryList[i]+"==?"+categoryListUnique[j]);

                    if (categoryList[i] == categoryListUnique[j]) {
                        xData.push(yearList[i]);
                        if (categoryList[i].org == categoryList[i-1].org) {   
                            yData.push(categoryValue[i]);
                        } else {
                            yData.push(0);
                        }
                    }
                        
                }    
                var trace = {
                    x: xData,
                    y: yData,
                    name: categoryListUnique[j],
                    type: 'bar'
                }
                data.push(trace);  
                console.log(JSON.stringify(trace));  
            }
                                
            console.log(data.length + " vs. " + categoryListUnique.length);
            var layout = {barmode: 'stack',
                          title: $scope.selectedCo+'\'s Yearly Patent Filing Categories',
                          titlefont: {
                                family: 'helvetica',
                                size: 15},
                          xaxis: {
                              autotick: false,
                              tick0: 0,
                              ticklen: 0,
                            }  
                          };

            Plotly.newPlot('myDiv2', data, layout);

        });

        request.error(function(answer){
            console.log('err');
        });
    };

});




/*************************************************************************/
/*                                                                       */
/*  CONTROLLER FOR QUERY 4                                               */
/*                                                                       */
/*************************************************************************/


/* Controller for "query4" page */
app.controller('query4', function($scope, $http) {
    $scope.message="";

    // populating drop down menu
    var request = $http.get('/q4/parentCo');

    request.success(function(data) {
        $scope.data = data;
        console.log("$scope.data is "+JSON.stringify($scope.data));
    });

    request.error(function(data){
        console.log('err');
    });

    // submit button functionality
    $scope.Submit = function() {    

        orgListPar = [];
        latListPar = [];
        lonListPar = [];
        orgListChild = [];
        latListChild = [];
        lonListChild = [];

        var request = $http.get('/q4/parentCo/'+$scope.selectedCo);
        console.log("selectedCompany is: " + $scope.selectedCo);

        request.success(function(answer) {
            $scope.answer = answer;
            var parent = $scope.selectedCo;

            for(i=0;i<answer.length;i++) {
                if (answer[i].org != parent) {
                    console.log(answer[i].org+" vs. "+parent);
                    orgListChild.push(answer[i].org);
                    latListChild.push(answer[i].lat);
                    lonListChild.push(answer[i].lon);
                } else {
                    orgListPar.push(answer[i].org);
                    latListPar.push(answer[i].lat);
                    lonListPar.push(answer[i].lon);
                }
            }                    

            // console.log(orgListPar);
            // console.log(latListPar); 
            // console.log(orgListChild);       

            var data = [{
                type: 'scattergeo',
                mode: 'markers',
                text: orgListPar,
                lon: lonListPar,
                lat: latListPar,
                marker: {
                    opacity:0.6,
                    size: 10,
                    color: '#333F50',   // dark grey, purple #bebada
                    line: {
                        width: 0
                    }
                },
                name: parent,
                textposition: 'bottom'
            },{
               type: 'scattergeo',
                mode: 'markers',
                text: orgListChild,
                lon: lonListChild,
                lat: latListChild,
                
                marker: {
                    opacity:0.9,
                    size: 5,
                    color: '#FFC000',   // gold
                    line: {
                        width: 1,
                        color: '#777777'
                    }
                },
                name: 'Acquisitions',
                textposition: 'bottom' 
            }];

            var layout = {
                font: {
                    family: 'Arial',
                    size: 12
                },
                geo: {
                    autosize: true,
                    // width: 1000,
                    // height: 800,
                    plot_bgcolor: '',
                    paper_bgcolor: '',
                    scope: 'usa',
                    resolution: 50,
                    showrivers: false,
                    rivercolor: '#fff',
                    showlakes: true,
                    lakecolor: '#fff',
                    showland: true,
                    landcolor: '#E2EAF2',   // greyblue; sage #D4EBE5
                    countrycolor: '#d3d3d3',
                    countrywidth: 10,
                    subunitcolor: '#d3d3d3'
                }
                
            };

            Plotly.newPlot('myDiv', data, layout);
        // }

        });
        request.error(function(answer){
            console.log('err');
        });
    };

});


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}



/*************************************************************************/
/*                                                                       */
/*  CONTROLLER FOR QUERY 5                                               */
/*                                                                       */
/*************************************************************************/



















/*************************************************************************/
/*                                                                       */
/*  CONTROLLER FOR QUERY 6                                               */
/*                                                                       */
/*************************************************************************/


app.controller('showQuery6Controller', function ($scope,$http){
  var companies = {};
  $http.get('/getQuery6b')
    .success(function(data){
      $scope.companies = data;
    })
    .error(function(data){
      console.log('error retrieving companies');
    });
  $scope.ShowResultsA = function(){
    var dataList = [];
    var request = $http.get('/getQuery6a');
            request.success(function(data){
            console.log('got response');
            for (x =0;x<data.length;x++)
            {
                dataList.push(data[x]);
            }
            $scope.dataList = dataList;
            $scope.colHeading = 'Year';
            $scope.colHeading2 = 'Number of Acquisitions';
        });
        request.error(function(data){
            console.log('err');
        });
  };

  $scope.ShowResultsB = function(company){
        var dataList = [];
        console.log(company);
        var url= '/getQuery6b';
        if(company !== undefined && company !== null){
          url = url+'?company=' + company;
        }
        request = $http.get(url);
                request.success(function(data){
                console.log('got response');
                for (x =0;x<data.length;x++)
                {
                    dataList.push(data[x]);
                }
                $scope.dataList = dataList;
                $scope.colHeading = 'Company';
                $scope.colHeading2 = 'Number of Acquisitions';
            });
            request.error(function(data){
                console.log('err');
            });
  };
});



/*************************************************************************/
/*                                                                       */
/*  CONTROLLER FOR QUERY 7                                               */
/*                                                                       */
/*************************************************************************/

app.controller('showQuery7Controller', function ($scope,$http){
  $scope.orderby= "5";
  $scope.ShowResultsA = function(){
    var dataList = [];
    var request = $http.get('/getQuery7a');
            request.success(function(data){
            console.log('got response');
            for (x =0;x<data.length;x++)
            {
                dataList.push(data[x]);
            }
            $scope.dataList = dataList;
            $scope.colHeading = 'CPC Group Id';
            $scope.colHeading2 = 'Class Description';
            $scope.colHeading3 = '';
        });
        request.error(function(data){
            console.log('err');
        });
  };

  $scope.ShowResultsB = function(orderby){
        var dataList = [];
        request = $http.get('/getQuery7b?orderby=' +orderby);
                request.success(function(data){
                console.log('got response');
                for (x =0;x<data.length;x++)
                {
                    dataList.push(data[x]);
                }
                $scope.dataList = dataList;
                $scope.colHeading = 'CPC Group Id';
                $scope.colHeading2 = 'Class Description';
                $scope.colHeading3 = 'Number of Renewals';
            });
            request.error(function(data){
                console.log('err');
            });
  };

});






/*************************************************************************/
/*                                                                       */
/*  CONTROLLER FOR QUERY 8                                               */
/*                                                                       */
/*************************************************************************/

app.controller('query8', function ($scope,$http){
    $scope.DoHide = true;
    childrenList = [];
    console.log("entered");
    childrenList.push('Machine Learning');
    childrenList.push('Natural Language Processing');
    childrenList.push('Data Mining');
    childrenList.push('Virtual Reality');
    childrenList.push('Computer Vision');
    childrenList.push('Autonomous Driving');
    childrenList.push('Image Processing');
    childrenList.push('Search Engine');
    childrenList.push('Speech Recognition');
    childrenList.push('Operating System');
    childrenList.push('Machine Translation');
    childrenList.push('Predictive Modeling');
    childrenList.push('Recommender System');
    childrenList.push('Data Analysis');
    childrenList.push('Big Data');
    childrenList.push('Data Management');
    childrenList.push('Cloud Computing');
    childrenList.push('Grid Computing');
    childrenList.push('Parallel Computing');
    childrenList.push('Deep Learning');
    childrenList.push('Reinforcement Learning');
    childrenList.push('Networked System');
    childrenList.push('Linguistic');
    childrenList.push('Robotic');
    childrenList.push('Computer Architecture');
    childrenList.push('Crowd Sourcing');
    childrenList.push('Software Systems');
    childrenList.push('Computational Linguistic');
    childrenList.push('Embedded Systems');
    childrenList.push('Mobile Communication');
    childrenList.push('Information System');
    childrenList.push('Cryptography');
    childrenList.push('Computer Graphics');
    childrenList.push('Business Intelligence');
    childrenList.push('Automata');
    childrenList.push('Animation');

    $scope.childrenList = childrenList;

    $scope.Submit = function(childCompany){
        console.log(childCompany);
        companyNames = [];
        patentCounts = [];
        var request = $http.get('/query8/child/'+childCompany);
        request.success(function(data){
            console.log('got response Bhavna');
            $scope.DoHide = false;
            $scope.dataTable = data[0];
            $scope.dataGraph = data[1];
            console.log('dataGraph saved');

            for(i=0;i<data[1].length;i++) {
                companyNames.push(data[1][i].org);
                patentCounts.push(data[1][i].patent_count);
            }  

             var trace1 = {          // category 
                  x: companyNames,
                  y: patentCounts,
                  type: 'bar'
                };

            var dataForGraph = [trace1];
            var layout = {barmode: 'stack'};

            Plotly.newPlot('image_holder', dataForGraph, layout);

        });
        request.error(function(data){
            console.log('err');
        });

    };

});











