/*************************************************************************/
/*                                                                       */
/*  NODE JS - communicates with server side (aka. MySQL)                 */
/*                                                                       */
/*  AUTHORS:                                                             */
/*  Queries 1 & 8:   Bhavna Saluja                                       */
/*  Queries 2 & 5:   Raghavender Vedire                                  */
/*  Queries 3 & 4:   Alice Chao                                          */
/*  Queries 6 & 7:   Sanjana Prakash                                     */
/*                                                                       */
/*************************************************************************/

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/nobel';
const client = new MongoClient(uri);
const connectionMongo = client.connect();  // initialized connection


var express = require('express');
var router = express.Router();
var path = require('path');


// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  // host     : 'localhost',
  // port     : '3306',
  // user     : 'root',
  // password : 'bigfish550',
  // multipleStatements: true,
  // database : 'project'
  host     : 'cis550dbinstance.cshxgaetjcqm.us-east-1.rds.amazonaws.com',
  user     : 'cis550',
  password : 'bigfish550',
  database : 'patentdb',
  multipleStatements: true
});









































// DON'T SCROLL ABOVE HERE BECAUSE PASSWORDS //////////////////////////////////////////////////////////











/*************************************************************************/
/*                                                                       */
/*  Route handler for navigation bar                                     */
/*                                                                       */
/*************************************************************************/

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/query1', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','views','query1.html'));
});

router.get('/query2', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','views','query2.html'));
});

router.get('/query3', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','views','query3.html'));
});

router.get('/query4', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','views','query4.html'));
});

router.get('/query5', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','views','query5.html'));
});

router.get('/query6', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','views','query6.html'));
});

router.get('/query7', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','views','query7.html'));
});

router.get('/query8', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','views','query8.html'));
});

router.get('/query_times', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','views','querytimes.html'));
});


/*************************************************************************/
/*                                                                       */
/*  Route handlers for query times                                       */
/*                                                                       */
/*************************************************************************/


router.get('/query/mongo', function(req, res){
  //var query = 'with temp as (select patent_id from bassignee where organization = "' + req.params.parentcompany + '") select patent.patent_id, patent.title, patent.date from temp join patent where temp.patent_id = patent.patent_id and patent.title like "%'+ req.params.childcompany + '%" ORDER BY date DESC';

  MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nobel");
  dbo.collection("querytimes").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    //console.log(result);
    db.close();
  });
});
});






/*************************************************************************/
/*                                                                       */
/*  Route handlers  for "query1" page                                    */
/*                                                                       */
/*************************************************************************/


router.get('/query1/parent/:parentcompany/child/:childcompany', function(req, res){
  console.log("inside query1");

  var date = new Date();
  var start = new Date().getTime();
  const connect = connectionMongo;

  // var query = 'SELECT * from patent WHERE patent_id="' + req.params.parentcompany + '"';
  var query = 'select assignee.org, patent.patent_id, patent.title, patent.date, patent.num_claims from assignee JOIN patent ON assignee.patent_id = patent.patent_id WHERE assignee.org = "' + req.params.parentcompany + '" ORDER BY date DESC';
  if(!(req.params.childcompany === undefined || req.params.childcompany === 'undefined' || req.params.childcompany === ''))
  {
    query = 'select assignee.org, patent.patent_id, patent.title, patent.date, patent.num_claims from assignee JOIN patent ON assignee.patent_id = patent.patent_id WHERE assignee.org = "' + req.params.childcompany + '" ORDER BY date DESC';
  }
  // note that email parameter in the request can be accessed using "req.params.email"
  console.log(query);
  connection.query(query,function(err, rows, fields){
  if(err)
  {
    console.log(err);
    console.log('error occurred!!');
  }
  else{
    res.json(rows);
  }
 });

  var end = new Date().getTime();
  performanceTime = end - start;
  console.log("start = " + start);
  console.log("end = " + end);
  console.log("performanceTime = " + performanceTime);

  console.log("hello mongo1");
  connect.then(() => {
        const doc = {query_num:1,start_time:start,end_time:end,performanceTime:(performanceTime/100)};
        const db = client.db('nobel');
        const coll = db.collection('querytimes');
        coll.insertOne(doc, (err, result) => {
            if(err) throw err;
        });
    });
    console.log("hello mongo6");

 });





/*************************************************************************/
/*                                                                       */
/*  Route handler for "query2" page                                      */
/*                                                                       */
/*************************************************************************/


var del = connection._protocol._delegateError;
connection._protocol._delegateError = function(err, sequence){
  if (err.fatal) {
    console.trace('fatal error: ' + err.message);
  }
  return del.call(this, err, sequence);
};


