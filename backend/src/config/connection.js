import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

class Connection {
  #password;
  #user;
  #localhost;
  #database;
  pool;

  constructor() {
    try {
      this.propUser = process.env.DATABASE_USER;
      this.propPassword = process.env.DATABASE_PASSWORD;
      this.propDatabase = process.env.DATABASE_NAME;
      this.propHost = process.env.DATABASE_LOCALHOST;

      this.#createConnetion();
    } catch (error) {
      throw error;
    }
  }

  set propHost(value) {
    if (!value) throw new Error("Variable Localhost no declarada");
    this.#localhost = value;
  }

  get propHost() {
    return this.#localhost;
  }
  set propUser(value) {
    if (!value) throw new Error("Variable User no declarada");
    this.#user = value;
  }

  get propUser() {
    return this.#user;
  }

  set propPassword(value) {
    if (!value) throw new Error("Variable Password no declarada");
    this.#password = value;
  }

  get propPassword() {
    return this.#password;
  }

  set propDatabase(value) {
    if (!value) throw new Error("Variable Database no declarada");
    this.#database = value;
  }

  get propDatabase() {
    return this.#database;
  }

  async #createConnetion() {
    this.pool = new sql.ConnectionPool({
      user: this.propUser,
      password: this.propPassword,
      server: this.propHost,
      database: this.propDatabase,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: true,
        trustServerCertificate:true
      }
    });
    await this.pool.connect();
  }
}

export const connection = new Connection();
