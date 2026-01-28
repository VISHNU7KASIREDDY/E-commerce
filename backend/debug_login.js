const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/user.js');

dotenv.config();

const debugLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        const email = 'vishnukasireddy28@gmail.com';
        const password = '123456';

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User NOT FOUND:', email);
            process.exit(1);
        }
        console.log('✅ User FOUND:', user.email);
        console.log('   Stored Hashed Password:', user.password);

        // 2. Test password match using bcrypt directly
        const isMatchBcrypt = await bcrypt.compare(password, user.password);
        console.log(`\n🔍 Direct bcrypt.compare('${password}', hash):`, isMatchBcrypt);

        // 3. Test password match using model method
        const isMatchModel = await user.matchPassword(password);
        console.log(`🔍 User.matchPassword('${password}'):`, isMatchModel);

        if (isMatchBcrypt && isMatchModel) {
            console.log('\n✅ Login logic is CORRECT at database level.');
        } else {
            console.log('\n❌ Login logic FAILED at database level.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugLogin();
