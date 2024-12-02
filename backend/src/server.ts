import app from "./app";
import env from "./utils/validateENV";
import mongoose from "mongoose";

const port = env.PORT || 5000;

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Mongoose connected!");

    // trigger the server to accept requests
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(console.error);
