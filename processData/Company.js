const { SESSION, FS } = require('../server');

const companiesData = FS.readFileSync('../data/Companies.json');
const companyDetails = JSON.parse(companiesData);
const tx = SESSION.beginTransaction();

companyDetails.forEach(company => {
  company_id = company['company_id']
  company_name = company['company_name']
  headcount = company['headcount']
  query = 'CREATE (c:Company {company_id: ' + company_id + ', company_name: \'' + company_name.replace('\'', '\\\'') + '\', headcount: ' + headcount + '})'
  tx.run(query)
});

tx.commit().then(() => SESSION.close()).then(() => process.exit());