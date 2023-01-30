const { SESSION, FS } = require('../server');

const companyMnAData = FS.readFileSync('../data/CompanyAcquisition.json');
const companyMnADetails = JSON.parse(companyMnAData);
const tx = SESSION.beginTransaction();

companyMnADetails.forEach(companyMnA => {
  parent_co = companyMnA['parent_company_id']
  mna_co = companyMnA['acquired_company_id']
  m_or_a = companyMnA['merged_into_parent_company']
  query = 'MATCH (c1:Company), (c2:Company) WHERE c1.company_id = ' + parent_co + ' AND c2.company_id = ' + mna_co + ' CREATE (c1)-[m:acquired]->(c2) SET m.did_merge = ' + m_or_a
  tx.run(query)
});

tx.commit().then(() => SESSION.close()).then(() => process.exit());