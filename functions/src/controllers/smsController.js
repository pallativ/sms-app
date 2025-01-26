
exports.sendSms = async (req, res) => {
    try {
        const { to, message } = req.body;
        const result = await smsService.sendSms(to, message);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.queueSms = async (req, res) => {
    try {
        const { to, message } = req.body;
        const result = await smsService.queueSms(to, message);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

