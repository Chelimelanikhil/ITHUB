import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const HEADER_MAX_HEIGHT = 250;

// ReviewCard Component to display individual reviews
const ReviewCard = ({ rating, title, content, author, date }) => {
    // Format the date to "Month Year"
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= Math.round(rating) ? 'star' : 'star-o'}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
          <Text style={styles.reviewDate}>{formattedDate}</Text>
        </View>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewContent}>{content}</Text>
        <Text style={styles.reviewAuthor}>{author}</Text>
      </View>
    );
  };
// Reviews Component to display all reviews dynamically
const Reviews = ({ reviews }) => (
  <ScrollView
    style={styles.tabContent}
    contentContainerStyle={styles.tabContentContainer}
    scrollEventThrottle={16}
  >
    {reviews.length > 0 ? (
      reviews.map((review, index) => (
        <ReviewCard
          key={index}
          rating={review.rating}
          title={review.title || 'Review'}
          content={review.text}
          author={review.author || 'Anonymous'}
          date={review.date || new Date()}
        />
      ))
    ) : (
      <Text style={styles.noReviews}>No reviews available.</Text>
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContentContainer: {
    paddingTop: HEADER_MAX_HEIGHT + 48, // Header height + TabBar height
    minHeight: Dimensions.get('window').height + HEADER_MAX_HEIGHT,
  },
  reviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    color: '#666',
    fontSize: 12,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  reviewContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewAuthor: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  noReviews: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default Reviews;
