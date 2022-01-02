import mongoose from 'mongoose'

const { MONGODB_URI } = process.env
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true
})
.then(()=>{
  console.log('connected to MongoDB')
}).catch(error => {
  console.error('error connection to MongoDB' ,error.message)
})