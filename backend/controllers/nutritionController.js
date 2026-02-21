exports.predictNutrition = (req, res) => {
    try {
        const month = parseInt(req.body.pregnancy_month);

        if (!month || isNaN(month)) {
            return res.status(400).json({ message: 'pregnancy_month is required and must be a number.' });
        }

        let trimester = "First Trimester";
        let recommended_foods = [];
        let avoid_foods = [];

        if (month >= 1 && month <= 3) {
            trimester = "First Trimester";
            recommended_foods = [
                "Folic acid rich foods",
                "Fruits",
                "Leafy vegetables",
                "Dairy products"
            ];
            avoid_foods = [
                "Junk food",
                "Caffeine",
                "Raw meat"
            ];
        } else if (month >= 4 && month <= 6) {
            trimester = "Second Trimester";
            recommended_foods = [
                "Iron rich foods",
                "Protein rich foods",
                "Whole grains",
                "Vegetables"
            ];
            avoid_foods = [
                "Oily food",
                "Processed food",
                "Sugary drinks"
            ];
        } else {
            // 7 to 9
            trimester = "Third Trimester";
            recommended_foods = [
                "Calcium rich foods",
                "Milk",
                "Nuts",
                "Energy giving foods"
            ];
            avoid_foods = [
                "Fried food",
                "High sugar intake"
            ];
        }

        return res.json({
            trimester,
            recommended_foods,
            avoid_foods
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
