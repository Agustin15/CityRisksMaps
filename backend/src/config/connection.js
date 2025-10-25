import sql from "mssql";

class Connection {
  pool;

  constructor() {
    try {
      this.pool = new sql.ConnectionPool({
        user: "root",
        password: "Dudu22558899@",
        server: "DESKTOP-KC4CI4O",
        database: "CityRiskMap",
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000
        },
        options: {
          encrypt: true,
          trustServerCertificate: true
        }
      });
    } catch (error) {
      throw error;
    }
  }
}

export const connection = new Connection();
