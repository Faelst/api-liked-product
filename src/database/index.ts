import mongoose from 'mongoose'

mongoose.connect('')
mongoose.Promise = global.Promise;

export default mongoose;