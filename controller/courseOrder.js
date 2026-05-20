import Razorpay from "razorpay";
import courseOrderHandler from "../model/courseOrder.js";
import userHandler from "../model/user.js";
import courseHandler from "../model/course.js";

const razorpay = new Razorpay({
    key_id: 'rzp_test_Sa6B94wWcm9Pu3',
    key_secret: 'NiIzyHh9pQKjh7vpQIN3rnL6',
});

export async function createOrder(req, res) {    
    try {
        const userId = req.user._id;
        const { courseId } = req.body;

        const courseData = await courseHandler.findById(courseId);
        if (!courseData) {
            return res.status(404).send(`<center>Course not found <br><a href="/home">Go Back</a></center>`);
        }

        const paidOrder = await courseOrderHandler.findOne({ courseId, userId, status: "paid" });
        if (paidOrder) {
            return res.status(409).send(`<center>Course already purchased <br><a href="/my-courses">Go To My Courses</a></center>`);
        }

        const pendingOrder = await courseOrderHandler.findOne({ courseId, userId, status: "pending" });
        if (pendingOrder) {
            return res.status(409).send(`<center>Payment already in progress. Please complete it or try again later. <br><a href="/home">Go Back</a></center>`);
        }

        const courseFees = courseData.fees;
        const order = await razorpay.orders.create({
            amount: courseFees * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),        
        });

        await courseOrderHandler({ courseId, userId, courseFees }).save();

        return res.render('pay', {
            orderId: order.id, 
            keyId: razorpay.key_id, 
            courseId: courseId,
            courseFees: courseFees
        });
    } catch (error) {
        console.log(error);
        return res.status(503).send(`<center>Network error. Please try again. <br><a href="/home">Go Back</a></center>`);
    }
}

export async function verifyPayment(req, res) {
    try {
        const userId = req.user._id;
        const courseId = req.body.courseId;

        const paidOrder = await courseOrderHandler.findOne({userId:userId,courseId:courseId,status:"paid"});
        if (paidOrder) {
            return res.redirect('/my-courses');
        }

        await courseOrderHandler.findOneAndUpdate(
            {userId:userId,courseId:courseId,status:"pending"},
            {status:"paid"}
        );
        return res.redirect('/my-courses');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`<center>Unable to verify payment. Please contact support. <br><a href="/my-courses">Go Back</a></center>`);
    }
};
