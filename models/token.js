import {model,Schema} from 'mongoose'

const tokenSchema = new Schema(
    {
        userId: {
            type:String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        updatedAt:{
            type: Date,
            expires: '30d',
            default: Date.now
        }
    },
    {
        timestamps:true
    }
)

const Token = model('tokens',tokenSchema)
export default Token