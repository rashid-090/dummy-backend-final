import vine,{errors} from "@vinejs/vine";
import configKeys from "../config/configKeys.js"
import orderHelpers from "../helpers/orderHelpers.js"
import locationService from "../utils/locationService.js";
import statusUpdation from "../utils/orderStatusUpdationJob.js";
import axios from 'axios'

const orderControllers = () => {
    const createPaymentSession = async (req, res) => {
        const { total, orderId, referenceId, currency } = req.body

        const options = {
            method: 'POST',
            url: 'https://api-v2.ziina.com/api/payment_intent',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${configKeys.ZIINA_API_KEY}`
            },
            data: {
                amount: parseFloat(total) * 100,
                currency_code: currency,
                message: 'Wish You Happy and Safe Journey',
                success_url: `${configKeys.CLIENT_URL}/payment-success/${orderId}/${referenceId}`,
                cancel_url: `${configKeys.CLIENT_URL}/canceled/${orderId}`
            }
        };
        await axios
            .request(options)
            .then(function (response) {
                return res.status(200).json({ status: true, url: response.data.redirect_url,paymentId:response.data.id });
            })
            .catch(function (error) {
                console.error(error);
                return res.status(500).json({ status: false, message: "Internal server error" })
            });

    }

    const placeAnOrder = async (req, res) => {
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
        const schema = vine.object({
            passengerCount:vine.number().positive().min(1).max(100).withoutDecimals(),
            serviceType:vine.string().in(["flight","flightwithhotel"]),
            isRoundTrip:vine.boolean(),
            fastProcess:vine.boolean(),
            purpose:vine.string().in(["visaProof","travelProof"]),
            email:vine.string().email(),
            mobileNumber:vine.string().maxLength(20),
            journeyLocation:vine.object({
                from:vine.string().minLength(1),
                to:vine.string().minLength(1)
            }),
            date:vine.object({
                startDate:vine.string(),
                returnDate:vine.string()
            }),
            passengerData:vine.array(
                vine.object({
                    title: vine.string().minLength(2).maxLength(4),
                    firstName: vine.string().minLength(1).maxLength(20),
                    lastName: vine.string().minLength(1).maxLength(20)
                })
            ).minLength(1).notEmpty().maxLength(50)
        })
        try {
            const validator = vine.compile(schema)
            const output = await validator.validate(req.body)
            
            const { isRoundTrip, fastProcess, passengerCount, serviceType, ...userData } = { ...output }
            const locationPriceResponse = await locationService.getLocationPrice(ip, { isRoundTrip, fastProcess, passengerCount, serviceType })
            userData.email = userData.email.toLowerCase()
            if (locationPriceResponse?.status) {
                const tripType = isRoundTrip ? "Round Trip" : "One Way";
                const processingSpeed = fastProcess ? "Fast" : "Normal";
                const orderResponse = await orderHelpers.placeOrder({ tripType, processingSpeed, passengerCount, serviceType, ...locationPriceResponse.data, ...userData })
                if (orderResponse) {
                    statusUpdation(true, orderResponse._id)
                    return res.status(200).json({ status: true, message: "Order success", data: { orderId: orderResponse._id, referenceId: orderResponse.referenceId, total: orderResponse.total, currency: locationPriceResponse.data.currency } })
                }
            }
            return res.status(200).json({ status: false, message: "Order Unsuccessful" })
        } catch (error) {
            if(error instanceof errors.E_VALIDATION_ERROR){
                return res.status(400).json({status:false,message:error.messages})
            }
            console.error("Error placing order", error);
            return res.status(500).json({ status: false, message: "Internal error" })
        }
    }

    const getOrderStatus = async (req, res) => {
        try {
            const { referenceId } = req.params
            const getStatus = await orderHelpers.getStatus(referenceId)
            if (getStatus) {
                if (getStatus?.orderStatus == "Completed") {
                    return res.status(200).json({ status: true, message: getStatus.orderStatus, ticketUrl: getStatus.ticketUrl })
                }
                return res.status(200).json({ status: true, message: getStatus.orderStatus, ticketUrl: "" })
            } else {
                return res.status(200).json({ status: false, message: "Enter valid Reference id" })
            }
        } catch (error) {
            console.error("Error getting order status", error);
            return res.status(500).json({ status: false, message: "Internal error" })
        }
    }

    const updateZiinaPayment = async (req, res) => {
        const {orderId,paymentId} = req.body

        try {
            const options = {
                method: 'GET',
                url: `https://api-v2.ziina.com/api/payment_intent/${paymentId}`,
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${configKeys.ZIINA_API_KEY}`
                }
            };

            await axios
                .request(options)
                .then(async function (response) {
                    console.log("status",response.data.status);
                    switch (response.data.status) {
                        case "requires_payment_instrument":
                            return res.status(200).json({ status: false, message: "Payment attempt is pending" })
                        case "completed":
                            statusUpdation(false, orderId)
                            await orderHelpers.updateStatus(orderId, { paymentStatus: "Success", orderStatus: "Pending" })
                            return res.status(200).json({ status: true, message: "Payment successful" })
                        case 'pending':
                            return res.status(200).json({ status: false, message: "Payment is pending" })
                        case 'failed':
                            return res.status(200).json({ status: false, message: "Payment failed" })
                        default:
                            break;
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });

            // return res.status(200).json({ status: true, message: "Payment successful" })
        } catch (err) {
            console.log("Error getting payment status", err.message);
            return res.status(500).json({ status: false, message: "Error in getting payment status" })
        }
    }

    return {
        placeAnOrder,
        getOrderStatus,
        createPaymentSession,
        updateZiinaPayment
    }
}

export default orderControllers;