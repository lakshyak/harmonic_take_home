const { SESSION, FS } = require('../server');

const employeeData = FS.readFileSync('../data/PersonEmployment.json');
const employeeDetails = JSON.parse(employeeData);
const tx = SESSION.beginTransaction();

employeeDetails.forEach(employee => {
  company_id = employee['company_id']
  person_id = employee['person_id']
  employment_title = employee['employment_title']
  start_date = employee['start_date']
  end_date = employee['end_date']
  if (end_date == undefined) {
    query = 'MATCH (c:Company{company_id:' + company_id + 
            '}) MERGE (p:Person{person_id:' + person_id + 
            '}) CREATE (p)-[w:works_at]->(c) SET w.employment_title = \'' + employment_title + '\''
    if (start_date != undefined) {
      query += ',  w.start_date = apoc.date.format(apoc.date.parse(\'' + start_date + '\'), \'ms\', \'yyyy-MM-dd HH:mm:SS\')'
    }
  } else {
    query = 'MATCH (c:Company{company_id:' + company_id + 
            '}) MERGE (p:Person{person_id:' + person_id + 
            '}) CREATE (p)-[e:ex_employee]->(c) SET e.employment_title = \'' + employment_title + 
            '\', e.end_date = apoc.date.format(apoc.date.parse(\'' + end_date + '\'), \'ms\', \'yyyy-MM-dd HH:mm:SS\')'
    if (start_date != undefined) {
      query += ',  e.start_date = apoc.date.format(apoc.date.parse(\'' + start_date + '\'), \'ms\', \'yyyy-MM-dd HH:mm:SS\')'
    }
  }
  tx.run(query)
});

tx.commit().then(() => SESSION.close()).then(() => process.exit());