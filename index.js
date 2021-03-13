import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/user-routes.js';

const app = express();

app.use('/user', userRoutes);

app.use(bodyParser.json({ limit : "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());

//store connection in Env variables before deploying
const CONNECTION_URL = "mongodb+srv://mansukhp96:Tempe$t1996@cluster0.84cib.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true,useUnifiedTopology:true })
    .then(() => app.listen(PORT, () => { console.log(`Server running on port: ${PORT}`) }))
    .catch((error) => { console.log(error) })

mongoose.set('useFindAndModify', false);