import ShortUniqueId from 'short-unique-id';
import OrderModel from "../models/orders.js";


const orderHelpers = {
    getAllOrders:async()=>{
        return await OrderModel.find({},{__v:0}).sort({updatedAt:-1})
    },
    getAnOrder:async(_id)=>{
        return await OrderModel.findOne({_id},{__v:0})
    },
    placeOrder:async(userData)=>{
        const { randomUUID } = new ShortUniqueId({ length: 10 });
        const newOrder = new OrderModel({
            ...userData,
            referenceId:randomUUID(),
            orderStatus:"Pending",
            paymentStatus:"Pending"
        })
        
        return await newOrder.save()
    },
    updateStatus:async(_id,status)=>{
        return await OrderModel.updateOne({_id},{$set:status})
    },
    getStatus:async(referenceId)=>{
        return await OrderModel.findOne({referenceId},{_id:0,orderStatus:1,ticketUrl:1})
    },
    uploadInvoice:async(_id,ticketUrl)=>{
        return await OrderModel.updateOne({_id},{$set:{ticketUrl,orderStatus:"Completed"}})
    }
}

export default orderHelpers;