router.get('/getFamily', function(req, res){
 var query = 'select ParentCompany,ChildCompany from acquisitions;';
 connection.query(query,function(err, rows, fields){
  if(err) console.log(err);
  else{
    res.json(rows);
  }

 });
 });


 router.get('/query2/parent/:parentcompany/child/:childcompany', function(req, res){
  console.log('abcabc');

  var start = new Date().getTime();
  const connect = connectionMongo;

  childcompany = req.params.childcompany;
  parentcompany = req.params.parentcompany;
  if(childcompany != undefined && childcompany != 'undefined')
  {
    if(parentcompany != undefined && parentcompany != 'undefined')
    {
      //query on child company
      //with temp as (select patent_id from bassignee where organization = 'Google’)select distinct subsection.title, count(subsection.id)from temp,cpc_current,subsection where temp.patent_id = cpc_current.patent_id and cpc_current.subsection_id = subsection.id group by subsection.title order by count(subsection.id) desc limit 10;
      //var query = 'with temp as(select patent_id from bassignee where organization = \''+req.params.childcompany+'\')select distinct subsection.title, count(subsection.id) as count from temp,cpc_current,subsection where temp.patent_id = cpc_current.patent_id and cpc_current.subsection_id = subsection.id group by subsection.title order by count(subsection.id) desc limit 10;';
    connection.query("select distinct subsection.title, count(subsection.id) as count from assignee, cpc_current,subsection where assignee.org = \'"+ req.params.parentcompany +"\' and assignee.patent_id = cpc_current.patent_id and cpc_current.subsection_id = subsection.id group by subsection.title order by count(subsection.id) desc limit 10; select distinct subsection.title, count(subsection.id) as count from assignee,cpc_current,subsection where assignee.org = \'"+req.params.childcompany+"\'and assignee.patent_id = cpc_current.patent_id and cpc_current.subsection_id = subsection.id group by subsection.title order by count(subsection.id) desc limit 10;",function(err, rows, fields){
    if(err)
      {
      console.log(err);
      }
    else{
      res.send(rows);
      console.log('xxxxyyyy');
      console.log(res);
    }

    });

    }

  }
  else
  {
      //query on parent company
    var query = "select distinct subsection.title, count(subsection.id) as count from assignee, cpc_current,subsection where assignee.org = \'"+ req.params.parentcompany +"\' and assignee.patent_id = cpc_current.patent_id and cpc_current.subsection_id = subsection.id group by subsection.title order by count(subsection.id) desc limit 10\;";
    connection.query(query,function(err, rows, fields){
    if(err)
    {
      console.log(err);
    }
    else{
    console.log('qwerty');
    res.json(rows);
    console.log(res);
    }
 });

  }
  //with temp as (select patent_id from bassignee where organization = 'Google’)select distinct subsection.title, count(subsection.id)from temp,cpc_current,subsection where temp.patent_id = cpc_current.patent_id and cpc_current.subsection_id = subsection.id group by subsection.title order by count(subsection.id) desc limit 10;


  var end = new Date().getTime();
  performanceTime = end - start;
  console.log("start = " + start);
  console.log("end = " + end);
  console.log("performanceTime = " + performanceTime);

  console.log("hello mongo1");
  connect.then(() => {
        const doc = {query_num:2,start_time:start,end_time:end,performanceTime:(performanceTime/100)};
        const db = client.db('nobel');
        const coll = db.collection('querytimes');
        coll.insertOne(doc, (err, result) => {
            if(err) throw err;
        });
  });
  console.log("hello mongo6");


 });







/*************************************************************************/
/*                                                                       */
/*  Route handler for "query3" page >> populating parent drop down menu  */
/*                                                                       */
/*************************************************************************/

router.get('/parentCo', function(req,res) {

  var query = 'SELECT * FROM parentCompanies';
  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

});


/*  Route handler for "query3" page >> button  */


router.get('/parentCo/:selectedCo', function(req,res) {

  var start = new Date().getTime();
  const connect = connectionMongo;

  var company = req.params.selectedCo;
  console.log("selected parent company is... "+company);

  // slow query
  // var query = 'SELECT g.id, p.year, count(*) as count, g.title FROM project.assignee a, project.patent p, project.group g, project.cpc_current cpc WHERE a.org = "'+company+'" AND a.patent_id = p.patent_id AND p.patent_id = cpc.patent_id AND cpc.group_id = g.id AND a.patent_id = cpc.patent_id GROUP BY g.id, p.year order by g.id, p.year asc';

  // faster query
  var query = 'SELECT g.id, count(*) as count, p.year, g.title FROM (select assignee_id, patent_id from assignee where org = "'+company+'") a JOIN (select patent_id, year FROM patent) p ON a.patent_id = p.patent_id JOIN (select patent_id, group_id FROM cpc_current) cpc ON p.patent_id = cpc.patent_id AND a.patent_id = cpc.patent_id JOIN cpc_group g ON cpc.group_id = g.id GROUP BY g.id, p.year ORDER BY g.id, p.year ASC';

  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

  var end = new Date().getTime();
  performanceTime = end - start;
  connect.then(() => {
        const doc = {query_num:3,start_time:start,end_time:end,performanceTime:(performanceTime/100)};
        const db = client.db('nobel');
        const coll = db.collection('querytimes');
        coll.insertOne(doc, (err, result) => {
            if(err) throw err;
        });
    });
  console.log('finished');

});




