import mongoose from "mongoose";

export const databaseInit = async () => {
  const mongoPassword = process.env.MONGO_PASSWORD;
  if (!mongoPassword) console.error("MongoPassword Does not exists");
  const mongoUri = `mongodb+srv://demodb:${mongoPassword}@demodb.#####.mongodb.net/?retryWrites=true&w=majority`;

  try {
    const client = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxIdleTimeMS: 270000,
      minPoolSize: 2,
      maxPoolSize: 4,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log("Succefully connected to DB!");
    return client;
  } catch (err) {
    console.log("database connection failed. exiting now...");
    console.error(err);
    process.exit(1);
  }
};
