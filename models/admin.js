import { model, Schema } from "mongoose";


const AdminSchema = new Schema (
    {
        name: {
            type: String,
            default: 'Admin'
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const AdminModel = model('admin', AdminSchema);
export default AdminModel;

