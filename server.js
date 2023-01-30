const neo4j = require('neo4j-driver')

const username = 'neo4j'
const password = '12345678'
const url = 'bolt://127.0.0.1:7687'

const driver = neo4j.driver(
  url, 
  neo4j.auth.basic(username, password)
);

const SESSION = driver.session();
const FS = require('fs');

exports.FS = FS
exports.SESSION = SESSION