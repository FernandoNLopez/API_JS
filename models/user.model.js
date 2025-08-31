import mongoose from "mongoose";


// construccion de parametros de módelo
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'User name is required'],
        trim: true,
        minLength: 3,
        maxLength: 50,
    },  
    email: {
    type: String,
    required: [true, 'User email is required.'],
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 10,
    maxLength: 200,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address.']
},
password: {
    type: String,
    required: [true, 'User password is required.'],
    minLength: 6,
}
}, {  timestamps: true  });

//declarar el modelo para crear instancias de usuario usando ese modelo de base
const User = mongoose.model('User', userSchema);

export default User;