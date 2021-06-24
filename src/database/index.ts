import mongoose from "mongoose";


let database: mongoose.Connection;

export const connect = () => {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.uv0uh.mongodb.net/liked_products_project`;
    
    if (database) {
        return;
    }
    
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    
    database = mongoose.connection;

    database.once("open", async (ref) => {
        console.log("Conectao ao MongoDb");
    });

    database.on("error", () => {
        console.log("Erro ao Conectar ao mongo");
    });
};

export const disconnect = () => {
    if (!database) {
        return;
    }
    mongoose.disconnect();
};