/*************************************************************************/
/*                                                                       */
/*  Route handler for "query4" page >>                                   */
/*                                                                       */
/*************************************************************************/

router.get('/q4/parentCo', function(req,res) {

  var query = 'SELECT * FROM parentCompanies';
  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

});


/*  Route handler for "query4" page >> button  */


router.get('/q4/parentCo/:selectedCo', function(req,res) {

  var start = new Date().getTime();
  const connect = connectionMongo;

  var company = req.params.selectedCo;
  console.log("selected parent company is... "+company);

  // slow query
  // var query = 'SELECT DISTINCT a.org as org, l.latitude as lat, l.longitude as lon FROM assignee a, location_assignee la, location l WHERE a.org = "'+company+'" AND a.assignee_id = la.assignee_id AND la.location_id = l.id UNION SELECT DISTINCT a.org as org, l.latitude as lat, l.longitude as lon FROM acquisitions acq, assignee a, location_assignee la, location l WHERE acq.ParentCompany = "'+company+'" AND a.org = acq.ChildCompany AND a.assignee_id = la.assignee_id AND la.location_id = l.id;';

  // faster query
var query = 'SELECT DISTINCT own.org as org, l.latitude as lat, l.longitude as lon FROM (SELECT a1.assignee_id as assignee_id, a1.org as org FROM (SELECT ChildCompany FROM acquisitions WHERE ParentCompany = "'+company+'") acq JOIN (SELECT assignee_id, org FROM assignee) a1 ON a1.org = acq.ChildCompany UNION (SELECT assignee_id, org FROM assignee WHERE org = "'+company+'")) own JOIN location_assignee la on own.assignee_id = la.assignee_id JOIN location l ON la.location_id = l.id';

  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

  var end = new Date().getTime();
  performanceTime = end - start;
  connect.then(() => {
        const doc = {query_num:4,start_time:start,end_time:end,performanceTime:(performanceTime/100)};
        const db = client.db('nobel');
        const coll = db.collection('querytimes');
        coll.insertOne(doc, (err, result) => {
            if(err) throw err;
        });
    });
  console.log('finished');


});


/*************************************************************************/
/*                                                                       */
/*  Route handlers for "query 6"                                         */
/*                                                                       */
/*************************************************************************/

router.get('/getQuery6a', function(req, res){

  var start = new Date().getTime();
  const connect = connectionMongo;

  var query = 'SELECT AcquisitionYear AS "value", count(*) AS "count" ' +
  'FROM acquisitions ' +
  'GROUP BY AcquisitionYear ' +
  'ORDER BY count(*) DESC ' +
  'LIMIT 5;';
  console.log('hello');
  connection.query(query,function(err, rows, fields){
    if(err) console.log(err);
      else{
   res.json(rows);
   //console.log(rows);
      }
    });

  var end = new Date().getTime();
  performanceTime = end - start;
  connect.then(() => {
        const doc = {query_num:61,start_time:start,end_time:end,performanceTime:(performanceTime/100)};
        const db = client.db('nobel');
        const coll = db.collection('querytimes');
        coll.insertOne(doc, (err, result) => {
            if(err) throw err;
        });
    });
  console.log('finished');


});

router.get('/getQuery6b', function(req, res){

  var start = new Date().getTime();
  const connect = connectionMongo;

  var company = req.query['company'];
  var query = '';
  console.log(company);
  if (company === undefined || company === null ){
    query = 'SELECT ParentCompany AS "value", count(*) AS "count" ' +
    'FROM acquisitions ' +
    'WHERE AcquisitionYear >= 1988 AND AcquisitionYear <= 2018 ' +
    'GROUP BY ParentCompany ' +
    'ORDER BY count(*) DESC ' +
    'LIMIT 7;';
  }else {
    query = 'SELECT ParentCompany AS "value", count(*) AS "count" ' +
    'FROM acquisitions ' +
    'WHERE AcquisitionYear >= 1988 AND AcquisitionYear <= 2018 AND ParentCompany = \'' +
    company +
    '\' GROUP BY ParentCompany ' +
    'ORDER BY count(*) DESC ' +
    'LIMIT 7;';
  }

connection.query(query,function(err, rows, fields){
 if(err) console.log(err);
 else{
   res.json(rows);
   //console.log(rows);
 }
});

  var end = new Date().getTime();
  performanceTime = end - start;
  connect.then(() => {
        const doc = {query_num:62,start_time:start,end_time:end,performanceTime:(performanceTime/100)};
        const db = client.db('nobel');
        const coll = db.collection('querytimes');
        coll.insertOne(doc, (err, result) => {
            if(err) throw err;
        });
    });
  console.log('finished');

});


