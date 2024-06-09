import orderHelpers from "../helpers/orderHelpers.js";

const statusUpdation = (status,_id)=>{
    let timerId;
    const setFailedStatus = ()=>{
        timerId = setTimeout(async () => {
            await orderHelpers.updateStatus(_id, { paymentStatus: "Failed",orderStatus:"Canceled"})
        }, 300000);
    }

    if(status){
        setFailedStatus()
    }else{
        clearTimeout(timerId)
    }
}

export default statusUpdation