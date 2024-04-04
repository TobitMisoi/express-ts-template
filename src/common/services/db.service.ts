import mysql from 'mysql';

class DBService {
    private count = 0;
    private connection: any;

    constructor() {
    }
}

const pool = mysql.createPool({
  host: "localhost",
  user: "tobitmisoi",
  password: "4decode?Db",
  database: "bridj_demo",
  timezone: "utc",
});

export default pool