/*************************************************************************/
/*                                                                       */
/*  Route handlers for query 7                                           */
/*                                                                       */
/*************************************************************************/
router.get('/getQuery7a', function(req, res){

  var start = new Date().getTime();
  const connect = connectionMongo;

var query = 'SELECT DISTINCT G.id AS "id", G.title AS "description" ' +
'FROM us_term_of_grant T ' +
'JOIN cpc_current C ON T.patent_id = C.patent_id ' +
'JOIN cpc_group G ON C.group_id = G.id ' +
'WHERE T.disclaimer_date = \'0000-00-00\' ' +
'ORDER BY G.title ' +
'LIMIT 5;';
console.log('hello');
connection.query(query,function(err, rows, fields){
 if(err) console.log(err);
 else{
   res.json(rows);
   //console.log(rows);
 }
});

  var end = new Date().getTime();
  performanceTime = end - start;
  connect.then(() => {
        const doc = {query_num:71,start_time:start,end_time:end,performanceTime:(performanceTime/100)};
        const db = client.db('nobel');
        const coll = db.collection('querytimes');
        coll.insertOne(doc, (err, result) => {
            if(err) throw err;
        });
    });
  console.log('finished');


});

router.get('/getQuery7b', function(req, res){

    var start = new Date().getTime();
    const connect = connectionMongo;

var orderby= req.query['orderby'];
var query = 'SELECT DISTINCT G.id AS "id", G.title AS "description", count(*) AS "count" ' +
'FROM us_term_of_grant T ' +
'JOIN cpc_current C ON T.patent_id = C.patent_id ' +
'JOIN cpc_group G ON C.group_id = G.id ' +
'WHERE T.disclaimer_date = \'0000-00-00\' ' +
'GROUP BY G.id ' +
'ORDER BY count(*) DESC ' +
'LIMIT ' +
orderby + ';';
connection.query(query,function(err, rows, fields){
 if(err) console.log(err);
 else{
   res.json(rows);
   //console.log(rows);
 }
});

  var end = new Date().getTime();
  performanceTime = end - start;
  connect.then(() => {
        const doc = {query_num:72,start_time:start,end_time:end,performanceTime:(performanceTime/100)};
        const db = client.db('nobel');
        const coll = db.collection('querytimes');
        coll.insertOne(doc, (err, result) => {
            if(err) throw err;
        });
    });
  console.log('finished');

});




/*************************************************************************/
/*                                                                       */
/*  Route handlers for query 8                                           */
/*  Raghav and Bhavna                                                    */
/*************************************************************************/



router.get('/query8/child/:childcompany', function(req, res){

  var start = new Date().getTime();
  const connect = connectionMongo;

  console.log("inside query8");
  //var query = 'with temp as (select patent_id from bassignee where organization = "' + req.params.parentcompany + '") select patent.patent_id, patent.title, patent.date from temp join patent where temp.patent_id = patent.patent_id and patent.title like "%'+ req.params.childcompany + '%" ORDER BY date DESC';

  var query = 'select a.org,p.patent_id,p.title,p.date from patent p join assignee a on p.patent_id = a.patent_id where p.title like "%'+ req.params.childcompany + '%" ORDER BY date DESC; select a.org, count(p.patent_id) AS patent_count from patent p join assignee a on p.patent_id = a.patent_id where title like "%'+ req.params.childcompany + '%" GROUP BY org ORDER BY patent_count DESC;';
  console.log(query);

  connection.query(query,function(err, rows, fields){
  if(err)
  {
    console.log(err);
    console.log('error occurred!!');
  }
  else{
    res.send(rows);
  }

 });

  var end = new Date().getTime();
  performanceTime = end - start;
  connect.then(() => {
        const doc = {query_num:8,start_time:start,end_time:end,performanceTime:(performanceTime/100)};
        const db = client.db('nobel');
        const coll = db.collection('querytimes');
        coll.insertOne(doc, (err, result) => {
            if(err) throw err;
        });
    });
  console.log('finished');

 });






module.exports = router;
