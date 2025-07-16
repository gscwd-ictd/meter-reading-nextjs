import sql from "mssql";

const sqlConfig: sql.config = {
  server: "172.20.110.135",
  user: "sa",
  password: "wdgsc@cml87",
  database: "GSCWD_TUBSplus",
  port: 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const mssqlConn = await sql.connect(sqlConfig);

export default mssqlConn;
