exports.home = async function (res) {
    try {
        const response = {"message":"Welcome to Fake StackOverflow API"}
        res.send(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}