const { SESSION } = require('./server');
const express = require('express');
const app = express();
const PORT = 3333;

app.get('/api/acquired', async (req, res)=>{

  const query = 'MATCH (c:Company) WHERE c.company_name CONTAINS \'' + req.query.companyName + '\' WITH c MATCH (c) <- [:acquired] - (c1:Company) RETURN c1';
  const result = await SESSION.executeRead(tx => tx.run(query))
  const records = result.records
  const companyNames = []
  
  for (let i = 0; i < records.length; i++) {
    const companyName = records[i].get(0).properties.company_name
    companyNames.push(companyName)
  }
  res.send(companyNames)
})

app.get('/api/related', async (req, res)=>{

  const query = 'MATCH (c:Company) WHERE c.company_name CONTAINS \'' + req.query.companyName + '\' WITH c MATCH (c) - [:acquired] - (c1:Company) RETURN c1';
  const result = await SESSION.executeRead(tx => tx.run(query))
  const records = result.records
  const companyNames = []

  for (let i = 0; i < records.length; i++) {
    const companyName = records[i].get(0).properties.company_name
    companyNames.push(companyName)
  }

  res.send(companyNames)
})

app.get('/api/currentEmployees', async (req, res)=>{

  const query = 'MATCH (c:Company) WHERE c.company_name CONTAINS \'' + req.query.companyName + '\' WITH c MATCH (c) <- [:works_at] - (p:Person) RETURN p';
  const result = await SESSION.executeRead(tx => tx.run(query))
  const records = result.records
  const employeeIDs = []

  for (let i = 0; i < records.length; i++) {
    const employeeID = records[i].get(0).properties.person_id.low
    employeeIDs.push(employeeID)
  }

  res.send(employeeIDs)
})

app.get('/api/exCurrentEmployees', async (req, res)=>{

  const exEmployeeQuery = 'MATCH (c:Company) WHERE c.company_name CONTAINS \'' + req.query.exCompany + '\' WITH c MATCH (c) <- [:ex_employee] - (p:Person) RETURN p';
  const result = await SESSION.executeRead(tx => tx.run(exEmployeeQuery))
  const records = result.records
  const employeeIDs = []

  for (let i = 0; i < records.length; i++) {
    const employeeID = records[i].get(0).properties.person_id.low
    employeeIDs.push(employeeID)
  }

  const currEmployeeIDs = []

  for (let i = 0; i < employeeIDs.length; i++) {

    const currEmployeeQuery = 'MATCH (c:Company) WHERE c.company_name CONTAINS \'' + req.query.currCompany + '\' WITH c MATCH (c) <- [:works_at] - (p:Person{person_id:' + employeeIDs[0] + '}) RETURN p';
    const resultFinal = await SESSION.executeRead(tx => tx.run(currEmployeeQuery))
    const recordsFinal = resultFinal.records

    for (let i = 0; i < recordsFinal.length; i++) {
      const currEmployeeID = recordsFinal[i].get(0).properties.person_id.low
      currEmployeeIDs.push(currEmployeeID)
    }
  }

  res.send(currEmployeeIDs)
})

app.listen(
  PORT,
  () => console.log('Server running on',PORT)
);