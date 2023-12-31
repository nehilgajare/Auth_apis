import mongoose from "mongoose"
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(email){
                const emailRegex =/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                return emailRegex.test(email);
            },
            message:"Email format is Invalid"
        },
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator:function(password){
                return password.length >=8
            },
            message:"Password must be atleast 8 characters"
        },
    },
    confirmPassword:{
        type:String,
        required:true,
        validate:{
            validator:function(confirmPassword){
                return confirmPassword===this.password
            },
            message:"Password not matched"
        },
    },
})

userSchema.pre("save",async function(next){
    const user = this;
    if(!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password,salt);
        user.password=hashedPassword;
        next();
    } catch (error) {
        
    }
})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.confirmPassword=undefined;
    }
    next();
})
 
export default mongoose.model("user",userSchema)