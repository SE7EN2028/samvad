import User from "../models/user.model.js";

const DEMO_USERNAME = "demo_user";
const DEMO_EMAIL = "demoaccount@gmail.com";
const DEMO_PASSWORD = "demo123";

const seedDemoUser = async () => {
    try {
        const existing = await User.findOne({ username: DEMO_USERNAME });
        if (existing) return;

        const demoUser = new User({
            username: DEMO_USERNAME,
            email: DEMO_EMAIL,
            fullName: "Demo User",
            password: DEMO_PASSWORD,
            profilePic: `https://avatar.iran.liara.run/public/boy?username=${DEMO_USERNAME}`,
        });

        await demoUser.save();
        console.log("Demo user seeded");
    } catch (error) {
        console.error("Error seeding demo user:", error.message);
    }
};

export default seedDemoUser;
