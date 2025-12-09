// db.js
import { Index } from "@upstash/vector";

// PASTE YOUR NEW KEYS HERE
const URL = "https://true-redbird-24863-us1-vector.upstash.io";
const TOKEN = "ABYFMHRydWUtcmVkYmlyZC0yNDg2My11czFhZG1pbk1URmlORFkyTWpVdE9EZ3dNUzAwT1RjeUxXSTBNVGt0TVdNeFpqWmhZMlE0TURJNQ==";

const index = new Index({
  url: URL,
  token: TOKEN,
});

export { index };