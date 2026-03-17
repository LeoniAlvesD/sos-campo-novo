// Assuming you have a renderItem function defined somewhere else in your code
// Here's how you can update lines 44-65

renderItem = ({ item }) => {
    return (
        <View style={styles.cardContainer}>
            <Text style={styles.cardText}>{item.title}</Text> {/* Removed arrow from here */}
            <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>›</Text> {/* Now only in arrowContainer */}
            </View>
        </View>
    );
};
