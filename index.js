const app = require("./src/app");
PORT = 3001;

app.listen(PORT, () => {
  console.log(`Serve running on ${PORT}`);
});
